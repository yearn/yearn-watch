import	React, {ReactElement}	from	'react';
import	{useLocalStorage}		from	'@yearn-finance/web-lib/hooks';
import	* as useSettingsTypes	from	'contexts/useSettings.d';

const	SettingsContext = React.createContext<useSettingsTypes.TSettingsContext>({
	shouldDisplayStratsInQueue: true,
	switchShouldDisplayStratsInQueue: (): void => undefined,
	shouldOnlyDisplayEndorsedVaults: true,
	switchShouldOnlyDisplayEndorsedVaults: (): void => undefined,
	shouldDisplayVaultsWithMigration: false,
	switchShouldDisplayVaultsWithMigration: (): void => undefined,
	shouldDisplayVaultNoStrats: false,
	switchShouldDisplayVaultNoStrats: (): void => undefined
});

/* 🔵 - Yearn Finance **********************************************************
** The settings context controls some specific settings you could set for the
** whole app. This does not include the theming, which is handled by the 
** useUI context from the web lib.
** This includes the following settings:
** - shouldUseRemoteFetch: by default, vaults and strategies data are fetched
** from a serverless function hosted by Vercel/AWS. You can override this in
** order to perform the request from your browser directly.
** - subGraphURI: for each supported network (1, 10, 250, 42161), provide a way
** to override the default subgraph URI. Empty string will use the default,
** aka env variables.
** - rpcURI: for each supported network (1, 10, 250, 42161), provide a way to
** override the default RPC URI. Empty string will use the default, aka env
** variables.
******************************************************************************/
type TStorageBoolean = [boolean, (s: boolean) => boolean];

export const SettingsContextApp = ({children}: {children: ReactElement}): ReactElement => {
	const	[shouldDisplayVaultNoStrats, set_shouldDisplayVaultNoStrats] = useLocalStorage('shouldDisplayVaultNoStrats', false) as TStorageBoolean;
	const	[shouldOnlyDisplayEndorsedVaults, set_shouldOnlyDisplayEndorsedVaults] = useLocalStorage('shouldOnlyDisplayEndorsedVaults', true) as TStorageBoolean;
	const	[shouldDisplayVaultsWithMigration, set_shouldDisplayVaultsWithMigration] = useLocalStorage('shouldDisplayVaultsWithMigration', false) as TStorageBoolean;
	const	[shouldDisplayStratsInQueue, set_shouldDisplayStratsInQueue] = useLocalStorage('shouldDisplayStratsInQueue', true) as TStorageBoolean;

	return (
		<SettingsContext.Provider
			value={{
				shouldDisplayStratsInQueue,
				switchShouldDisplayStratsInQueue: (): void => {
					set_shouldDisplayStratsInQueue(!shouldDisplayStratsInQueue);
				},
				shouldOnlyDisplayEndorsedVaults,
				switchShouldOnlyDisplayEndorsedVaults: (): void => {
					set_shouldOnlyDisplayEndorsedVaults(!shouldOnlyDisplayEndorsedVaults);
				},
				shouldDisplayVaultsWithMigration,
				switchShouldDisplayVaultsWithMigration: (): void => {
					set_shouldDisplayVaultsWithMigration(!shouldDisplayVaultsWithMigration);
				},
				shouldDisplayVaultNoStrats,
				switchShouldDisplayVaultNoStrats: (): void => {
					set_shouldDisplayVaultNoStrats(!shouldDisplayVaultNoStrats);
				}
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = (): useSettingsTypes.TSettingsContext => React.useContext(SettingsContext);
export default useSettings;
