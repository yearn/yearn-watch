import	React, {ReactElement}			from	'react';
import	Head							from	'next/head';
import	Link							from	'next/link';
import	Image							from	'next/image';
import	{useRouter}						from	'next/router';
import	{AppProps}						from	'next/app';
import	{DefaultSeo}					from	'next-seo';
import	{KBarProvider, Action,
	createAction, useRegisterActions}	from	'kbar';
import	useWatch, {WatchContextApp}		from	'contexts/useWatch';
import	{SettingsContextApp}			from	'contexts/useSettings';
import	KBar							from	'components/Kbar';
import	Footer							from	'components/StandardFooter';
import	HeaderTitle						from	'components/HeaderTitle';
import	IconHealthcheck					from	'components/icons/IconHealthcheck';
import	IconTrack				from	'components/icons/IconTrack';
import	IconQuery						from	'components/icons/IconQuery';
import	LogoWatch						from	'components/logo/LogoWatch';
import	KBarButton						from	'components/KBarButton';
import	{WithYearn}						from	'@yearn-finance/web-lib/contexts';
import	{Header, Navbar}				from	'@yearn-finance/web-lib/layouts';
import	{useInterval}					from	'@yearn-finance/web-lib/hooks';
import	* as utils						from	'@yearn-finance/web-lib/utils';
import	{
	Vault as IconVault,
	Settings as IconSettings,
	AlertWarning as IconAlert
}										from	'@yearn-finance/web-lib/icons';

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
	const	{hasError, lastUpdate, isUpdating} = useWatch();
	const	[lastUpdateDiff, set_lastUpdateDiff] = React.useState<number>(0);

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

	return (
		<>
			<a href={'https://ydaemon.ycorpo.com/docs/daemons/list'} target={'_blank'} rel={'noreferrer'}>
				<div className={'flex-row-center cursor-pointer space-x-2'}>
					<div className={`aspect-square h-2 w-2 rounded-full ${isUpdating ? 'animate-spin border-2 border-transparent border-t-accent-500 border-l-accent-500 bg-neutral-200' : lastUpdateDiff < -300_000 ? 'bg-yellow-900' : 'bg-accent-500'}`} />
					<p className={'text-xs text-neutral-500'}>{isUpdating ? 'Fetching data ...' : `Sync ${utils.format.duration(lastUpdateDiff, true)}`}</p>
				</div>
			</a>
			{
				hasError ? (
					<div className={'flex-row-center space-x-2'}>
						<div className={'aspect-square h-2 w-2 rounded-full bg-pink-900'} />
						<p className={'text-xs text-neutral-500'}>{'yDaemon down'}</p>
					</div>
				) : <div className={'flex-row-center space-x-2'}>
					<div className={'aspect-square h-2 w-2 rounded-full bg-accent-500'} />
					<p className={'text-xs text-neutral-500'}>{'yDaemon synced'}</p>
				</div>
			}
		</>
	);
}

function	KBarWrapper(): React.ReactElement {
	const	[actions, set_actions] = React.useState<Action[]>([]);
	const	{vaults} = useWatch();
	const	router = useRouter();

	React.useEffect((): void => {
		const	_actions = [];
		for (const vault of vaults) {
			const	vaultAction = createAction({
				name: `${vault.name} v${vault.version}`,
				keywords: `${vault.name} ${vault.symbol} ${vault.address}`,
				section: 'Vaults',
				perform: async (): Promise<boolean> => router.push(`/vault/${vault.address}`),
				icon: (vault.icon ? 
					<Image
						src={vault.icon}
						alt={vault.name}
						decoding={'async'}
						quality={70}
						width={36}
						height={36}
						className={'h-9 w-9'}/> : <div className={'h-9 min-h-[40px] w-9 min-w-[36px] rounded-full bg-neutral-200'} />
				),
				subtitle: `${vault.address}`
			});

			_actions.push(vaultAction);
			for (const strategy of vault.strategies) {
				const	strategyAction = createAction({
					parent: vaultAction.id,
					section: 'Strategies',
					name: strategy.name,
					keywords: `${strategy.name} ${strategy.address}`,
					perform: async (): Promise<boolean> => router.push(`/vault/${vault.address}/${strategy.address}`),
					icon: (vault.icon ? 
						<Image
							src={vault.icon}
							alt={vault.name}
							decoding={'async'}
							quality={70}
							width={36}
							height={36}
							className={'h-9 w-9'}/> : <div className={'h-9 min-h-[40px] w-9 min-w-[36px] rounded-full bg-neutral-200'} />
					),
					subtitle: `${strategy.address}`
				});
				_actions.push(strategyAction);
			}
		}
		set_actions(_actions);
	}, [vaults]); // eslint-disable-line react-hooks/exhaustive-deps
	useRegisterActions(actions, [actions]);

	return <span />;
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
			<KBarProvider>
				<div className={'z-[9999]'}>
					<KBar />
					<KBarWrapper />
				</div>
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
						<Header shouldUseWallets={false} shouldUseNetworks>
							<HeaderTitle />
						</Header>
						<Component
							key={router.route}
							router={props.router}
							{...pageProps} />
						<Footer />
					</div>
				</div>
			</KBarProvider>
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
