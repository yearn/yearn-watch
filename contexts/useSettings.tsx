import	React, {ReactElement}	from	'react';
import	{useLocalStorage}		from	'@yearn-finance/web-lib/hooks';
import	* as useSettingsTypes	from	'contexts/useSettings.d';

const	SettingsContext = React.createContext<useSettingsTypes.TSettingsContext>({
	shouldDisplayStratsInQueue: true,
	switchShouldDisplayStratsInQueue: (): void => undefined,
	shouldOnlyDisplayEndorsedVaults: false,
	switchShouldOnlyDisplayEndorsedVaults: (): void => undefined,
	shouldDisplayVaultsWithMigration: false,
	switchShouldDisplayVaultsWithMigration: (): void => undefined,
	shouldDisplayVaultNoStrats: false,
	switchShouldDisplayVaultNoStrats: (): void => undefined,
	shouldDisplayWithNoDebt: true,
	switchShouldDisplayWithNoDebt: (): void => undefined,
	shouldGivePriorityToSubgraph: true,
	switchShouldGivePriorityToSubgraph: (): void => undefined,
	shouldUseRemoteFetch: true,
	switchShouldUseRemoteFetch: (): void => undefined,
	shouldFetchStratsFromVault: false,
	switchShouldFetchStratsFromVault: (): void => undefined,
	subGraphURI: {1: '', 250: '', 42161: ''},
	updateSubGraphURI: (): void => undefined,
	rpcURI: {1: '', 250: '', 42161: ''},
	updateRPCURI: (): void => undefined
});

/* 🔵 - Yearn Finance **********************************************************
** The settings context controls some specific settings you could set for the
** whole app. This does not include the theming, which is handled by the 
** useUI context from the web lib.
** This includes the following settings:
** - shouldUseRemoteFetch: by default, vaults and strategies data are fetched
** from a serverless function hosted by Vercel/AWS. You can override this in
** order to perform the request from your browser directly.
** - subGraphURI: for each supported network (1, 250, 42161), provide a way
** to override the default subgraph URI. Empty string will use the default,
** aka env variables.
** - rpcURI: for each supported network (1, 250, 42161), provide a way to
** override the default RPC URI. Empty string will use the default, aka env
** variables.
******************************************************************************/
type TStorageBoolean = [boolean, (s: boolean) => boolean];
type TStorageNetworkURI = [useSettingsTypes.TNetworkURI, (s: useSettingsTypes.TNetworkURI) => useSettingsTypes.TNetworkURI];

export const SettingsContextApp = ({children}: {children: ReactElement}): ReactElement => {
	const	[shouldDisplayVaultNoStrats, set_shouldDisplayVaultNoStrats] = useLocalStorage('shouldDisplayVaultNoStrats', false) as TStorageBoolean;
	const	[shouldOnlyDisplayEndorsedVaults, set_shouldOnlyDisplayEndorsedVaults] = useLocalStorage('shouldOnlyDisplayEndorsedVaults', false) as TStorageBoolean;
	const	[shouldDisplayVaultsWithMigration, set_shouldDisplayVaultsWithMigration] = useLocalStorage('shouldDisplayVaultsWithMigration', false) as TStorageBoolean;
	const	[shouldDisplayStratsInQueue, set_shouldDisplayStratsInQueue] = useLocalStorage('shouldDisplayStratsInQueue', true) as TStorageBoolean;
	const	[shouldGivePriorityToSubgraph, set_shouldGivePriorityToSubgraph] = useLocalStorage('shouldGivePriorityToSubgraph', true) as TStorageBoolean;
	const	[shouldDisplayWithNoDebt, set_shouldDisplayWithNoDebt] = useLocalStorage('shouldDisplayWithNoDebt', true) as TStorageBoolean;
	const	[shouldUseRemoteFetch, set_shouldUseRemoteFetch] = useLocalStorage('shouldUseRemoteFetch', true) as TStorageBoolean;
	const	[shouldFetchStratsFromVault, set_shouldFetchStratsFromVault] = useLocalStorage('shouldFetchStratsFromVault', false) as TStorageBoolean;
	const	[subGraphURI, set_subGraphURI] = useLocalStorage('subGraphURI', {1: '', 250: '', 42161: ''}) as TStorageNetworkURI;
	const	[rpcURI, set_rpcURI] = useLocalStorage('rpcURI', {1: '', 250: '', 42161: ''}) as TStorageNetworkURI;

	return (
		<SettingsContext.Provider
			value={{
				shouldDisplayVaultNoStrats,
				switchShouldDisplayVaultNoStrats: (): void => {
					set_shouldDisplayVaultNoStrats(!shouldDisplayVaultNoStrats);
				},
				shouldOnlyDisplayEndorsedVaults,
				switchShouldOnlyDisplayEndorsedVaults: (): void => {
					set_shouldOnlyDisplayEndorsedVaults(!shouldOnlyDisplayEndorsedVaults);
				},
				shouldDisplayVaultsWithMigration,
				switchShouldDisplayVaultsWithMigration: (): void => {
					set_shouldDisplayVaultsWithMigration(!shouldDisplayVaultsWithMigration);
				},
				shouldDisplayStratsInQueue,
				switchShouldDisplayStratsInQueue: (): void => {
					set_shouldDisplayStratsInQueue(!shouldDisplayStratsInQueue);
				},
				shouldDisplayWithNoDebt,
				switchShouldDisplayWithNoDebt: (): void => {
					set_shouldDisplayWithNoDebt(!shouldDisplayWithNoDebt);
				},
				shouldGivePriorityToSubgraph,
				switchShouldGivePriorityToSubgraph: (): void => {
					set_shouldGivePriorityToSubgraph(!shouldGivePriorityToSubgraph);
				},
				shouldUseRemoteFetch,
				switchShouldUseRemoteFetch: (): void => {
					set_shouldUseRemoteFetch(!shouldUseRemoteFetch);
				},
				shouldFetchStratsFromVault,
				switchShouldFetchStratsFromVault: (): void => {
					set_shouldFetchStratsFromVault(!shouldFetchStratsFromVault);
				},
				subGraphURI,
				updateSubGraphURI: (updated): void => {
					set_subGraphURI(updated);
				},
				rpcURI,
				updateRPCURI: (updated): void => {
					set_rpcURI(updated);
				}
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = (): useSettingsTypes.TSettingsContext => React.useContext(SettingsContext);
export default useSettings;
