import	React, {ReactElement}		from	'react';
import	Head						from	'next/head';
import	{AppProps}					from	'next/app';
import	{DefaultSeo}				from	'next-seo';
import	{ethers}					from	'ethers';
import	{Toaster}					from	'react-hot-toast';
import	{Web3ReactProvider}			from	'@web3-react/core';
import	{BalancesContextApp}		from	'contexts/useBalances';
import useUI,	{UIContextApp}				from	'contexts/useUI';
import	{PricesContextApp}			from	'contexts/usePrices';
import	{LocalizationContextApp}	from 	'contexts/useLocalization';
import	{Web3ContextApp}			from	'contexts/useWeb3';
import	{YearnContextApp}			from	'contexts/useYearn';
import	Header						from	'components/StandardHeader';
import	Footer						from	'components/StandardFooter';
import	Navbar						from	'@lib/Navbar';
import	LogoWatch					from	'@lib/logo/LogoWatch';
import	IconAlert					from	'@icons/IconAlert';
import	IconLab						from	'@icons/IconLab';
import	IconVault					from	'@icons/IconVault';
import	IconMoon					from	'@icons/IconMoon';
import	IconSun						from	'@icons/IconSun';

import	'style/Default.css';

function	AppWrapper(props: AppProps): ReactElement {
	const	{Component, pageProps, router} = props;
	const	WEBSITE_URI = process.env.WEBSITE_URI;
	const	{theme, switchTheme} = useUI();

	console.warn(theme);

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
					url: WEBSITE_URI,
					site_name: process.env.WEBSITE_NAME,
					title: process.env.WEBSITE_NAME,
					description: process.env.WEBSITE_DESCRIPTION,
					images: [
						{
							url: `${WEBSITE_URI}og.png`,
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
			<div id={'app'} className={'grid relative flex-col grid-cols-12 gap-x-4 mx-auto mb-0 max-w-6xl md:flex-row md:mb-6'}>
				<div className={'flex sticky top-0 flex-col col-span-2 justify-between'} style={{height: 'calc(100vh - 1rem)'}}>
					<Navbar
						selected={router.pathname}
						set_selected={(selected: string): void => {
							router.push(selected);
						}}
						logo={<LogoWatch className={'w-full h-12 text-primary'} />}
						options={[
							{
								id: '/',
								values: ['/', '/vault/[vault]', '/vault/[vault]/[strategy]'],
								label: 'Vaults',
								icon: <IconVault  />
							},
							{
								id: '/risk',
								values: ['/risk'],
								label: 'Risk',
								icon: <IconLab />
							},
							{
								id: '/alerts',
								values: ['/alerts'],
								label: 'Alerts',
								icon: <IconAlert />
							}
						]}
					/>
					<div className={'flex flex-row justify-start mb-4'}>
						<IconMoon
							aria-label={'Switch to dark theme'}
							onClick={switchTheme}
							className={`w-5 h-5 text-typo-secondary hover:text-primary opacity-40 transition-colors cursor-pointer ${theme === 'dark' ? 'hidden' : ''}`} />
						<IconSun
							aria-label={'Switch to light theme'}
							onClick={switchTheme}
							className={`w-5 h-5 text-typo-secondary hover:text-primary opacity-40 transition-colors cursor-pointer ${theme === 'light' ? 'hidden' : ''}`} />
					</div>
				</div>
				<div className={'flex flex-col col-span-10 w-full min-h-[100vh]'}>
					<Header />
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

const getLibrary = (provider: ethers.providers.ExternalProvider): ethers.providers.Web3Provider => {
	return new ethers.providers.Web3Provider(provider, 'any');
};

function	MyApp(props: AppProps): ReactElement {
	const	{Component, pageProps} = props;
	
	return (
		<UIContextApp>
			<Toaster
				position={'bottom-right'}
				toastOptions={{className: 'text-sm text-typo-primary', style: {borderRadius: '0.5rem'}}} />
			<Web3ReactProvider getLibrary={getLibrary}>
				<Web3ContextApp>
					<BalancesContextApp>
						<PricesContextApp>
							<LocalizationContextApp>
								<YearnContextApp>
									<AppWrapper
										Component={Component}
										pageProps={pageProps}
										router={props.router} />
								</YearnContextApp>
							</LocalizationContextApp>
						</PricesContextApp>
					</BalancesContextApp>
				</Web3ContextApp>
			</Web3ReactProvider>
		</UIContextApp>
	);
}

export default MyApp;
