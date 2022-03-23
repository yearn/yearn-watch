import	React, {ReactElement}		from	'react';
import	Link						from	'next/link';
import	IconTwitter					from	'components/icons/IconTwitter';
import	IconGithub					from	'components/icons/IconGithub';
import	IconDiscord					from	'components/icons/IconDiscord';
import	IconMedium					from	'components/icons/IconMedium';

function	Footer(): ReactElement {
	return (
		<footer className={'hidden flex-row items-center py-8 px-6 mx-auto mt-auto w-full max-w-6xl md:flex bg-white-blue-1'}>
			<Link href={'/disclaimer'}>
				<p className={'pr-6 text-gray-blue-1 link'}>{'Disclaimer'}</p>
			</Link>
			<a href={'https://docs.yearn.finance'} target={'_blank'} className={'pr-6 text-gray-blue-1 link'} rel={'noreferrer'}>
				{'Documentation'}
			</a>
			<a href={'https://gov.yearn.finance/'} target={'_blank'} className={'pr-6 text-gray-blue-1 link'} rel={'noreferrer'}>
				{'Governance forum'}
			</a>
			<a href={'https://github.com/yearn/yearn-security/blob/master/SECURITY.md'} target={'_blank'} className={'pr-6 text-gray-blue-1 link'} rel={'noreferrer'}>
				{'Report a vulnerability'}
			</a>

			<div className={'px-3 ml-auto transition-colors cursor-pointer text-gray-blue-1 hover:text-gray-blue-2'}>
				<a href={'https://twitter.com/iearnfinance'} target={'_blank'} rel={'noreferrer'}><IconTwitter /></a>
			</div>
			<div className={'px-3 transition-colors cursor-pointer text-gray-blue-1 hover:text-gray-blue-2'}>
				<a href={process.env.PROJECT_GITHUB_URL} target={'_blank'} rel={'noreferrer'}><IconGithub /></a>
			</div>
			<div className={'px-3 transition-colors cursor-pointer text-gray-blue-1 hover:text-gray-blue-2'}>
				<a href={'https://discord.yearn.finance/'} target={'_blank'} rel={'noreferrer'}><IconDiscord /></a>
			</div>
			<div className={'pl-3 transition-colors cursor-pointer text-gray-blue-1 hover:text-gray-blue-2'}>
				<a href={'https://medium.com/iearn'} target={'_blank'} rel={'noreferrer'}><IconMedium /></a>
			</div>
		</footer>
	);
}

export default Footer;
