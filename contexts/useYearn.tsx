import	React, {ReactElement}		from	'react';
import	axios						from	'axios';
import	NProgress					from	'nprogress';
import	{request}					from	'graphql-request';
import	{Contract}					from	'ethcall';
import	{BigNumber}					from	'ethers';
import	useWeb3						from	'contexts/useWeb3';
import	useLocalStorage				from	'hooks/useLocalStorage';
import	* as utils					from	'utils';
import	VAULT_ABI					from	'utils/abi/vaults.abi';
import	STRATEGY_ABI				from	'utils/abi/strategies.abi';
import	CHAINS						from	'utils/chains';

import	{TVault, TStrategy, TStrategyReport}			from	'contexts/useYearn.d';

const FANTOM_REQUEST= `{
	vaults {
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

type	TYearnContext = {vaults: TVault[]}
const	YearnContext = React.createContext<TYearnContext>({vaults: []});
export const YearnContextApp: React.FC = ({children}): ReactElement => {
	const	{chainID, getProvider} = useWeb3();
	const	[vaults, set_vaults] = useLocalStorage('vaults', []) as [TVault[], (vaults: TVault[]) => void];
	const	getVaultIsRunning = React.useRef(false);
	const	getVaultRunNonce = React.useRef(0);

	React.useEffect((): void => {
		getVaultIsRunning.current = false;
		getVaultRunNonce.current = getVaultRunNonce.current + 1;
	}, [chainID]);

	/* 🔵 - Yearn Finance ******************************************************
	** In order to have all the data we need for the whole app, we need to
	** fetch them all at once. This will allow us to work with them, detect the
	** missing stuffs, parse some element and so on.
	** We can only get one run of getVaults at a time, to prevent multiple
	** useless and heavy calls, and a loading bar is triggering when the
	** process is starting.
	**************************************************************************/
	const	getVaults = React.useCallback(async (): Promise<void> => {
		if (getVaultIsRunning.current) {
			return;
		}
		NProgress.start();
		getVaultIsRunning.current = true;
		const currentNonce = getVaultRunNonce.current;

		/* 🔵 - Yearn Finance ******************************************************
		** Data are dispatched between the different sources, and thus we need to
		** call them all to get the big picture:
		** - api.yearn.finance contains a lot of general data about the vaults
		** - meta.yearn.network is used to get the humanized name, the description
		**   and the protocols for each strategy. Data are localized.
		** - the subgraph allows us to get some missing data, like the reports, the
		**   apr etc.
		**************************************************************************/
		const	[_vaultsInitials, _strategies, graph] = await Promise.all([
			axios.get(`https://api.yearn.finance/v1/chains/${chainID || 250}/vaults/all`),
			axios.get(`https://meta.yearn.network/strategies/${chainID || 250}/all`),
			request('https://api.thegraph.com/subgraphs/name/yearn/yearn-vaults-v2-fantom', FANTOM_REQUEST)
		]);

		/* 🔵 - Yearn Finance ******************************************************
		** We need to skip migrated vaults for now, as well as vaults that are
		** older than v2 (v1).
		** TODO: Add type for the api call
		** QUESTION: should we keep migrated vaults?
		**************************************************************************/
		let	_vaults: TVault[] = _vaultsInitials.data.filter((v: any): boolean => v.migration === null || v.migration.available === false);
		_vaults = _vaults.filter((v: any): boolean => v.type === 'v2');

		/* 🔵 - Yearn Finance ******************************************************
		** Prepare and execute a multicall to get some missing data. Right now,
		** stuff like the guardian, the management etc. are not available in the
		** previous calls. Some elements about the strategies are not either.
		** So, for each vault, get the withdrawal queue (to detect not-used
		** strategies), some more vault data, then, for each strategies for this
		** vault, retrieve some more data from the vault contract but also from
		** the strategy contract itself.
		**************************************************************************/
		const	ethcallProvider = await utils.newEthCallProvider(getProvider(chainID || 250));
		const	multiCalls = [];
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
		**************************************************************************/
		let	rIndex = 0;
		for (const vault of _vaults) {
			const	withdrawalQueue: string[] = [];
			for (let i = 0; i < 20; i++) {
				const	addr = utils.toAddress(callResult[rIndex++] as string);
				if (!utils.isZeroAddress(addr))
					withdrawalQueue.push(addr as string);
			}
			vault.warnings = [];
			vault.explorer = CHAINS[(chainID || '250') as keyof typeof CHAINS].block_explorer;
			vault.guardian = utils.toAddress(callResult[rIndex++] as string);
			vault.management = utils.toAddress(callResult[rIndex++] as string);
			vault.governance = utils.toAddress(callResult[rIndex++] as string);
			vault.rewards = utils.toAddress(callResult[rIndex++] as string);
			vault.availableDepositLimit = BigNumber.from(callResult[rIndex++] || 0);
			vault.depositLimit = BigNumber.from(callResult[rIndex++] || 0);
			if (utils.isZeroAddress(vault.guardian)) vault.warnings.push('Guardian is not set');
			if (utils.isZeroAddress(vault.management)) vault.warnings.push('Management is not set');
			if (utils.isZeroAddress(vault.governance)) vault.warnings.push('Governance is not set');
			if (utils.isZeroAddress(vault.rewards)) vault.warnings.push('Rewards is not set');
			if (Number(vault.availableDepositLimit) === 0) vault.warnings.push('Available deposit limit is zero');
			if (Number(vault.depositLimit) === 0) vault.warnings.push('Deposit limit is zero');

			for (const strategy of vault.strategies) {
				strategy.warnings = [];
				strategy.creditAvailable = BigNumber.from(callResult[rIndex++]) || BigNumber.from(0);
				strategy.debtOutstanding = BigNumber.from(callResult[rIndex++]) || BigNumber.from(0);
				const	strategyData = callResult[rIndex++] as any;
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
				const	index = withdrawalQueue.findIndex((address: string): boolean => address === utils.toAddress(strategy.address));
				strategy.index = index === -1 ? 21 : index;
				if (index === -1) strategy.warnings.push('Strategy is not in withdrawal queue');
			}
		}

		/* 🔵 - Yearn Finance ******************************************************
		** For each vaults from the list, we will check if we have a subgraph
		** matching element, and we will assign the fetched data to it.
		** This is where we will also assign the strategies metadata to the vaults
		** strategies.
		**************************************************************************/
		const	vaultsDetails = graph.vaults;
		for (const vault of _vaults) {
			const	vaultDetails = vaultsDetails.find((detail: {id: string}): boolean => utils.toAddress(detail.id) === utils.toAddress(vault.address));
			if (vaultDetails) {
				vault.balanceTokens = BigNumber.from(vaultDetails.balanceTokens);
				vault.tokensDepositLimit = BigNumber.from(vaultDetails.tokensDepositLimit);
				vault.managementFeeBps = BigNumber.from(vaultDetails.managementFeeBps);
				vault.performanceFeeBps = BigNumber.from(vaultDetails.performanceFeeBps);
				if (Number(vault.managementFeeBps) === 0) vault.warnings.push('Management fee is zero');
				if (Number(vault.performanceFeeBps) === 0) vault.warnings.push('Performance fee is zero');

				for (const strategy of vault.strategies) {
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

					const strategyMeta = _strategies.data.find((_detailFromMeta: {addresses: string[]}): boolean => _detailFromMeta.addresses.includes(strategy.address));
					if (strategyMeta) {
						if (strategyMeta?.name !== 'Masterchef Generic Reinvest')
							strategy.name = strategyMeta?.name || strategy.name;
						strategy.description = strategyMeta.description;
						strategy.protocols = strategyMeta.protocols;
					}
				}
			}
		}
		getVaultIsRunning.current = false;
		if (getVaultRunNonce.current === currentNonce)
			set_vaults(_vaults);
		NProgress.done();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainID]);

	React.useEffect((): void => {
		getVaults();
	}, [getVaults]);

	return (
		<YearnContext.Provider value={{vaults}}>
			{children}
		</YearnContext.Provider>
	);
};

export const useYearn = (): TYearnContext => React.useContext(YearnContext);
export type {TVault, TStrategy, TStrategyReport};
export default useYearn;
