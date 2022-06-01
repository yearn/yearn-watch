import	React, {ReactElement}		from	'react';
import	Head						from	'next/head';
import	Link						from	'next/link';
import	{AppProps}					from	'next/app';
import	{DefaultSeo}				from	'next-seo';
import	useWatch, {WatchContextApp}	from	'contexts/useWatch';
import	{SettingsContextApp}		from	'contexts/useSettings';
import	Footer						from	'components/StandardFooter';
import	HeaderTitle					from	'components/HeaderTitle';
// import	IconRisk					from	'components/icons/IconRisk';
import	IconHealthcheck				from	'components/icons/IconHealthcheck';
import	IconTrack				from	'components/icons/IconTrack';
import	IconQuery					from	'components/icons/IconQuery';
import	LogoWatch					from	'components/logo/LogoWatch';
import	{WithYearn}					from	'@yearn/web-lib';
import	{Header, Navbar}			from	'@yearn/web-lib/layouts';
import	{useInterval}				from	'@yearn/web-lib/hooks';
import	* as utils					from	'@yearn/web-lib/utils';
import	{
	Vault as IconVault,
	Settings as IconSettings,
	AlertWarning as IconAlert
}									from	'@yearn/web-lib/icons';

import	'../style.css';

function	AppHead(): ReactElement {
	return (
		<>
			<Head>
				<title>{process.env.WEBSITE_NAME}</title>
				<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
				<meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
				<meta name={'description'} content={process.env.WEBSITE_NAME} />
				<meta name={'msapplication-TileColor'} content={'#62688F'} />
				<meta name={'theme-color'} content={'#ffffff'} />
				<meta charSet={'utf-8'} />

				<link rel={'shortcut icon'} type={'image/x-icon'} href={'/favicons/favicon.ico'} />
				<link rel={'apple-touch-icon'} sizes={'180x180'} href={'/favicons/apple-touch-icon.png'} />
				<link rel={'icon'} type={'image/png'} sizes={'32x32'} href={'/favicons/favicon-32x32.png'} />
				<link rel={'icon'} type={'image/png'} sizes={'16x16'} href={'/favicons/favicon-16x16.png'} />
				<link rel={'icon'} type={'image/png'} sizes={'192x192'} href={'/favicons/android-chrome-192x192.png'} />
				<link rel={'icon'} type={'image/png'} sizes={'512x512'} href={'/favicons/android-chrome-512x512.png'} />

				<meta name={'robots'} content={'index,nofollow'} />
				<meta name={'googlebot'} content={'index,nofollow'} />
				<meta charSet={'utf-8'} />
			</Head>
			<DefaultSeo
				title={process.env.WEBSITE_NAME}
				defaultTitle={process.env.WEBSITE_NAME}
				description={process.env.WEBSITE_DESCRIPTION}
				openGraph={{
					type: 'website',
					locale: 'en_US',
					url: process.env.WEBSITE_URI,
					site_name: process.env.WEBSITE_NAME,
					title: process.env.WEBSITE_NAME,
					description: process.env.WEBSITE_DESCRIPTION,
					images: [
						{
							url: `${process.env.WEBSITE_URI}og.png`,
							width: 1200,
							height: 675,
							alt: 'Yearn'
						}
					]
				}}
				twitter={{
					handle: '@iearnfinance',
					site: '@iearnfinance',
					cardType: 'summary_large_image'
				}} />
		</>
	);
}

function	AppSync(): ReactElement {
	const	{network, lastUpdate, isUpdating, update} = useWatch();
	const	[blockDiff, set_blockDiff] = React.useState<number>(0);
	const	[lastUpdateDiff, set_lastUpdateDiff] = React.useState<number>(0);

	/* 🔵 - Yearn Finance ******************************************************
	** We are using the subgraph for some of the data. The subgraph could be
	** a few blocks outdated, so we need to display the difference between
	** the rpc block height and the subgraph block height.
	**
	** -1 is returned if the subgraph is not available, otherwise the we return
	** the absolute difference between the two.
	**************************************************************************/
	React.useEffect((): void => {
		if (network.hasGraphIndexingErrors)
			set_blockDiff(-1);
		else if (network.blockNumber && network.graphBlockNumber)
			set_blockDiff(Math.abs(network.blockNumber - network.graphBlockNumber));
	}, [network.blockNumber, network.graphBlockNumber, network.hasGraphIndexingErrors]);

	/* 🔵 - Yearn Finance ******************************************************
	** Data are cached for 10 minutes to avoid too many loading time for not
	** much change. Theses data can be force updated on demand.
	** Get the difference between the user's browser and the cache update time
	** and register a interval to update this counter every minutes.
	**************************************************************************/
	useInterval((): void => {
		if (lastUpdate) {
			set_lastUpdateDiff(lastUpdate - new Date().valueOf());
		}
	}, 30 * 1000, true, [lastUpdate]);


	function	renderBlockDiff(): string {
		if (blockDiff === -1)
			return 'Error with graph height';
		if (blockDiff === 0)
			return 'Graph is up to date';
		return `Graph is ${blockDiff} block${blockDiff > 1 ? 's' : ''} behind`;
	}

	return (
		<>
			<div className={'space-x-2 cursor-pointer flex-row-center'} onClick={update}>
				<div className={`aspect-square w-2 h-2 rounded-full ${isUpdating ? 'bg-background border-2 border-transparent border-t-primary border-l-primary animate-spin' : lastUpdateDiff < -300_000 ? 'bg-alert-warning-primary' : 'bg-primary'}`} />
				<p className={'text-xs text-typo-secondary'}>{isUpdating ? 'Fetching data ...' : `Sync ${utils.format.duration(lastUpdateDiff, true)}`}</p>
			</div>
			<div className={'space-x-2 flex-row-center'}>
				<div className={`aspect-square w-2 h-2 rounded-full ${blockDiff === -1 ? 'bg-alert-error-primary' : blockDiff > 100 ? 'bg-alert-warning-primary' : 'bg-primary'}`} />
				<p className={'text-xs text-typo-secondary'}>{renderBlockDiff()}</p>
			</div>
			{
				network?.status?.rpc === 0 ? (
					<div className={'space-x-2 flex-row-center'}>
						<div className={'aspect-square w-2 h-2 rounded-full bg-alert-error-primary'} />
						<p className={'text-xs text-typo-secondary'}>{'RPC is down'}</p>
					</div>
				) : null
			}
			{
				network?.status?.graph === 0 ? (
					<div className={'space-x-2 flex-row-center'}>
						<div className={'aspect-square w-2 h-2 rounded-full bg-alert-error-primary'} />
						<p className={'text-xs text-typo-secondary'}>{'SubGraph is down'}</p>
					</div>
				) : null
			}
			{
				network?.status?.yearnApi === 0 ? (
					<div className={'space-x-2 flex-row-center'}>
						<div className={'aspect-square w-2 h-2 rounded-full bg-alert-error-primary'} />
						<p className={'text-xs text-typo-secondary'}>{'Yearn API is down'}</p>
					</div>
				) : null
			}
			{
				network?.status?.yearnMeta === 0 ? (
					<div className={'space-x-2 flex-row-center'}>
						<div className={'aspect-square w-2 h-2 rounded-full bg-alert-error-primary'} />
						<p className={'text-xs text-typo-secondary'}>{'Yearn Meta is down'}</p>
					</div>
				) : null
			}
		</>
	);
}

function	AppWrapper(props: AppProps): ReactElement {
	const	{Component, pageProps, router} = props;
	const	navbarMenuOptions = [
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
		// 	icon: <IconRisk />
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
			route: '/settings',
			values: ['/settings'],
			label: 'Settings',
			icon: <IconSettings />
		}
	];

	function	onChangeRoute(selected: string): void {
		router.push(selected);
	}

	return (
		<>
			<AppHead />
			<div id={'app'} className={'grid flex-col grid-cols-12 gap-x-4 mx-auto mb-0 max-w-6xl md:flex-row'}>
				<div className={'sticky top-0 z-50 col-span-12 h-auto md:relative md:col-span-2'}>
					<div className={'flex flex-col justify-between h-full'}>
						<Navbar
							selected={router.pathname}
							set_selected={onChangeRoute}
							logo={<LogoWatch className={'w-full h-12 text-primary'} />}
							options={navbarMenuOptions}
							wrapper={<Link passHref href={''} />}>
							<div className={'flex flex-col mt-auto space-y-2'}>
								<AppSync />
							</div>
						</Navbar>
					</div>
				</div>
				<div className={'flex flex-col col-span-12 px-4 w-full min-h-[100vh] md:col-span-10'}>
					<Header shouldUseNetworks={(process?.env?.USE_NETWORKS || true) as boolean}>
						<HeaderTitle />
					</Header>
					<Component
						key={router.route}
						router={props.router}
						{...pageProps} />
					<Footer />
				</div>
			</div>
		</>
	);
}

function	MyApp(props: AppProps): ReactElement {
	const	{Component, pageProps} = props;
	
	return (
		<SettingsContextApp>
			<WithYearn>
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
