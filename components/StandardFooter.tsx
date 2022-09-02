import React, {ReactElement} from 'react';
import {SwitchTheme} from '@yearn-finance/web-lib/components';
import {useUI, useWeb3} from '@yearn-finance/web-lib/contexts';
import meta from 'public/manifest.json';

const SUBGRAPH_URLS = new Map([
	[1, ''],
	[10, ''],
	[250, ''],
	[42161, ''],
	[1337, ''],
	[31337, '']
]);

function	Footer(): ReactElement {
	const	{theme, switchTheme} = useUI();
	const	{chainID} = useWeb3();

	return (
		<footer className={'mx-auto mt-auto hidden w-full max-w-6xl flex-row items-center py-8 md:flex'}>
			<a href={meta.github} target={'_blank'} className={'pr-6 text-xs text-neutral-500 transition-colors hover:text-accent-500 hover:underline'} rel={'noreferrer'}>
				{'Yearn.watch repo'}
			</a>
			<a href={SUBGRAPH_URLS.has(chainID) ? SUBGRAPH_URLS.get(chainID) : 'https://gov.yearn.finance/'} target={'_blank'} className={'pr-6 text-xs text-neutral-500 transition-colors hover:text-accent-500 hover:underline'} rel={'noreferrer'}>
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
