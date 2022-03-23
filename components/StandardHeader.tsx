import	React, {ReactElement}				from	'react';
import	useWeb3								from	'contexts/useWeb3';
import	Image								from	'next/image';
import	{useRouter}							from	'next/router';
import	ModalMenu							from	'components/ModalMenu';
import	useYearn, {TStrategy, TVault}		from	'contexts/useYearn';
import	{truncateHex, toAddress}			from	'utils';
import	Card								from	'@lib/Card';
import	Dropdown, {TDropdownOption}			from	'@lib/Dropdown';
import	IconHamburger						from	'@icons/IconHamburger';
import	IconNetworkEthereum					from	'@icons/IconNetworkEthereum';
import	IconNetworkFantom					from	'@icons/IconNetworkFantom';
import	IconNetworkArbitrum					from	'@icons/IconNetworkArbitrum';

const	options: TDropdownOption[] = [
	{icon: <IconNetworkFantom />, label: 'Fantom', value: 250},
	{icon: <IconNetworkEthereum />, label: 'Ethereum', value: 1},
	{icon: <IconNetworkArbitrum />, label: 'Arbitrum', value: 42161}
];

function	Header(): ReactElement {
	const	{isActive, chainID, onSwitchChain, address, ens, openLoginModal, onDesactivate} = useWeb3();
	const	[hasOpenMenu, set_hasOpenMenu] = React.useState(false);
	const	[currentVault, set_currentVault] = React.useState<TVault | undefined>(undefined);
	const	[currentStrategy, set_currentStrategy] = React.useState<TStrategy | undefined>(undefined);
	const	{vaults} = useYearn();
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
		}
	}, [router.query.vault, router.query.strategy, vaults]);

	function	TitlePart(): ReactElement {
		if (currentVault && currentStrategy) {
			return (
				<div className={'items-start'}>
					<b className={'text-base text-typo-primary'}>{currentStrategy.name}</b>
					<p className={'text-xs text-typo-secondary'}>{currentVault.display_name}</p>
				</div>
			);	
		}
		if (!currentVault) {
			return (
				<div className={'flex flex-row items-center'}>
					<h1 className={'mr-2 text-xl font-bold text-typo-primary md:mr-4'}>
						{'Vaults'}
					</h1>
				</div>
			);
		}
		return (
			<div className={'flex flex-row items-start'}>
				<Image width={40} height={40} src={currentVault.icon} quality={90} />
				<div className={'ml-6'}>
					<b className={'text-base text-typo-primary'}>{currentVault.display_name}</b>
					<p className={'text-xs text-typo-secondary'}>
						{(currentVault.strategies).length > 1 ? `${(currentVault.strategies).length} strats` : `${(currentVault.strategies).length} strat`}
					</p>
				</div>
			</div>
		);
	}

	return (
		<header className={'z-50 py-0 mx-auto w-full max-w-6xl md:py-4'}>
			<Card className={'flex justify-between items-center'}>
				<div className={'flex flex-row items-center'}>
					<TitlePart />
				</div>
				<div className={'flex flex-row items-center space-x-6 md:hidden'}>
					<div
						onClick={(): void => set_hasOpenMenu(true)}
						className={'p-1 -m-1'}>
						<IconHamburger />
					</div>
				</div>
				<div className={'hidden flex-row items-center space-x-4 md:flex'}>
					<Dropdown
						defaultOption={options[0]}
						options={options}
						selected={options.find((e): boolean => e.value === Number(chainID)) || options[0]}
						set_selected={({value}): void => onSwitchChain(value as number, true)} />
					<button
						onClick={(): void => {
							if (isActive)
								return onDesactivate();
							openLoginModal();
						}}
						className={'truncate button-light'}>
						{!isActive || !address ? 'Connect wallet' : ens ? ens : truncateHex(address, 4)}
					</button>
				</div>
			</Card>
			<ModalMenu isOpen={hasOpenMenu} set_isOpen={set_hasOpenMenu} />
		</header>
	);
}

export default Header;
