import	{NextApiRequest, NextApiResponse}	from	'next';
import	axios								from	'axios';
import	{request}							from	'graphql-request';
import	{Contract}							from	'ethcall';
import	{ethers, BigNumber}					from	'ethers';
import	{createHash}						from	'crypto';
import	VAULT_ABI							from	'utils/abi/vaults.abi';
import	STRATEGY_ABI						from	'utils/abi/strategies.abi';
import	PRICE_ORACLE_ABI					from	'utils/abi/priceOracle.abi';
import	{TVault, TStrategyReport}			from	'contexts/useWatch.d';
import	* as utils							from	'@majorfi/web-lib/utils';

const MINUTES = 60 * 1000;
const ETH_ORACLE_CONTRACT_ADDRESS = '0x83d95e0d5f402511db06817aff3f9ea88224b030';
const FTM_ORACLE_CONTRACT_ADDRESS = '0x57aa88a0810dfe3f9b71a9b179dd8bf5f956c46a';
const GRAPH_REQUEST= `{
  _meta {
		hasIndexingErrors
		block {
			number
		}
	}
	vaults(first: 1000) {
		id
		balanceTokens
		tokensDepositLimit
		managementFeeBps
		performanceFeeBps
		strategies {
			address
			reports(first: 10, orderBy: timestamp, orderDirection: desc) {
				id
				totalDebt
				totalLoss
				totalGain
				debtLimit
				debtPaid
				debtAdded
				loss
				gain
				timestamp
				results {
				  apr
				  duration
				  durationPr
				}
			}
			doHealthCheck
			healthCheck
		}
	}
}`;

function getTvlImpact(tvl: number): number {
	if (tvl === 0)
		return 0;
	if (tvl < 1_000_000)
		return 1;
	if (tvl < 10_000_000)
		return 2;
	if (tvl < 50_000_000)
		return 3;
	if (tvl < 100_000_000)
		return 4;
	return 5;
}

type	TGetVaults = {
	vaults: TVault[],
	network: {
		status: {
			rpc: number,
			graph: number,
			yearnApi: number,
			yearnMeta: number,
		}
		blockNumber: number,
		graphBlockNumber: number,
		hasGraphIndexingErrors: boolean,
	}
}
export async function getVaults(
	chainID: number,
	isLocal = false,
	providedProvider?: string,
	providedGraph?: string
): Promise<TGetVaults> {
	const	status = {
		rpc: 1,
		graph: 1,
		yearnApi: 1,
		yearnMeta: 1
	};
	let	rpcProvider = utils.providers.getProvider(chainID || 1);
	if (isLocal && providedProvider) {
		rpcProvider = new ethers.providers.JsonRpcProvider(providedProvider);
	}

	let	graphProvider = process.env.GRAPH_URL?.[chainID || 1] as string;
	if (isLocal && providedGraph) {
		graphProvider = providedGraph;
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Data are dispatched between the different sources, and thus we need to
	** call them all to get the big picture:
	** - api.yearn.finance contains a lot of general data about the vaults
	** - meta.yearn.network is used to get the humanized name, the description
	**   and the protocols for each strategy. Data are localized.
	** - the subgraph allows us to get some missing data, like the reports, the
	**   apr etc.
	**************************************************************************/
	const	[_vaultsInitialsRaw, _strategiesRaw, _graphRaw, _blockNumberRaw] = await Promise.allSettled([
		axios.get(`https://api.yearn.finance/v1/chains/${chainID || 1}/vaults/all`),
		axios.get(`https://meta.yearn.network/strategies/${chainID || 1}/all`),
		request(graphProvider, GRAPH_REQUEST),
		rpcProvider.getBlockNumber()
	]);

	//If Yearn api is down, we are screwed (for now, fallback should be added)
	if (_vaultsInitialsRaw.status === 'rejected') {
		status.yearnApi = 0;
		return ({
			vaults: [],
			network: {
				status,
				blockNumber: Number(0),
				graphBlockNumber: 0,
				hasGraphIndexingErrors: true
			}
		});
	}
	const _vaultsInitials = _vaultsInitialsRaw.value.data;

	//If Yearn meta is down, that's ok, we can still display some data
	let	_strategies = [];
	if (_strategiesRaw.status === 'rejected') {
		status.yearnMeta = 0;
	} else {
		_strategies = _strategiesRaw.value.data;
	}

	//If the graph is down, that's not great but we can still display some elements
	let	_graph = [];
	if (_graphRaw.status === 'rejected') {
		status.graph = 0;
	} else {
		_graph = _graphRaw.value;
	}

	//If the RPC is down, that's bad, and it's time to kill
	if (_blockNumberRaw.status === 'rejected') {
		status.rpc = 0;
		return ({
			vaults: [],
			network: {
				status,
				blockNumber: Number(0),
				graphBlockNumber: 0,
				hasGraphIndexingErrors: true
			}
		});
	} 
	const	_blockNumber = _blockNumberRaw.value;

	/* 🔵 - Yearn Finance ******************************************************
	** We need to skip migrated vaults for now, as well as vaults that are
	** older than v2 (v1).
	** TODO: Add type for the api call
	** QUESTION: should we keep migrated vaults?
	**************************************************************************/
	let	_vaults: TVault[] = _vaultsInitials.filter((v: {migration?: {available: boolean}}): boolean => v.migration === null || !(v.migration?.available ?? true));
	_vaults = _vaults.filter((v: {type: string}): boolean => v.type === 'v2');

	/* 🔵 - Yearn Finance ******************************************************
	** Prepare and execute a multicall to get some missing data. Right now,
	** stuff like the guardian, the management etc. are not available in the
	** previous calls. Some elements about the strategies are not either.
	** So, for each vault, get the withdrawal queue (to detect not-used
	** strategies), some more vault data, then, for each strategies for this
	** vault, retrieve some more data from the vault contract but also from
	** the strategy contract itself.
	**************************************************************************/
	const	ethcallProvider = await utils.providers.newEthCallProvider(rpcProvider);
	const	multiCalls = [];
	const	priceOracleContract = new Contract(
		(chainID || 1) === 1 ? ETH_ORACLE_CONTRACT_ADDRESS : FTM_ORACLE_CONTRACT_ADDRESS,
		PRICE_ORACLE_ABI
	);
	for (const vault of _vaults) {
		const	isV2Vault = Number(vault.version.replace('.', '')) <= 3;
		const	contractVault = new Contract(vault.address, isV2Vault ? VAULT_ABI['v0.2.x'] : VAULT_ABI['v0.4.x']);
		[...Array(20).keys()].map((i): number => multiCalls.push(contractVault.withdrawalQueue(i)));
		multiCalls.push(contractVault.guardian());
		multiCalls.push(contractVault.management());
		multiCalls.push(contractVault.governance());
		multiCalls.push(contractVault.rewards());
		multiCalls.push(contractVault.availableDepositLimit());
		multiCalls.push(contractVault.depositLimit());
		multiCalls.push(priceOracleContract.getPriceUsdcRecommended(vault.token.address));
		for (const strategy of vault.strategies) {
			multiCalls.push(contractVault.creditAvailable(strategy.address));
			multiCalls.push(contractVault.debtOutstanding(strategy.address));
			multiCalls.push(contractVault.strategies(strategy.address));
			multiCalls.push(contractVault.expectedReturn(strategy.address));
			const	contractStrat = new Contract(strategy.address, STRATEGY_ABI);
			multiCalls.push(contractStrat.apiVersion());
			multiCalls.push(contractStrat.emergencyExit());
			multiCalls.push(contractStrat.estimatedTotalAssets());
			multiCalls.push(contractStrat.isActive());
			multiCalls.push(contractStrat.keeper());
			multiCalls.push(contractStrat.strategist());
			multiCalls.push(contractStrat.rewards());
		}
	}
	const	callResult = await ethcallProvider.tryAll(multiCalls);

	/* 🔵 - Yearn Finance ******************************************************
	** Multicall is executed, now we need to assign the data to the vault type
	** to make them available to the app.
	** The multicalls returns an array, and we will use rIndex as iterator to
	** get each element.
	** IMPORTANT: returned data are in the same order than the multicall query.
	**
	** For each vaults from the list, we will check if we have a subgraph
	** matching element, and we will assign the fetched data to it.
	** This is where we will also assign the strategies metadata to the vaults
	** strategies.
	**************************************************************************/
	let	rIndex = 0;
	const	vaultsDetails = _graph?.vaults || [];
	for (const vault of _vaults) {
		const	isV2Vault = Number(vault.version.replace('.', '')) <= 3;
		const	vaultDetails = vaultsDetails.find((detail: {id: string}): boolean => utils.toAddress(detail.id) === utils.toAddress(vault.address));
		const	withdrawalQueue: string[] = [];
		for (let i = 0; i < 20; i++) {
			const	addr = utils.toAddress(callResult[rIndex++] as string);
			if (!utils.isZeroAddress(addr))
				withdrawalQueue.push(addr as string);
		}
		vault.alerts = [];
		vault.explorer = utils.chains[(chainID || '1') as keyof typeof utils.chains].block_explorer;
		vault.guardian = utils.toAddress(callResult[rIndex++] as string);
		vault.management = utils.toAddress(callResult[rIndex++] as string);
		vault.governance = utils.toAddress(callResult[rIndex++] as string);
		vault.rewards = utils.toAddress(callResult[rIndex++] as string);
		vault.availableDepositLimit = BigNumber.from(callResult[rIndex++] || 0);
		vault.depositLimit = BigNumber.from(callResult[rIndex++] || 0);
		vault.tokenPriceUSDC = Number(ethers.utils.formatUnits(BigNumber.from(callResult[rIndex++] || 0), 6));
		if (utils.isZeroAddress(vault.guardian)) vault.alerts.push({level: 'warning', message: 'Guardian is not set'});
		if (utils.isZeroAddress(vault.management)) vault.alerts.push({level: 'warning', message: 'Management is not set'});
		if (utils.isZeroAddress(vault.governance)) vault.alerts.push({level: 'warning', message: 'Governance is not set'});
		if (utils.isZeroAddress(vault.rewards)) vault.alerts.push({level: 'warning', message: 'Rewards is not set'});
		if (Number(vault.availableDepositLimit) === 0) vault.alerts.push({level: 'warning', message: 'Available deposit limit is zero'});
		if (Number(vault.depositLimit) === 0) vault.alerts.push({level: 'warning', message: 'Deposit limit is zero'});
		if (vaultDetails) {
			vault.balanceTokens = BigNumber.from(vaultDetails.balanceTokens);
			vault.tokensDepositLimit = BigNumber.from(vaultDetails.tokensDepositLimit);
			vault.managementFeeBps = BigNumber.from(vaultDetails.managementFeeBps);
			vault.performanceFeeBps = BigNumber.from(vaultDetails.performanceFeeBps);
			if (Number(vault.managementFeeBps) === 0) vault.alerts.push({level: 'warning', message: 'Management fee is zero'});
			if (Number(vault.performanceFeeBps) === 0) vault.alerts.push({level: 'warning', message: 'Performance fee is zero'});
		}
		vault.alertHash = createHash('sha256').update(`${vault.address}_${JSON.stringify(vault.alerts)}`).digest('hex');

		for (const strategy of vault.strategies) {
			strategy.alerts = [];
			strategy.creditAvailable = BigNumber.from(callResult[rIndex++]) || BigNumber.from(0);
			strategy.debtOutstanding = BigNumber.from(callResult[rIndex++]) || BigNumber.from(0);
			const	strategyData = callResult[rIndex++] as {[key: string]: unknown};
			strategy.performanceFee = BigNumber.from(strategyData.performanceFee || 0);
			strategy.activation = BigNumber.from(strategyData.activation).toString();
			strategy.debtRatio = BigNumber.from(strategyData.debtRatio || 0);
			strategy.minDebtPerHarvest = BigNumber.from(strategyData.minDebtPerHarvest || 0);
			strategy.maxDebtPerHarvest = BigNumber.from(strategyData.maxDebtPerHarvest || 0);
			strategy.lastReport = BigNumber.from(strategyData.lastReport || 0);
			strategy.totalDebt = BigNumber.from(strategyData.totalDebt || 0);
			strategy.totalGain = BigNumber.from(strategyData.totalGain || 0);
			strategy.totalLoss = BigNumber.from(strategyData.totalLoss || 0);
			strategy.expectedReturn = BigNumber.from(callResult[rIndex++]) || BigNumber.from(0);
			strategy.apiVersion = callResult[rIndex++] as string;
			strategy.isEmergencyExit = callResult[rIndex++] as boolean;
			strategy.estimatedTotalAssets = BigNumber.from(callResult[rIndex++] || 0);
			strategy.isActive = callResult[rIndex++] as boolean;
			strategy.addrKeeper = utils.toAddress(callResult[rIndex++] as string);
			strategy.addrStrategist = utils.toAddress(callResult[rIndex++] as string);
			strategy.addrRewards = utils.toAddress(callResult[rIndex++] as string);
			strategy.totalDebtUSDC = Number(ethers.utils.formatUnits(strategy.totalDebt, vault.decimals)) * (vault.tokenPriceUSDC || 0);
			strategy.tvlImpact = getTvlImpact(strategy.totalDebtUSDC);

			const	index = withdrawalQueue.findIndex((address: string): boolean => address === utils.toAddress(strategy.address));
			strategy.index = index === -1 ? 21 : index;
			if (index === -1) {
				strategy.alerts.push({level: 'warning', message: 'Strategy is not in withdrawal queue'});
				if (strategy.tvlImpact > 0) {
					strategy.alerts.push({level: 'error', message: 'Strategy with debt is not in withdrawal queue'});
				}
			}
			if (strategy.isEmergencyExit)
				strategy.alerts.push({level: 'critical', message: 'Emergency mode enabled'});
			if (!strategy.isActive && strategy.tvlImpact > 0)
				strategy.alerts.push({level: 'error', message: 'Strategy with debt not active'});
			if (strategy.shouldDoHealthCheck || !utils.isZeroAddress(strategy.addrHealthCheck))
				strategy.alerts.push({level: 'warning', message: 'Strategy has healthcheck issue'});

			const	isV2Strategy = Number(strategy.apiVersion.replace('.', '')) <= 3;
			if ((isV2Strategy && !isV2Vault) || (!isV2Strategy && isV2Vault))
				strategy.alerts.push({level: 'warning', message: `Strategy (${strategy.apiVersion}) and Vault (${vault.version}) version mismatch`});


			const strategyMeta = _strategies.find((_detailFromMeta: {addresses: string[]}): boolean => _detailFromMeta.addresses.includes(strategy.address));
			if (strategyMeta) {
				strategy.display_name = strategyMeta?.name || strategy.name;
				strategy.description = strategyMeta.description;
				strategy.protocols = strategyMeta.protocols;
			}
			strategy.vault = {
				address: vault.address,
				name: vault.display_name,
				icon: vault.icon,
				decimals: vault.decimals,
				tokenPriceUSDC: vault.tokenPriceUSDC,
				explorer: vault.explorer
			};

			if (vaultsDetails) {
				const	strategyDetails = (vaultDetails?.strategies || []).find((detail: {address: string}): boolean => utils.toAddress(detail.address) === utils.toAddress(strategy.address));
				if (strategyDetails) {
					const	cumulativeAPR = strategyDetails.reports.reduce((acc: number, report: any): number => acc + Number(report?.results?.[0]?.apr || 0), 0);
					strategy.apr = cumulativeAPR / (strategyDetails?.reports?.length || 1);
					strategy.shouldDoHealthCheck = strategyDetails.doHealthCheck;
					strategy.addrHealthCheck = utils.toAddress(strategyDetails.healthCheck);

					//Handle reports
					strategy.reports = [];
					for (const report of strategyDetails.reports) {
						const _report: TStrategyReport = {
							id: report.id as string,
							timestamp: report.timestamp as string,
							duration: report.results[0]?.duration as string,
							apr: Number(report.results[0]?.apr),
							durationPR: Number(report.results[0]?.durationPr),
							debtLimit: BigNumber.from(report.debtLimit),
							debtPaid: BigNumber.from(report.debtPaid),
							debtAdded: BigNumber.from(report.debtAdded),
							totalDebt: BigNumber.from(report.totalDebt),
							totalLoss: BigNumber.from(report.totalLoss),
							totalGain: BigNumber.from(report.totalGain),
							loss: BigNumber.from(report.loss),
							gain: BigNumber.from(report.gain)
						};
						strategy.reports.push(_report);
					}
				}
			}

			strategy.alertHash = createHash('sha256').update(`${vault.address}_${strategy.address}_${JSON.stringify(vault.alerts)}`).digest('hex');
		}
	}

	return ({
		vaults: _vaults,
		network: {
			status,
			blockNumber: Number(_blockNumber),
			graphBlockNumber: _graph?._meta?.block?.number || 0,
			hasGraphIndexingErrors: _graph?._meta ? _graph._meta.hasIndexingErrors : true
		}
	});
}

type	TCache = {
	[key: number]: {
		access: number,
		data: TGetVaults
	}
};
const	cache: TCache = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<string|undefined> {
	const	shouldRevalidate = req.query?.revalidate === 'true';
	const	chainID = Number(req.query.chainID || 1);
	const	now = Date.now().valueOf();

	if (!(chainID in cache) || cache[chainID].access === 0 || ((now - cache[chainID].access) > 10 * MINUTES) || shouldRevalidate) {
		const	_vaults = await getVaults(chainID);
		cache[chainID] = {data: _vaults, access: new Date().valueOf()};
	}

	if (res) {
		res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=600');
		res.status(200).json(cache[chainID]);
		return;
	}
	return JSON.stringify(cache[chainID]);
}
