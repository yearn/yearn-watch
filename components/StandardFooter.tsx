import	React, {ReactElement}		from	'react';
import	{SwitchTheme}				from	'@yearn-finance/web-lib/components';
import	{useUI}						from	'@yearn-finance/web-lib/contexts';

function	Footer(): ReactElement {
	const	{theme, switchTheme} = useUI();

	return (
		<footer className={'mx-auto mt-auto hidden w-full max-w-6xl flex-row items-center py-8 md:flex'}>
			<a href={process.env.PROJECT_GITHUB_URL} target={'_blank'} className={'pr-6 text-xs text-neutral-500 transition-colors hover:text-accent-500 hover:underline'} rel={'noreferrer'}>
				{'Yearn.watch repo'}
			</a>
			<a href={'https://gov.yearn.finance/'} target={'_blank'} className={'pr-6 text-xs text-neutral-500 transition-colors hover:text-accent-500 hover:underline'} rel={'noreferrer'}>
				{'Subgraph'}
			</a>
			<a href={'https://discord.yearn.finance/'} target={'_blank'} className={'pr-6 text-xs text-neutral-500 transition-colors hover:text-accent-500 hover:underline'} rel={'noreferrer'}>
				{'Discord'}
			</a>
			<a href={'https://twitter.com/iearnfinance'} target={'_blank'} className={'pr-6 text-xs text-neutral-500 transition-colors hover:text-accent-500 hover:underline'} rel={'noreferrer'}>
				{'Twitter'}
			</a>

			<div className={'ml-auto px-3'}>
				<SwitchTheme theme={theme} switchTheme={switchTheme} />
			</div>

		</footer>
	);
}

export default Footer;
