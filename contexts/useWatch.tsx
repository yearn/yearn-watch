import	React, {ReactElement}							from	'react';
import	axios											from	'axios';
import	NProgress										from	'nprogress';
import	{ethers}										from	'ethers';
import	useWeb3											from	'@lib/contexts/useWeb3';
import	useLocalStorage									from	'@lib/hooks/useLocalStorage';
import	performBatchedUpdates							from	'@lib/utils/performBatchedUpdates';
import	{TVault, TStrategy, TStrategyReport, TAlert}	from	'contexts/useWatch.d';

type	TNetworkData = {blockNumber: number, graphBlockNumber: number, hasGraphIndexingErrors: boolean}
type	TYearnContext = {vaults: TVault[], lastUpdate: number, network: TNetworkData, update: () => void}
const	WatchContext = React.createContext<TYearnContext>({
	vaults: [],
	lastUpdate: 0,
	network: {
		blockNumber: 0,
		graphBlockNumber: 0,
		hasGraphIndexingErrors: false
	},
	update: (): void => undefined
});

export const WatchContextApp: React.FC = ({children}): ReactElement => {
	const	{chainID} = useWeb3();
	const	[vaults, set_vaults] = useLocalStorage('vaults', []) as [TVault[], (vaults: TVault[]) => void];
	const	[networkSync, set_networkSync] = useLocalStorage('networkSync', {}) as [TNetworkData, (sync: TNetworkData) => void];
	const	[lastUpdate, set_lastUpdate] = useLocalStorage('vaultsLastUpdate', 0) as [number, (lastUpdate: number) => void];
	const	getVaultIsRunning = React.useRef(false);
	const	getVaultRunNonce = React.useRef(0);

	React.useEffect((): void => {
		if (getVaultIsRunning.current) {
			getVaultIsRunning.current = false;
			getVaultRunNonce.current = getVaultRunNonce.current + 1;
		}
	}, [chainID]);

	/* 🔵 - Yearn Finance ******************************************************
	** In order to have all the data we need for the whole app, we need to
	** fetch them all at once. This will allow us to work with them, detect the
	** missing stuffs, parse some element and so on.
	** We can only get one run of getVaults at a time, to prevent multiple
	** useless and heavy calls, and a loading bar is triggering when the
	** process is starting.
	**************************************************************************/
	const	getVaults = React.useCallback(async (shouldRevalidate = false): Promise<void> => {
		if (getVaultIsRunning.current) {
			return;
		}
		NProgress.start();
		getVaultIsRunning.current = true;
		const currentNonce = getVaultRunNonce.current;
		if (getVaultRunNonce.current > 0)
			set_vaults([]);

		/* 🔵 - Yearn Finance ******************************************************
		** Data are dispatched between the different sources, and thus we need to
		** call them all to get the big picture:
		** - api.yearn.finance contains a lot of general data about the vaults
		** - meta.yearn.network is used to get the humanized name, the description
		**   and the protocols for each strategy. Data are localized.
		** - the subgraph allows us to get some missing data, like the reports, the
		**   apr etc.
		**************************************************************************/
		const	{data} = await axios.get(`/api/getVaults?chainID=${chainID || 1}&revalidate=${shouldRevalidate}`);
		//hack to get the bignumbers
		const	_vaultsInitials = JSON.parse(JSON.stringify(data.data.vaults), (_key: unknown, value: {type: string}): unknown => {
			if (value?.type === 'BigNumber') {
				return ethers.BigNumber.from(value);
			}
			return value;
		});
		

		getVaultIsRunning.current = false;
		if (getVaultRunNonce.current === currentNonce) {
			performBatchedUpdates((): void => {
				set_vaults(_vaultsInitials);
				set_lastUpdate(Number(data.access));
				set_networkSync(data.data.network);
			});
		}
		NProgress.done();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainID]);

	React.useEffect((): void => {
		getVaults();
	}, [getVaults]);

	return (
		<WatchContext.Provider
			value={{
				vaults,
				lastUpdate,
				network: networkSync,
				update: (): void => {
					getVaults(true);
				}
			}}>
			{children}
		</WatchContext.Provider>
	);
};

export const useWatch = (): TYearnContext => React.useContext(WatchContext);
export type {TVault, TStrategy, TStrategyReport, TAlert};
export default useWatch;
