import	{NextApiRequest, NextApiResponse}		from	'next';
import	axios									from	'axios';
import	{request}								from	'graphql-request';
import	{Contract}								from	'ethcall';
import	{ethers, BigNumber}						from	'ethers';
import	{createHash}							from	'crypto';
import	VAULT_ABI								from	'utils/abi/vaults.abi';
import	STRATEGY_ABI							from	'utils/abi/strategies.abi';
import	PRICE_ORACLE_ABI						from	'utils/abi/priceOracle.abi';
import	{TVault, TStrategyReport, TGraphVault}	from	'contexts/useWatch.d';
import	* as utils								from	'@yearn/web-lib/utils';
import	{getTvlImpact}							from	'utils';

// eslint-disable-next-line @typescript-eslint/naming-convention
const	MINUTES = 60 * 1000;
const	ETH_ORACLE_CONTRACT_ADDRESS = '0x83d95e0d5f402511db06817aff3f9ea88224b030';
const	FTM_ORACLE_CONTRACT_ADDRESS = '0x57aa88a0810dfe3f9b71a9b179dd8bf5f956c46a';
const	GRAPH_REQUEST = `{
  _meta {
		hasIndexingErrors
		block {
			number
		}
	}
	vaults(first: 1000) {
		id
		guardian
		management
		governance
		rewards
		availableDepositLimit
		depositLimit
		balanceTokens
		balanceTokensIdle
		# balanceTokensInvested - Disabled as not working on FTM
		managementFeeBps
		performanceFeeBps
		apiVersion
		shareToken {
			decimals
			id
			name
			symbol
		}
		token {
			decimals
			id
			name
			symbol
		}
		strategies {
			address
			name
			apiVersion
			emergencyExit
			# estimatedTotalAssets - Disabled as not working on FTM
			# isActive - Disabled as not working on FTM
			keeper
			strategist
			rewards
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

/* 🔵 - Yearn Finance ******************************************************
** We could use the API as source of truth. The API is the easy path, with
** a lot of precompiled informations, but mostly on the current vaults.
** Some vaults and/or strategies may not be included in the API.
**************************************************************************/
function	givePriorityToAPI(_vaultsInitials: any[]): TVault[] {
	// Shallow copy to clean work
	let	_vaults: TVault[] = [..._vaultsInitials];

	//Filter to only get V2 vaults
	_vaults = _vaults.filter((v): boolean => v.type === 'v2');

	return _vaults;
}

/* 🔵 - Yearn Finance ******************************************************
** We could use the subgraph as source of truth. The subgraph may have much
** more data than the API, but some may be irrelevant now (strategy and 
** vaults no longer in production for example).
**************************************************************************/
function	givePriorityToGraph(vaults: TGraphVault[], _vaultsInitials: any[], chainID: number, shouldDisplayWithNoDebt = true): TVault[] {
	let _vaults: TVault[] = [];
	for (const vault of vaults) {
		const	vaultFromAPI = _vaultsInitials.find((v: TVault): boolean => utils.toAddress(v.address) === utils.toAddress(vault.id));
		const	_vault: TVault = {
			name: vault.shareToken.name,
			display_name: vaultFromAPI?.display_name || '',
			symbol: vault.shareToken.symbol,
			decimals: Number(vault.shareToken.decimals),
			icon: vaultFromAPI?.icon || '',
			version: vault.apiVersion || '0',
			explorer: utils.chains[(chainID || '1') as keyof typeof utils.chains].block_explorer,
			alertHash: '',
			tokenPriceUSDC: 0,
			inception: Number(vault.activation),
			emergency_shutdown: vaultFromAPI?.emergency_shutdown || false,
			isHidden: false,
			address: utils.toAddress(vault.id),
			guardian: utils.toAddress(vault.guardian),
			management: utils.toAddress(vault.management),
			governance: utils.toAddress(vault.governance),
			rewards: utils.toAddress(vault.rewards),
			balanceTokens: ethers.BigNumber.from(vault.balanceTokens),
			managementFeeBps: ethers.BigNumber.from(vault.managementFeeBps),
			performanceFeeBps: ethers.BigNumber.from(vault.performanceFeeBps),
			totalSupply: ethers.BigNumber.from(0),
			depositLimit: ethers.BigNumber.from(vault.depositLimit),
			availableDepositLimit: ethers.BigNumber.from(vault.availableDepositLimit),
			alerts: [],
			token: {
				name: vault.token.name,
				symbol: vault.token.symbol,
				address: utils.toAddress(vault?.token?.id),
				decimals: Number(vault.token.decimals || 18),
				display_name: '',
				icon: ''
			},
			strategies: (vaultFromAPI?.strategies || [])?.map((s: any): any => ({
				name: s.name,
				address: utils.toAddress(s.address),
				apiVersion: s.apiVersion
			}))
		};
		if (shouldDisplayWithNoDebt) {
			_vaults.push(_vault as TVault);
		} else if (Number(vault.balanceTokensIdle) > 0 || Number(vault?.balanceTokensInvested || 0) > 0) {
			_vaults.push(_vault as TVault);
		}
	}
	_vaults = _vaults.filter((v): boolean => Number(v.version.replace('.', '')) >= 2);
	return _vaults;
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
	shouldGivePriorityToSubgraph = true,
	shouldDisplayWithNoDebt = true,
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
	let	_vaults: TVault[];
	if (shouldGivePriorityToSubgraph) {
		_vaults = givePriorityToGraph(_graph.vaults as TGraphVault[], _vaultsInitials, chainID, shouldDisplayWithNoDebt);
	} else {
		_vaults = givePriorityToAPI(_vaultsInitials);
	}

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
		const	isV2Vault = Number(vault.version.replace('.', '')) <= 3.1;
		const	contractVault = new Contract(vault.address, isV2Vault ? VAULT_ABI['v0.2.x'] : VAULT_ABI['v0.4.x']);
		[...Array(20).keys()].map((i): number => multiCalls.push(contractVault.withdrawalQueue(i)));
		multiCalls.push(priceOracleContract.getPriceUsdcRecommended(vault.token.address));
		for (const strategy of vault.strategies) {
			multiCalls.push(contractVault.creditAvailable(strategy.address));
			multiCalls.push(contractVault.debtOutstanding(strategy.address));
			multiCalls.push(contractVault.strategies(strategy.address));
			multiCalls.push(contractVault.expectedReturn(strategy.address));
			const	contractStrat = new Contract(strategy.address, STRATEGY_ABI);
			multiCalls.push(contractStrat.isActive());
			multiCalls.push(contractStrat.estimatedTotalAssets());
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
	const	vaultsDetails = _graph.vaults || [] as TGraphVault[];
	for (const vault of _vaults) {
		const	isV2Vault = Number(vault.version.replace('.', '')) <= 3;
		const	vaultDetails = vaultsDetails.find((detail: {id: string}): boolean => utils.toAddress(detail.id) === utils.toAddress(vault.address));
		const	withdrawalQueue: string[] = [];
		for (let i = 0; i < 20; i++) {
			const	addr = utils.toAddress(callResult[rIndex++] as string);
			if (!utils.isZeroAddress(addr))
				withdrawalQueue.push(addr as string);
		}

		//Let's build our data for the vault
		vault.alerts = [];
		vault.explorer = utils.chains[(chainID || '1') as keyof typeof utils.chains].block_explorer;
		vault.tokenPriceUSDC = Number(ethers.utils.formatUnits(BigNumber.from(callResult[rIndex++] || 0), 6));
		if (utils.isZeroAddress(vault.guardian)) vault.alerts.push({level: 'warning', message: 'Guardian is not set'});
		if (utils.isZeroAddress(vault.management)) vault.alerts.push({level: 'warning', message: 'Management is not set'});
		if (utils.isZeroAddress(vault.governance)) vault.alerts.push({level: 'warning', message: 'Governance is not set'});
		if (utils.isZeroAddress(vault.rewards)) vault.alerts.push({level: 'warning', message: 'Rewards is not set'});
		if (Number(vault.availableDepositLimit) === 0) vault.alerts.push({level: 'warning', message: 'Available deposit limit is zero'});
		if (Number(vault.depositLimit) === 0) vault.alerts.push({level: 'warning', message: 'Deposit limit is zero'});
		if (vaultDetails) {
			vault.balanceTokens = BigNumber.from(vaultDetails.balanceTokens);
			vault.managementFeeBps = BigNumber.from(vaultDetails.managementFeeBps);
			vault.performanceFeeBps = BigNumber.from(vaultDetails.performanceFeeBps);
			if (Number(vault.managementFeeBps) === 0) vault.alerts.push({level: 'warning', message: 'Management fee is zero'});
			if (Number(vault.performanceFeeBps) === 0) vault.alerts.push({level: 'warning', message: 'Performance fee is zero'});
			if (Number(vault.managementFeeBps) !== 200) vault.alerts.push({level: 'warning', message: 'Invalid value for management fee'});
			if (Number(vault.performanceFeeBps) !== 2000) vault.alerts.push({level: 'warning', message: 'Invalid value for performance fee'});
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
			strategy.expectedReturn = BigNumber.from(callResult[rIndex++] || 0) || BigNumber.from(0);
			strategy.isActive = callResult[rIndex++] as boolean;
			strategy.estimatedTotalAssets = BigNumber.from(callResult[rIndex++]) || BigNumber.from(0);
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

			const	isV2Strategy = Number((strategy?.apiVersion || '0').replace('.', '')) <= 3;
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
					const	reportList = [...strategyDetails.reports];
					const	cumulativeAPR = strategyDetails.reports.reduce((acc: number, report: any): number => acc + Number(report?.results?.[0]?.apr || 0), 0);
					strategy.apr = cumulativeAPR / (strategyDetails?.reports?.length || 1);
					strategy.shouldDoHealthCheck = strategyDetails.doHealthCheck;
					strategy.addrHealthCheck = utils.toAddress(strategyDetails.healthCheck);

					//Handle reports
					strategy.reports = [];
					for (const report of reportList) {
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
