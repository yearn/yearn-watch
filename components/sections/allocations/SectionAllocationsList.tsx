import React, {Fragment, ReactElement, memo, useEffect, useState} from 'react';
import	{List}						from	'@yearn-finance/web-lib/layouts';
import	{Card}						from	'@yearn-finance/web-lib/components';
import	* as utils					from	'@yearn-finance/web-lib/utils';
import	{Chevron}					from	'@yearn-finance/web-lib/icons';
import {format} 					from 	'@yearn-finance/web-lib/utils';
import {Disclosure, Transition}     from    '@headlessui/react';
import {TChainData, TProtocolData}  from 	'../../../pages/allocations';

const	ProtocolBox = memo(function ProtocolBox({protocol}: {protocol: TProtocolData}): ReactElement {

	function	renderSummary(p: {open: boolean}): ReactElement {
		return (
			<div className={`rounded-default relative grid h-20 w-[965px] grid-cols-22 bg-neutral-0 py-4 px-6 transition-colors md:w-full ${p.open ? '' : 'hover:bg-neutral-100'}`}>
				<div className={'min-w-32 col-span-5 flex flex-row items-center'}>
					<div className={'text-neutral-500'}>
						<div className={'flex-row-center'}>
							<div>
								<b>{protocol.name}</b>
							</div>
						</div>
					</div>
				</div>
				<div className={'min-w-36 cell-end col-span-4 mr-5 flex flex-row items-center tabular-nums'}>
					<div>
						<b>{`${utils.format.amount(protocol.tvl ? protocol.tvl : 0, 2)}$`}</b>
						<p className={'text-sm'}>{`${protocol.totalDebtRatio ? utils.format.amount(protocol.totalDebtRatio, 2) : 0}%`}</p>
					</div>
				</div>
				<div className={'min-w-36 cell-end col-span-4 mr-5 flex flex-row items-center tabular-nums'}>
					<div>
						{protocol.strategiesAmount}
					</div>
				</div>
				<div className={'min-w-36 cell-end col-span-5 flex flex-row items-center tabular-nums'}>
					<div>
						{protocol.allocatedStrategies}
					</div>
				</div>
				<div className={'min-w-36 cell-end col-span-4 flex flex-row items-center'}>
					<div className={'ml-2'}>
						<Chevron
							className={`h-6 w-6 text-accent-500 transition-transform ${p.open ? '-rotate-90' : '-rotate-180'}`} />
					</div>
				</div>
			</div>
		);
	}

	function	RenderDetail(): ReactElement {
		const _strategiesList = Object.keys(protocol.strategiesTVL).map((strategy): {
			name: string, tvl: number
		} => {
			return {
				name: strategy,
				tvl: protocol.strategiesTVL[strategy]
			};
		});
		const strategiesList = _strategiesList.sort((a, b): number => {
			return b.tvl - a.tvl;
		});
		return (
			<div className={'my-10'}>
				{
					strategiesList.map((strategy): ReactElement => {
						return (
							<div className={'mb-10'} key={strategy.name}>
								<div className={'mx-auto flex w-10/12 flex-col'}>
									<span className={'mb-2 flex flex-row items-center justify-between'}>
										<p className={'text-left text-neutral-500'}>{`${strategy.name}`}</p>
										<b className={'text-left text-accent-500'}>
											{`${format.amount(protocol.tvl ? strategy.tvl / protocol.tvl * 100 : 0)}%`}
										</b>
									</span>
									<div>
										<div className={'relative h-2 w-full overflow-hidden rounded-2xl bg-neutral-200 transition-transform'}>
											<div className={'inset-y-0 left-0 h-full rounded-2xl bg-accent-500'} style={{width: `${protocol.tvl ? strategy.tvl / protocol.tvl * 100 : 0}%`}} />
										</div>
									</div>
								</div>
							</div>
						);
					})
				}
				{protocol.emptyStrategies.length > 0 ?
					<div className={'mt-4 w-full'}>
						<Disclosure>
							{({open}): ReactElement => (
								<>
									<Disclosure.Button className={'w-full'}>
										<span className={'mb-2 flex flex-row items-center justify-end gap-2 mx-16'}>
											<p className={'text-left text-neutral-500 text-lg'}>{'Empty Strategies'}</p>
											<Chevron className={`h-4 w-4 mr-2 text-accent-500 ${open ? 'rotate-180' : 'rotate-0'}`} />
										</span>
									</Disclosure.Button>
									<Transition
										as={Fragment}
										show={open}
										enter={'transition duration-100 ease-out origin-top'}
										enterFrom={'transform scale-y-0 opacity-0 origin-top'}
										enterTo={'transform scale-y-100 opacity-100 origin-top'}
										leave={'transition ease-out origin-top'}
										leaveFrom={'transform scale-y-100 opacity-100 origin-top'}
										leaveTo={'transform scale-y-0 opacity-0 origin-top'}>
										<Disclosure.Panel static className={'rounded-default w-full py-2'}>
											{
												protocol.emptyStrategies.map((strategy: string): ReactElement => (
													<div className={'mx-auto flex w-10/12 flex-col mb-5'} key={'empty' + strategy}>
														<span className={'mb-2 flex flex-row items-center justify-between'}>
															<p className={'text-left text-neutral-500'}>{strategy}</p>
															<b className={'text-left text-accent-500'}>{'0%'}</b>
														</span>
														<div>
															<div className={'relative h-2 w-full overflow-hidden rounded-2xl bg-neutral-200 transition-transform'}>
																<div className={'inset-y-0 left-0 h-full rounded-2xl bg-accent-500 w-0'} />
															</div>
														</div>
													</div>
												))
											}
										</Disclosure.Panel>
									</Transition>
								</>
							)}
						</Disclosure>
					</div>
					: null}
			</div>
		);
	}

	return (
		<Card.Detail summary={(p: unknown): ReactElement => renderSummary(p as {open: boolean})}>
			<RenderDetail/>
		</Card.Detail>
	);
});

type		TSectionAllocationsList = {
	sortBy: string,
	protocols: TChainData,
};

const	SectionAllocationsList = memo(function SectionAllocationsList({sortBy, protocols}: TSectionAllocationsList): ReactElement {
	const	[sortedProtocols, set_sortedProtocols] = useState([] as TProtocolData[]);
	useEffect((): void => {
		if(protocols.list){
			const protocolList = Object.keys(protocols.list).map((protocol): TProtocolData => protocols.list[protocol]);
			if (['tvl', '-tvl'].includes(sortBy)) {
				set_sortedProtocols(protocolList.sort((a, b): number => {
					if (sortBy === '-tvl')
						return a.tvl - b.tvl;
					return b.tvl - a.tvl;
				}));
			} else if (['name', '-name'].includes(sortBy)) {
				set_sortedProtocols(protocolList.sort((a, b): number => {
					const	aName = a.name || '';
					const	bName = b.name || '';
					if (sortBy === '-name')
						return aName.localeCompare(bName);
					return bName.localeCompare(aName);
				}));
			} else if (['strategiesAmount', '-strategiesAmount', ''].includes(sortBy)) {
				set_sortedProtocols(protocolList.sort((a, b): number => {
					if (sortBy === '-strategiesAmount')
						return a.strategiesAmount - b.strategiesAmount;
					return b.strategiesAmount - a.strategiesAmount;
				}));
			} else if (['allocatedStrategiesAmount', '-allocatedStrategiesAmount', ''].includes(sortBy)) {
				set_sortedProtocols(protocolList.sort((a, b): number => {
					if (sortBy === '-allocatedStrategiesAmount')
						return a.allocatedStrategies - b.allocatedStrategies;
					return b.allocatedStrategies - a.allocatedStrategies;
				}));
			}
		}
	}, [protocols, sortBy]);

	return (
		<List className={'flex w-full flex-col space-y-2'}>
			{sortedProtocols.map((protocol, index): ReactElement => <span key={protocol.name + index}>
				<ProtocolBox protocol={protocol}/>
			</span>)}
		</List>
	);
});

export default SectionAllocationsList;