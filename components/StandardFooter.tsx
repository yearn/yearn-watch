import	React, {ReactElement}		from	'react';
import	{SwitchTheme}				from	'@yearn/web-lib/components';
import	{useUI}						from	'@yearn/web-lib/contexts';

function	Footer(): ReactElement {
	const	{theme, switchTheme} = useUI();

	return (
		<footer className={'hidden flex-row items-center py-8 mx-auto mt-auto w-full max-w-6xl md:flex'}>
			<a href={process.env.PROJECT_GITHUB_URL} target={'_blank'} className={'pr-6 text-xs hover:underline transition-colors text-typo-secondary hover:text-primary'} rel={'noreferrer'}>
				{'Yearn.watch repo'}
			</a>
			<a href={'https://gov.yearn.finance/'} target={'_blank'} className={'pr-6 text-xs hover:underline transition-colors text-typo-secondary hover:text-primary'} rel={'noreferrer'}>
				{'Subgraph'}
			</a>
			<a href={'https://discord.yearn.finance/'} target={'_blank'} className={'pr-6 text-xs hover:underline transition-colors text-typo-secondary hover:text-primary'} rel={'noreferrer'}>
				{'Discord'}
			</a>
			<a href={'https://twitter.com/iearnfinance'} target={'_blank'} className={'pr-6 text-xs hover:underline transition-colors text-typo-secondary hover:text-primary'} rel={'noreferrer'}>
				{'Twitter'}
			</a>

			<div className={'px-3 ml-auto'}>
				<SwitchTheme theme={theme} switchTheme={switchTheme} />
			</div>

		</footer>
	);
}

export default Footer;
