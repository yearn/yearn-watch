import	React, {useContext, createContext, Dispatch, SetStateAction, ReactElement}	from	'react';
import	{useRouter}	from	'next/router';

function	getCommons(language: string): object {
	try {
		const	_common = require(`/localization/${language}/common.json`);
		const	_commonFallback = require('/localization/en/common.json');
		const	_commonWithFallback = Object.assign({..._commonFallback}, {..._common});
		return (_commonWithFallback);
	} catch (e) {
		const	_common = require('/localization/en/common.json');
		return (_common);
	}
}

type TLocalizationContext = {
	common: object,
	language: string,
	set_language: Dispatch<SetStateAction<string>>,
}
const defaultState = {
	common: require('/localization/en/common.json'),
	language: 'en',
	set_language: (): void => undefined
};

const LocalizationContext = createContext<TLocalizationContext>(defaultState);
export const LocalizationContextApp: React.FC = ({children}): ReactElement => {
	const	router = useRouter();
	const	[language, set_language] = React.useState(router.locale || 'en');
	const	[common, set_common] = React.useState(getCommons(router.locale || 'en'));

	React.useEffect((): void => {
		set_common(getCommons(language));
	}, [language]);

	return (
		<LocalizationContext.Provider
			value={{
				common,
				language,
				set_language
			}}>
			{children}
		</LocalizationContext.Provider>
	);
};

export const useLocalization = (): TLocalizationContext => useContext(LocalizationContext);
export default useLocalization;
