import	React, {ReactElement}			from	'react';
import	axios							from	'axios';
import	useSWR							from	'swr';
import	NProgress						from	'nprogress';
import	{createHash}					from	'crypto';
import	* as useWatchTypes				from	'contexts/useWatch.d';
import	{useWeb3}						from	'@yearn-finance/web-lib/contexts';
import	{isZeroAddress, format,
	performBatchedUpdates}				from	'@yearn-finance/web-lib/utils';
import	{getTvlImpact}					from	'utils';
import useSettings from './useSettings';

const	WatchContext = React.createContext<useWatchTypes.TWatchContext>({
	vaults: [],
	lastUpdate: 0,
	isUpdating: true,
	hasError: false
});

const fetcher = async (url: string): Promise<any> => axios.get(url).then((res): any => res.data);

/* 🔵 - Yearn Finance **********************************************************
** The watch context controls the different element responsible of making the
** data available for the app to use. This include fetching the vaults and
** strategies data directly from here and serving them to the whole app.
** In order to offload some work for the main UI thread, by default, the data
** fetching is performed by the serverless function through the following req:
** GET `/api/getVaults?chainID=${chainID}`
******************************************************************************/
export const WatchContextApp = ({children}: {children: ReactElement}): ReactElement => {
	const	{chainID} = useWeb3();
	const	{shouldOnlyDisplayEndorsedVaults} = useSettings();
	const	[vaults, set_vaults] = React.useState<useWatchTypes.TVault[]>([]);
	const	[lastUpdate, set_lastUpdate] = React.useState<number>(0);

	const	{data: allVaults, error} = useSWR(`${process.env.YDAEMON_BASE_URL}/${chainID}/vaults/all?strategiesDetails=withDetails${shouldOnlyDisplayEndorsedVaults? '' : '&classification=all'}`, fetcher);

	React.useEffect((): void => {
		if (!allVaults) {
			NProgress.start();
		} else if (allVaults) {
			NProgress.done();
		}
	}, [allVaults]);


	/* 🔵 - Yearn Finance ******************************************************
	** In order to have all the data we need for the whole app, we need to
	** fetch them all at once. This will allow us to work with them, detect the
	** missing stuffs, parse some element and so on.
	** We can only get one run of getVaults at a time, to prevent multiple
	** useless and heavy calls, and a loading bar is triggering when the
	** process is starting.
	**************************************************************************/
	React.useEffect((): void => {
		const _allVaults: useWatchTypes.TVault[] = [];
		if (allVaults) {
			for (const _vault of allVaults) {
				const vault: useWatchTypes.TVault = _vault;
				vault.alerts = [];

				/* 🔵 - Yearn Finance **********************************************************
				** Listing some easy to find potential alerts for the user. This part is
				** focused on the vaults
				******************************************************************************/
				if (isZeroAddress(vault?.details?.guardian))
					vault.alerts.push({level: 'warning', message: 'Guardian is not set'});
				if (isZeroAddress(vault?.details?.management))
					vault.alerts.push({level: 'warning', message: 'Management is not set'});
				if (isZeroAddress(vault?.details?.governance))
					vault.alerts.push({level: 'warning', message: 'Governance is not set'});
				if (isZeroAddress(vault?.details?.rewards))
					vault.alerts.push({level: 'warning', message: 'Rewards is not set'});
				if (format.BN(vault?.details?.availableDepositLimit).isZero())
					vault.alerts.push({level: 'warning', message: 'Available deposit limit is zero'});
				if (format.BN(vault?.details?.depositLimit).isZero())
					vault.alerts.push({level: 'warning', message: 'Deposit limit is zero'});
				if (vault?.details?.managementFee === 0)
					vault.alerts.push({level: 'warning', message: 'Management fee is zero'});
				if (vault?.details?.performanceFee === 0)
					vault.alerts.push({level: 'warning', message: 'Performance fee is zero'});
				if (vault?.details?.managementFee !== 200)
					vault.alerts.push({level: 'warning', message: 'Invalid value for management fee'});
				if (vault?.details?.performanceFee !== 2000)
					vault.alerts.push({level: 'warning', message: 'Invalid value for performance fee'});
				vault.alertHash = createHash('sha256').update(`${vault.address}_${JSON.stringify(vault.alerts)}`).digest('hex');

				for (let index = 0; index < vault.strategies.length; index++) {
					const strategy: useWatchTypes.TStrategy = vault.strategies[index];

					/* 🔵 - Yearn Finance ******************************************************
					** Computing some extra data for the UI, like the totalDebtUSDC, the parent
					** vault for a strategy etc.
					**************************************************************************/
					const totalDebtUSDC = (
						format.toNormalizedValue(format.BN(strategy?.details?.totalDebt), vault.decimals)
						* vault.tvl.price
					);
					vault.strategies[index].details.totalDebtUSDC = totalDebtUSDC;
					vault.strategies[index].details.tvlImpact = getTvlImpact(totalDebtUSDC);
					vault.strategies[index].vault = {
						address: vault.address,
						name: vault.name,
						icon: vault.icon,
						underlyingTokenSymbol: vault.token.symbol,
						decimals: vault.decimals,
						tokenPriceUSDC: vault.tvl.price
					};

					/* 🔵 - Yearn Finance ******************************************************
					** Listing some easy to find potential alerts for the user. This part is
					** focused on the strategies
					**************************************************************************/
					vault.strategies[index].alerts = [];
					if (index === -1) { //TODO: enable index
						vault.strategies[index].alerts.push({level: 'warning', message: 'Strategy is not in withdrawal queue'});
						if (strategy?.details?.tvlImpact > 0) {
							vault.strategies[index].alerts.push({level: 'error', message: 'Strategy with debt is not in withdrawal queue'});
						}
					}
					if (strategy?.details?.emergencyExit)
						vault.strategies[index].alerts.push({level: 'critical', message: 'Emergency mode enabled'});
					if (!strategy?.details?.inQueue)
						vault.strategies[index].alerts.push({level: 'warning', message: 'Strategy not in withdrawal queue'});
					if (!strategy?.details?.isActive && strategy?.details?.tvlImpact > 0)
						vault.strategies[index].alerts.push({level: 'error', message: 'Inactive strategy with debt'});
					if (!strategy?.details?.doHealthCheck && isZeroAddress(strategy?.details?.healthCheck))
						vault.strategies[index].alerts.push({level: 'warning', message: 'Strategy has healthcheck issue'});
					
					const	isV2Strategy = Number((strategy?.details?.version || '0').replace('.', '')) <= 3;
					const	isV2Vault = Number((vault?.version || '0').replace('.', '')) <= 3;
					if ((isV2Strategy && !isV2Vault) || (!isV2Strategy && isV2Vault))
						strategy.alerts.push({level: 'warning', message: `Strategy (${strategy?.details?.version}) and Vault (${vault.version}) version mismatch`});
					vault.strategies[index].alertHash = createHash('sha256').update(`${vault.address}_${strategy.address}_${JSON.stringify(vault.strategies[index].alerts)}`).digest('hex');
				}
				_allVaults.push(vault);
			}
			performBatchedUpdates((): void => {
				set_vaults(_allVaults || []);
				set_lastUpdate(Date.now());
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allVaults]);

	return (
		<WatchContext.Provider
			value={{
				vaults,
				lastUpdate,
				isUpdating: !allVaults && !error,
				hasError: !!error
			}}>
			{children}
		</WatchContext.Provider>
	);
};

export const useWatch = (): useWatchTypes.TWatchContext => React.useContext(WatchContext);
export default useWatch;
