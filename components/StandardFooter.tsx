import React, {ReactElement} from 'react';
import {SwitchTheme} from '@yearn-finance/web-lib/components';
import {useUI, useWeb3} from '@yearn-finance/web-lib/contexts';
import meta from 'public/manifest.json';

const SUBGRAPH_URLS = new Map([
	[1, 'https://api.thegraph.com/subgraphs/name/rareweasel/yearn-vaults-v2-subgraph-mainnet'],
	[10, 'https://api.thegraph.com/subgraphs/name/yearn/yearn-vaults-v2-optimism'],
	[250, 'https://api.thegraph.com/subgraphs/name/bsamuels453/yearn-fantom-validation-grafted'],
	[42161, 'https://api.thegraph.com/subgraphs/name/yearn/yearn-vaults-v2-arbitrum']
]);

function	Footer(): ReactElement {
	const	{theme, switchTheme} = useUI();
	const	{chainID} = useWeb3();

	return (
		<footer className={'mx-auto mt-auto hidden w-full max-w-6xl flex-row items-center py-8 md:flex'}>
			<a href={meta.github} target={'_blank'} className={'pr-6 text-xs text-neutral-500 transition-colors hover:text-accent-500 hover:underline'} rel={'noreferrer'}>
				{'Yearn.watch repo'}
			</a>
			{SUBGRAPH_URLS.has(chainID) && <a href={SUBGRAPH_URLS.get(chainID)} target={'_blank'} className={'pr-6 text-xs text-neutral-500 transition-colors hover:text-accent-500 hover:underline'} rel={'noreferrer'}>
				{'Subgraph'}
			</a>}
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
