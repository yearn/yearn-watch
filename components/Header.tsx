import React, {ReactElement, useEffect, useState} from 'react';
import {useWeb3} from '@yearn-finance/web-lib/contexts';
import {Card, Dropdown, ModalMobileMenu} from '@yearn-finance/web-lib/components';
import {Hamburger, NetworkArbitrum, NetworkEthereum, NetworkFantom, NetworkOptimism} from '@yearn-finance/web-lib/icons';

export const	options: any[] = [
	{icon: <NetworkEthereum />, label: 'Ethereum', value: 1},
	{icon: <NetworkOptimism />, label: 'Optimism', value: 10},
	{icon: <NetworkFantom />, label: 'Fantom', value: 250},
	{icon: <NetworkArbitrum />, label: 'Arbitrum', value: 42161}
];

type		THeader = {
	shouldUseWallets?: boolean,
	shouldUseNetworks?: boolean,
	children: ReactElement
}
function	Header({
	shouldUseNetworks = true,
	children
}: THeader): ReactElement {
	const	{chainID, onSwitchChain, isActive} = useWeb3();
	const	[selectedOption, set_selectedOption] = useState(options[0]);
	const	[hasMobileMenu, set_hasMobileMenu] = useState(false);

	useEffect((): void => {
		const	_selectedOption = options.find((e): boolean => e.value === Number(chainID)) || options[0];
		set_selectedOption(_selectedOption);
	}, [chainID, isActive]);

	return (
		<header className={'z-30 mx-auto w-full py-4'}>
			<Card className={'flex h-auto items-center justify-between md:h-20'}>
				<div className={'flex w-full flex-row items-center'}>
					{children}
				</div>
				<div className={'flex flex-row items-center space-x-4 md:hidden'}>
					<button onClick={(): void => set_hasMobileMenu(true)}>
						<Hamburger />
					</button>
				</div>
				<div className={'flex flex-row items-center space-x-4'}>
					{shouldUseNetworks ? (
						<div className={'hidden flex-row items-center space-x-4 md:flex'}>
							<Dropdown
								defaultOption={options[0]}
								options={options}
								selected={selectedOption}
								onSelect={(option: any): void => onSwitchChain(option.value as number, true)} />
						</div>
					) : null}

				</div>
			</Card>
			<ModalMobileMenu
				shouldUseWallets
				isOpen={hasMobileMenu}
				onClose={(): void => set_hasMobileMenu(false)} />
		</header>
	);
}

export default Header;
