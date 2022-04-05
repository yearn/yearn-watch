import	React, {ReactElement}			from	'react';
import	{ethers}						from	'ethers';
import	{Disclosure, Transition}		from	'@headlessui/react';
import	{TVault, TStrategy}				from	'contexts/useWatch.d';
import	{Chevron}						from	'@majorfi/web-lib/icons';
import	{useClientEffect}				from	'@majorfi/web-lib/hooks';
import	{format} 						from	'@majorfi/web-lib/utils';

type	TSectionAllocations = {currentVault: TVault};
const	SectionAllocations = React.memo(function SectionAllocations({currentVault}: TSectionAllocations): ReactElement {
	type	TStateAllocation = {
		empty: TStrategy[],
		notEmpty: TStrategy[],
		protocolsAllocation: {[key: string]: ethers.BigNumber},
		totalProtocolsAllocation: ethers.BigNumber,
		notAllocated: ethers.BigNumber
	};
	const	[allocations, set_allocations] = React.useState<TStateAllocation>({
		empty: [],
		notEmpty: [],
		protocolsAllocation: {},
		totalProtocolsAllocation: ethers.BigNumber.from(0),
		notAllocated: ethers.BigNumber.from(0)
	});

	/* 🔵 - Yearn Finance ******************************************************
	** The allocation of the vault is based on the total assets of the vault.
	** We have two arrays to work nicely with the UI, the Empty allocation, and
	** the Not Empty allocation. Everytime the currentVault changes, update
	** the allocations.
	**************************************************************************/
	useClientEffect((): (() => void) => {
		const	_strategies = currentVault.strategies.sort((a, b): number => (Number(b.debtRatio) || 0) - (Number(a.debtRatio) || 0));
		const	_empty = _strategies.filter((_strategy): boolean => Number(_strategy.debtRatio) === 0);
		const	_notEmpty = _strategies.filter((_strategy): boolean => Number(_strategy.debtRatio) !== 0);

		const	_protocolsAllocation: {[key: string]: ethers.BigNumber} = {};
		let		totalProtocolsAllocation = ethers.BigNumber.from(0);
		for (const _strategy of _notEmpty) {
			for (const _protocol of _strategy.protocols) {
				_protocolsAllocation[_protocol] = (_protocolsAllocation[_protocol] || ethers.BigNumber.from(0)).add(ethers.BigNumber.from(_strategy.debtRatio));
				totalProtocolsAllocation = totalProtocolsAllocation.add(ethers.BigNumber.from(_strategy.debtRatio));
			}
		}

		set_allocations({
			empty: _empty,
			notEmpty: _notEmpty,
			protocolsAllocation: _protocolsAllocation,
			totalProtocolsAllocation,
			notAllocated: _notEmpty.reduce((acc, _strategy): ethers.BigNumber => acc.add(_strategy.debtRatio), ethers.BigNumber.from(0))
		});
		return (): void => {
			set_allocations({
				empty: [],
				notEmpty: [],
				protocolsAllocation: {},
				totalProtocolsAllocation: ethers.BigNumber.from(0),
				notAllocated: ethers.BigNumber.from(0)
			});
		};
	}, [currentVault]);
	
	return (
		<section aria-label={'vault-allocations'} className={'col-span-1'}>
			<div className={'flex flex-col'}>
				<h4 className={'mb-4'}>{'Protocols Allocation'}</h4>
				<div className={'space-y-4'}>
					{
						Object.entries(allocations.protocolsAllocation).map(([key, value]): ReactElement => {
							return <div className={'flex flex-col'} key={key}>
								<span className={'flex flex-row justify-between items-center mb-2'}>
									<p className={'text-left text-typo-secondary'}>{`${key}`}</p>
									<b className={'text-left text-primary'}>
										{`${format.amount(Number(value) / Number(allocations.totalProtocolsAllocation) * 100)}%`}
									</b>
								</span>
								<div>
									<div className={'overflow-hidden relative w-full h-2 rounded-2xl transition-transform bg-background'}>
										<div className={'inset-y-0 left-0 h-full rounded-2xl bg-primary'} style={{width: `${Number(value) / Number(allocations.totalProtocolsAllocation) * 100}%`}} />
									</div>
								</div>
							</div>;
						})
					}
				</div>
			</div>

			<div className={'flex flex-col mt-8'}>
				<h4 className={'mb-4'}>{'Strategy Allocation'}</h4>
				<div className={'space-y-4'}>
					<div className={'flex flex-col'}>
						<span className={'flex flex-row justify-between items-center mb-2'}>
							<p className={'text-left text-typo-secondary'}>{'Not Allocated'}</p>
							<b className={'text-left text-primary'}>
								{`${format.amount(100 - Number(format.units(allocations.notAllocated, 2)), 2)}%`}
							</b>
						</span>
						<div>
							<div className={'overflow-hidden relative w-full h-2 rounded-2xl transition-transform bg-background'}>
								<div className={'inset-y-0 left-0 h-full rounded-2xl bg-primary'} style={{width: `${100 - Number(format.units(allocations.notAllocated, 2))}%`}} />
							</div>
						</div>
					</div>
					{
						allocations.notEmpty.map((strategy: TStrategy): ReactElement => (
							<div className={'flex flex-col'} key={strategy.address}>
								<span className={'flex flex-row justify-between items-center mb-2'}>
									<p className={'text-left text-typo-secondary'}>{`${strategy.name}`}</p>
									<b className={'text-left text-primary'}>
										{`${format.amount(Number(format.units(strategy.debtRatio, 2)), 2)}%`}
									</b>
								</span>
								<div>
									<div className={'overflow-hidden relative w-full h-2 rounded-2xl transition-transform bg-background'}>
										<div className={'inset-y-0 left-0 h-full rounded-2xl bg-primary'} style={{width: `${Number(format.units(strategy.debtRatio, 2))}%`}} />
									</div>
								</div>
							</div>
						))
					}
				</div>
				<div className={'mt-4 w-full'}>
					<Disclosure>
						{({open}): ReactElement => (
							<>
								<Disclosure.Button as={'div'} className={'w-full'}>
									<span className={'flex flex-row justify-between items-center mb-2 w-full cursor-pointer'}>
										<p className={'text-left text-typo-secondary'}>{'Empty Allocations'}</p>
										<Chevron className={`w-4 h-4 transition-transform transform text-primary ${open ? '-rotate-90' : '-rotate-180'}`} />
									</span>
								</Disclosure.Button>
								<Transition
									as={React.Fragment}
									show={open}
									enter={'transition duration-100 ease-out origin-top'}
									enterFrom={'transform scale-y-0 opacity-0 origin-top'}
									enterTo={'transform scale-y-100 opacity-100 origin-top'}
									leave={'transition ease-out origin-top'}
									leaveFrom={'transform scale-y-100 opacity-100 origin-top'}
									leaveTo={'transform scale-y-0 opacity-0 origin-top'}>
									<Disclosure.Panel static className={'py-2 px-4 w-full rounded-lg bg-surface-variant'}>
										{
											allocations.empty.map((strategy: TStrategy): ReactElement => (
												<div className={'flex flex-col'} key={strategy.address}>
													<span className={'flex flex-row justify-between items-center mb-2'}>
														<p className={'text-left text-typo-secondary'}>{`${strategy.name}`}</p>
														<b className={'text-left text-primary'}>{'0%'}</b>
													</span>
												</div>
											))
										}
									</Disclosure.Panel>
								</Transition>
							</>	
						)}
					</Disclosure>
				</div>
			</div>
		</section>
	);
});

export default SectionAllocations;