import React, {ReactElement, useEffect, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {toAddress}  from '@yearn-finance/web-lib/utils';
import {Button} from '@yearn-finance/web-lib/components';
import {useWatch} from 'contexts/useWatch';
import {TStrategy, TVault} from 'contexts/useWatch.d';
import LogoYearn from 'components/icons/LogoYearn';

function	HeaderTitle(): ReactElement {
	const	[currentVault, set_currentVault] = useState<TVault | undefined>(undefined);
	const	[currentStrategy, set_currentStrategy] = useState<TStrategy | undefined>(undefined);
	const	{vaults} = useWatch();
	const	router = useRouter();

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the router query
	** is changed. It retrieves the data about the current vault.
	**************************************************************************/
	useEffect((): void => {
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
				<p className={'text-xs text-neutral-500'}>{currentVault.name}</p>
			</div>
		);	
	}
	if (!currentVault) {
		if (router.asPath.includes('/healthcheck')) {
			return (
				<div className={'flex-row-center space-x-4'}>
					<LogoYearn className={'h-10 w-10'} />
					<h1 className={'mr-2 font-bold text-neutral-700 md:mr-4'}>
						{'Healthcheck'}
					</h1>
				</div>
			);
		}
		if (router.asPath.includes('/query')) {
			return (
				<div className={'flex-row-center space-x-4'}>
					<LogoYearn className={'h-10 w-10'} />
					<h1 className={'mr-2 font-bold text-neutral-700 md:mr-4'}>
						{'Query'}
					</h1>
				</div>
			);
		}
		if (router.asPath.includes('/alerts')) {
			return (
				<div className={'flex-row-center space-x-4'}>
					<LogoYearn className={'h-10 w-10'} />
					<h1 className={'mr-2 font-bold text-neutral-700 md:mr-4'}>
						{'Alerts'}
					</h1>
				</div>
			);
		}
		if (router.asPath.includes('/risk')) {
			return (
				<>
					<div className={'flex-row-center space-x-4'}>
						<h1 className={'mr-2 text-neutral-700 md:mr-4'}>
							{'Risk'}
						</h1>
					</div>
					<div className={'ml-auto mr-4'}>
						<Button
							as={'a'}
							href={'https://docs.yearn.finance/resources/risks/risk-score#strategy-risk-score'}
							target={'_blank'}
							variant={'light'}
							className={'ml-0 min-w-[132px] md:ml-6'}>
							{'Explore Docs'}
						</Button>
					</div>
				</>
			);
		}
		if (router.asPath.includes('/settings')) {
			return (
				<div className={'flex-row-center space-x-4'}>
					<LogoYearn className={'h-10 w-10'} />
					<h1 className={'mr-2 font-bold text-neutral-700 md:mr-4'}>
						{'Settings'}
					</h1>
				</div>
			);
		}
		if (router.asPath.includes('/track')) {
			return (
				<div className={'flex-row-center space-x-4'}>
					<LogoYearn className={'h-10 w-10'} />
					<h1 className={'mr-2 font-bold text-neutral-700 md:mr-4'}>
						{'Track - KeepCRV'}
					</h1>
				</div>
			);
		}
		return (
			<div className={'flex-row-center space-x-4'}>
				<LogoYearn className={'h-10 w-10'} />
				<h1 className={'mr-2 font-bold text-neutral-700 md:mr-4'}>
					{'Vaults'}
				</h1>
			</div>
		);
	}
	
	return (
		<div className={'flex-row-center space-x-4'}>
			{currentVault.icon ? <Image
				alt={`token ${currentVault.name}`}
				decoding={'async'}
				width={32}
				height={32}
				src={currentVault.icon}
				quality={90} /> : <div className={'h-8 w-8 rounded-full bg-neutral-200'} />}
			<div className={'ml-2 md:ml-6'}>
				<b>{currentVault.name}</b>
				<p className={'text-xs text-neutral-500'}>
					{(currentVault.strategies).length > 1 ? `${(currentVault.strategies).length} strats` : `${(currentVault.strategies).length} strat`}
				</p>
			</div>
		</div>
	);

}

export default HeaderTitle;
