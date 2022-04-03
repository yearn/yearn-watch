import	React, {ReactElement}	from	'react';
import	{useLocalStorage}		from	'@majorfi/web-lib/hooks';
import	* as useSettingsTypes	from	'contexts/useSettings.d';

const	SettingsContext = React.createContext<useSettingsTypes.TSettingsContext>({
	shouldUseRemoteFetch: true,
	switchShouldUseRemoteFetch: (): void => undefined,
	subGraphURI: {1: '', 250: '', 42161: ''},
	updateSubGraphURI: (): void => undefined,
	rpcURI: {1: '', 250: '', 42161: ''},
	updateRPCURI: (): void => undefined
});

export const SettingsContextApp: React.FC = ({children}): ReactElement => {
	const	[shouldUseRemoteFetch, set_shouldUseRemoteFetch] = useLocalStorage('shouldUseRemoteFetch', true);
	const	[subGraphURI, set_subGraphURI] = useLocalStorage('subGraphURI', {1: '', 250: '', 42161: ''});
	const	[rpcURI, set_rpcURI] = useLocalStorage('rpcURI', {1: '', 250: '', 42161: ''});

	return (
		<SettingsContext.Provider
			value={{
				shouldUseRemoteFetch,
				switchShouldUseRemoteFetch: (): void => {
					set_shouldUseRemoteFetch(!shouldUseRemoteFetch);
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
