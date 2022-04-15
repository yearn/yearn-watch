import	React, {ReactElement}	from	'react';
import	Image					from	'next/image';
import	{useRouter}				from	'next/router';
import	useWatch				from	'contexts/useWatch';
import	{TStrategy, TVault}		from	'contexts/useWatch.d';
import	{toAddress} 			from	'@yearn/web-lib/utils';

function	HeaderTitle(): ReactElement {
	const	[currentVault, set_currentVault] = React.useState<TVault | undefined>(undefined);
	const	[currentStrategy, set_currentStrategy] = React.useState<TStrategy | undefined>(undefined);
	const	{vaults} = useWatch();
	const	router = useRouter();

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the router query
	** is changed. It retrieves the data about the current vault.
	**************************************************************************/
	React.useEffect((): void => {
		if (router.query.vault && router.query.strategy) {
			const	_currentVault = vaults.find((vault): boolean => toAddress(vault.address) === toAddress(router.query.vault as string));
			set_currentVault(_currentVault);
			set_currentStrategy(_currentVault?.strategies.find((strategy): boolean => toAddress(strategy.address) === toAddress(router.query.strategy as string)));
		} else if (router.query.vault) {
			set_currentVault(vaults.find((vault): boolean => vault.address === router.query.vault));
		} else {
			set_currentVault(undefined);
		}
	}, [router.query.vault, router.query.strategy, vaults]);

	if (currentVault && currentStrategy) {
		return (
			<div className={'items-start'}>
				<b>{currentStrategy.name}</b>
				<p className={'text-xs text-typo-secondary'}>{currentVault.display_name}</p>
			</div>
		);	
	}
	if (!currentVault) {
		if (router.asPath.includes('/healthcheck')) {
			return (
				<div className={'flex-row-center'}>
					<h1 className={'mr-2 md:mr-4 text-typo-primary'}>
						{'Healthcheck'}
					</h1>
				</div>
			);
		}
		if (router.asPath.includes('/query')) {
			return (
				<div className={'flex-row-center'}>
					<h1 className={'mr-2 md:mr-4 text-typo-primary'}>
						{'Query'}
					</h1>
				</div>
			);
		}
		if (router.asPath.includes('/alerts')) {
			return (
				<div className={'flex-row-center'}>
					<h1 className={'mr-2 md:mr-4 text-typo-primary'}>
						{'Alerts'}
					</h1>
				</div>
			);
		}
		if (router.asPath.includes('/risk')) {
			return (
				<div className={'flex-row-center'}>
					<h1 className={'mr-2 md:mr-4 text-typo-primary'}>
						{'Risk'}
					</h1>
				</div>
			);
		}
		if (router.asPath.includes('/settings')) {
			return (
				<div className={'flex-row-center'}>
					<h1 className={'mr-2 md:mr-4 text-typo-primary'}>
						{'Settings'}
					</h1>
				</div>
			);
		}
		return (
			<div className={'flex-row-center'}>
				<h1 className={'mr-2 md:mr-4 text-typo-primary'}>
					{'Vaults'}
				</h1>
			</div>
		);
	}
	
	return (
		<div className={'flex-row-center'}>
			<Image
				alt={`token ${currentVault.name}`}
				decoding={'async'}
				width={32}
				height={32}
				src={currentVault.icon}
				quality={90} />
			<div className={'ml-2 md:ml-6'}>
				<b>{currentVault.display_name}</b>
				<p className={'text-xs text-typo-secondary'}>
					{(currentVault.strategies).length > 1 ? `${(currentVault.strategies).length} strats` : `${(currentVault.strategies).length} strat`}
				</p>
			</div>
		</div>
	);

}

export default HeaderTitle;
