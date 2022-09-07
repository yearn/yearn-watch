import	React, {ReactElement}			from	'react';
import	Link							from	'next/link';
import	{AppProps}						from	'next/app';
import	{KBarProvider}					from	'kbar';
import	{AnimatePresence, motion}		from	'framer-motion';
import	{WatchContextApp}				from	'contexts/useWatch';
import	{SettingsContextApp}			from	'contexts/useSettings';
import	KBar							from	'components/Kbar';
import	Footer							from	'components/StandardFooter';
import	HeaderTitle						from	'components/HeaderTitle';
import	IconHealthcheck					from	'components/icons/IconHealthcheck';
import	IconTrack						from	'components/icons/IconTrack';
import	IconQuery						from	'components/icons/IconQuery';
import	LogoWatch						from	'components/logo/LogoWatch';
import	KBarButton						from	'components/KBarButton';
import	KBarWrapper						from	'components/KBarWrapper';
import	AppSync							from	'components/AppSync';
import	Meta							from	'components/Meta';
import	Navbar							from	'components/Navbar';
import	Header							from	'components/Header';
import	{WithYearn}						from	'@yearn-finance/web-lib/contexts';
import	{
	Vault as IconVault,
	Settings as IconSettings,
	AlertWarning as IconAlert
}										from	'@yearn-finance/web-lib/icons';

import	'../style.css';

const transition = {duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67]};
const thumbnailVariants = {
	initial: {y: 20, opacity: 0, transition},
	enter: {y: 0, opacity: 1, transition},
	exit: {y: -20, opacity: 0, transition}
};

function	WithLayout(props: AppProps): ReactElement {
	const	{Component, pageProps, router} = props;

	const		navbarMenuOptions = [
		{
			route: '/',
			values: ['/', '/vault/[vault]', '/vault/[vault]/[strategy]'],
			label: 'Vaults',
			icon: <IconVault  />
		},
		{
			route: '/query',
			values: ['/query'],
			label: 'Query',
			icon: <IconQuery />
		},
		// {
		// 	route: '/risk',
		// 	values: ['/risk'],
		// 	label: 'Risk',
		// 	icon: <IconHealthcheck />
		// },
		{
			route: '/alerts',
			values: ['/alerts'],
			label: 'Alerts',
			icon: <IconAlert />
		},
		{
			route: '/healthcheck',
			values: ['/healthcheck'],
			label: 'Healthcheck',
			icon: <IconHealthcheck />
		},
		{
			route: '/track',
			values: ['/track'],
			label: 'Track',
			icon: <IconTrack />
		},
		{
			route: '/allocations',
			values: ['/allocations'],
			label: 'Allocations',
			icon: <IconTrack />
		},
		{
			route: '/settings',
			values: ['/settings'],
			label: 'Settings',
			icon: <IconSettings />
		}
	];

	function 	handleExitComplete(): void {
		if (typeof window !== 'undefined') {
			window.scrollTo({top: 0});
		}
	}

	function	onChangeRoute(selected: string): void {
		router.push(selected);
	}

	return (
		<div id={'app'} className={'mx-auto mb-0 grid max-w-[1200px] grid-cols-12 flex-col gap-x-4 md:flex-row'}>
			<div className={'sticky top-0 z-50 col-span-12 h-auto md:relative md:col-span-2'}>
				<div className={'flex h-full flex-col justify-between'}>
					<Navbar
						selected={router.pathname}
						set_selected={onChangeRoute}
						logo={<LogoWatch className={'h-12 w-full text-accent-500'} />}
						options={navbarMenuOptions}
						wrapper={<Link passHref href={''} />}>
						<div className={'mt-auto mb-6 flex flex-col space-y-2'}>
							<AppSync />
						</div>
						<KBarButton />
					</Navbar>
				</div>
			</div>
			<div className={'col-span-12 flex min-h-[100vh] w-full max-w-6xl flex-col md:col-span-10'}>
				<Header shouldUseNetworks>
					<HeaderTitle />
				</Header>
				<AnimatePresence exitBeforeEnter onExitComplete={handleExitComplete}>
					<motion.div
						key={router.asPath}
						initial={'initial'}
						animate={'enter'}
						exit={'exit'}
						variants={thumbnailVariants}>
						<Component
							key={router.route}
							router={props.router}
							{...pageProps} />
						<Footer />
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}

function	AppWrapper(props: AppProps): ReactElement {
	return (
		<>
			<Meta />
			<KBarProvider>
				<div className={'z-[9999]'}>
					<KBar />
					<KBarWrapper />
				</div>
				<WithLayout {...props} />
			</KBarProvider>
		</>
	);
}

function	MyApp(props: AppProps): ReactElement {
	const	{Component, pageProps} = props;
	
	return (
		<SettingsContextApp>
			<WithYearn
				options={{
					web3: {
						shouldUseWallets: true,
						shouldUseStrictChainMode: false,
						defaultChainID: 1,
						supportedChainID: [1, 250, 42161, 1337, 31337]
					}
				}}>
				<WatchContextApp>
					<AppWrapper
						Component={Component}
						pageProps={pageProps}
						router={props.router} />
				</WatchContextApp>
			</WithYearn>
		</SettingsContextApp>
	);
}

export default MyApp;
