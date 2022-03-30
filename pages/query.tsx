import	React, {MouseEvent, ReactElement}						from	'react';
import	Image													from	'next/image';
import	Link													from	'next/link';
import	useWatch, {TStrategy}									from	'contexts/useWatch';
import	{useRouter}												from	'next/router';
import	{Card, AddressWithActions, StatisticCard, SearchBox}	from	'@majorfi/web-lib/components';
import	{ArrowDown}												from	'@majorfi/web-lib/icons';
import	* as utils												from	'@majorfi/web-lib/utils';

function	humanizeRisk(risk: number): ReactElement {
	if (risk === 0)
		return <p>{'None'}</p>;
	if (risk === 1)
		return <b>{'Low'}</b>;
	if (risk === 2)
		return <b className={'text-alert-warning-primary'}>{'Medium'}</b>;
	if (risk === 3)
		return <b className={'text-alert-error-primary'}>{'Severe'}</b>;
	if (risk === 4)
		return <b className={'text-alert-error-primary'}>{'High'}</b>;
	return <b className={'text-alert-critical-primary'}>{'Critical'}</b>;
}

type		TTable = {
	sortBy: string,
	strategies: (TStrategy)[],
};
function	Table({sortBy, strategies}: TTable): ReactElement {
	const	[sortedStrategies, set_sortedStrategies] = React.useState([] as (TStrategy)[]);
	
	React.useEffect((): void => {
		if (['risk', '-risk', ''].includes(sortBy)) {
			//Sort by strategy.tvlImpact
			const	_strategies = [...strategies].sort((a, b): number => {
				if (sortBy === '-risk')
					return a.tvlImpact - b.tvlImpact;
				return b.tvlImpact - a.tvlImpact;
			});
			set_sortedStrategies(_strategies);
		} else if (['tvl', '-tvl'].includes(sortBy)) {
			const	_strategies = [...strategies].sort((a, b): number => {
				if (sortBy === '-tvl')
					return a.totalDebtUSDC - b.totalDebtUSDC;
				return b.totalDebtUSDC - a.totalDebtUSDC;
			});
			set_sortedStrategies(_strategies);
		} else if (['debt', '-debt'].includes(sortBy)) {
			const	_strategies = [...strategies].sort((a, b): number => {
				if (sortBy === '-debt')
					return a.totalDebtUSDC - b.totalDebtUSDC;
				return b.totalDebtUSDC - a.totalDebtUSDC;
			});
			set_sortedStrategies(_strategies);
		}

	}, [strategies, sortBy]);


	/* 🔵 - Yearn Finance ******************************************************
	** The total debt represents the total amount of want tokens that are lent
	** to the strategies. This specific amount is calculated by summing the
	** total debt of each strategy. The value returned is a BigNumber which is
	** converted to a human readable number.
	**************************************************************************/
	function	computeTotalDebt(totalDebtUSDC: number): string {
		return (
			utils.format.amount(
				totalDebtUSDC / Number((sortedStrategies?.reduce((acc: number, strategy: TStrategy): number => acc + strategy.totalDebtUSDC, 0) || 0)) * 100,
				2
			)
		);
	}

	return (
		<Card.List className={'flex flex-col w-full'}>
			{sortedStrategies
				.map((strategy, index): ReactElement => (
					<div key={strategy.address} className={`grid-row px-6 py-4 ${index % 2 ? 'bg-surface-variant' : 'bg-surface'}`}>
						<div className={'items-start row-8 min-w-32'}>
							<div className={'tabular-nums text-typo-secondary'}>
								<div className={'flex flex-row items-start'}>
									<Image width={40} height={40} src={strategy.vault?.icon || ''} quality={90} />
									<div className={'ml-2 md:ml-6'}>
										<b className={'text-base text-ellipsis line-clamp-1 text-typo-primary'}>{`${strategy.display_name || strategy.name}`}</b>
										<AddressWithActions
											address={strategy.address}
											explorer={strategy.vault.explorer}
											wrapperClassName={'hidden md:flex'}
											className={'font-mono text-sm text-typo-secondary'} />
									</div>
								</div>
							</div>
						</div>
						<div className={'items-start min-w-36 row-4 cell-end'}>
							<div>
								<b>{`${utils.format.amount(strategy.totalDebtUSDC, 4)}$`}</b>
								<p className={'text-sm'}>{`${computeTotalDebt(strategy.totalDebtUSDC)}%`}</p>
							</div>
						</div>
						<div className={'items-start min-w-36 row-4 cell-end'}>
							<div>
								<b>{utils.format.bigNumberAsAmount(strategy.debtOutstanding, strategy.vault.decimals, 4)}</b>
								<p className={'text-sm'}>{strategy.vault.name}</p>
							</div>
						</div>
						<div className={'justify-end items-start min-w-36 row-3'}>
							<div className={'tabular-nums'}>
								{humanizeRisk(strategy.tvlImpact)}
							</div>
						</div>
						<div className={'items-start min-w-36 row-3 cell-end'}>
							<Link href={`/vault/${strategy.vault.address}/${strategy.address}`}>
								<button className={'px-4 min-w-fit button button-light'}>
									{'Details'}
								</button>
							</Link>
							{/* <p>{utils.format.date(Number(strategy.activation) * 1000, false)}</p> */}
						</div>
					</div>
				))}
		</Card.List>
	);

	return (
		<section className={'min-w-full'}>
			<Card.List className={'flex flex-col space-y-4 w-full'}>
				{
					sortedStrategies
						.sort((a, b): number => b.totalDebtUSDC - a.totalDebtUSDC)
						.map((strategy): ReactElement => (
							<div key={strategy.address}>
								<Card>
									<div className={'flex flex-col w-full'}>
										<div className={'flex flex-col justify-between items-start w-full md:flex-row md:items-center'}>
											<div className={'w-full'}>
												<div className={'flex flex-row items-start'}>
													<Image width={40} height={40} src={strategy.vault?.icon || ''} quality={90} />
													<div className={'ml-2 md:ml-6'}>
														<b className={'text-base text-typo-primary'}>{`${strategy.display_name} (${strategy.name})`}</b>
														<p className={'text-xs text-typo-secondary'}>{strategy.vault?.name}</p>
													</div>
												</div>
											</div>
											<div className={'flex flex-row justify-end items-center mt-4 w-full md:mt-0'}>
												<AddressWithActions
													address={strategy.address}
													explorer={strategy.vault.explorer}
													wrapperClassName={'hidden md:flex'}
													className={'font-mono text-sm text-typo-secondary'} />
												<div onClick={(e: MouseEvent): void => e.stopPropagation()}>
													<Link href={`/vault/${strategy.vault.address}`}>
														<button className={'ml-0 min-w-[132px] md:ml-6 button button-outline'}>
															{'Details'}
														</button>
													</Link>
												</div>
											</div>
										</div>
										<div className={'mt-8'}>
											<StatisticCard.Wrapper>
												<StatisticCard
													backgroundColor={'bg-background'}
													label={'Activation'}
													value={utils.format.date(Number(strategy.activation) * 1000)} />
												<StatisticCard
													backgroundColor={'bg-background'}
													label={'Total USDC Value Locked'}
													value={utils.format.amount(strategy.totalDebtUSDC, 4)} />
												<StatisticCard
													backgroundColor={'bg-background'}
													label={'Ratio USDC Value Locked'}
													value={`${computeTotalDebt(strategy.totalDebtUSDC)}%`} />
												<StatisticCard
													backgroundColor={'bg-background'}
													label={'Debt outstanding'}
													value={utils.format.bigNumberAsAmount(strategy.debtOutstanding, strategy.vault.decimals, 4)} />
												<StatisticCard
													backgroundColor={'bg-background'}
													label={'Risk Factor'}
													value={String(strategy.tvlImpact)} />
											</StatisticCard.Wrapper>
										</div>
									</div>
								</Card>
							</div>
						))
				}
			</Card.List>
		</section>
	);
}

type		TRowHead = {
	sortBy: string,
	set_sortBy: React.Dispatch<React.SetStateAction<string>>
};
function	RowHead({sortBy, set_sortBy}: TRowHead): ReactElement {
	return (
		<div className={'grid sticky top-0 z-10 grid-cols-22 py-3 px-6 pb-4 w-max rounded-sm md:w-full'}>
			<div className={'items-center cell-start row-8 min-w-32'}>
				<p className={'pr-1 text-typo-secondary-variant'}>{'Strategy'}</p>
				<div
					onClick={(): void => set_sortBy((n): string => n === 'name' ? '-name' : n === '-name' ? '' : 'name')}
					className={`p-1 -m-1 cursor-pointer transition-all transform ${sortBy === 'name' ? 'text-icons-variant' : sortBy === '-name' ? 'text-icons-variant rotate-180' : 'text-icons-primary hover:text-icons-variant'}`}>
					<ArrowDown />
				</div>
			</div>
			<div className={'items-center cell-end row-4 min-w-36'}>
				<p className={'pr-1 text-typo-secondary-variant'}>{'Total Value Locked'}</p>
				<div
					onClick={(): void => set_sortBy((n): string => n === 'tvl' ? '-tvl' : n === '-tvl' ? '' : 'tvl')}
					className={`p-1 -m-1 cursor-pointer transition-all transform ${sortBy === 'tvl' ? 'text-icons-variant' : sortBy === '-tvl' ? 'text-icons-variant rotate-180' : 'text-icons-primary hover:text-icons-variant'}`}>
					<ArrowDown />
				</div>
			</div>
			<div className={'items-center cell-end row-4 min-w-36'}>
				<p className={'text-typo-secondary-variant'}>{'Debt Outstanding'}</p>
			</div>
			<div className={'items-center cell-end row-3 min-w-36'}>
				<div className={'pr-1 text-right text-typo-secondary-variant'}>{'Risk'}</div>
				<div
					onClick={(): void => set_sortBy((n): string => n === 'risk' ? '-risk' : n === '-risk' ? '' : 'risk')}
					className={`p-1 -m-1 cursor-pointer transition-all transform ${sortBy === 'risk' ? 'text-icons-variant' : sortBy === '-risk' ? 'text-icons-variant rotate-180' : 'text-icons-primary hover:text-icons-variant'}`}>
					<ArrowDown />
				</div>
			</div>
			<div className={'cell-end row-3 min-w-36'}>
				<div className={'text-left text-typo-secondary-variant'}>{' ' || 'Activation'}</div>
			</div>
		</div>
	);
}

function	Index(): ReactElement {
	const	router = useRouter();
	const	{vaults} = useWatch();
	const	[filteredStrategies, set_filteredStrategies] = React.useState([] as (TStrategy)[]);
	const	[searchTerm, set_searchTerm] = React.useState('');

	const	[sortBy, set_sortBy] = React.useState('risk');

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	** It also takes into account the router query arguments as additional
	** filters.
	**************************************************************************/
	React.useEffect((): void => {
		const	_vaults = vaults;
		const	_filteredStrategies = [];
		const	_filteredVaults = [..._vaults];
		const	excludeStrategies = ((router.query?.exclude || []) as string[]).map((v): string => v.toLowerCase());

		for (const vault of _filteredVaults) {
			for (const strategy of vault.strategies) {
				const	name = (strategy?.name || '').toLowerCase();
				if (excludeStrategies.some((exclude): boolean => (name.search(exclude)) >= 0)) {
					continue;
				}
				_filteredStrategies.push(strategy);
			}
		}
		set_filteredStrategies(_filteredStrategies);
	}, [vaults, searchTerm, router.query]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'w-full'}>
			<div className={'flex flex-col p-6 mb-4 rounded-lg border-2 text-primary bg-secondary border-primary'}>
				<h4 className={'mb-6 text-primary'}>{'Alerts and warnings'}</h4>
				<p>{'Vaults and strategies evolve with the opportunities. Thus, some of they could have point of attention emerging with some time, like a deprecaded strategy with still some TVL, a hight risk with no healthcheck etc.'}</p>
				<p className={'block mt-4'}>{'This page is used to display all of theses warnings to whom it may concern.'}</p>
			</div>

			<div className={'flex flex-col space-y-4 w-full'}>
				<Card hasNoPadding>
					<div className={'flex flex-row justify-between items-center p-6'}>
						<h4>{'Result'}</h4>
						<div className={'flex flex-col mt-2 space-y-2 w-1/4 md:mt-0'}>
							<SearchBox isNarrow backgroundColor={'bg-background'} searchTerm={searchTerm} set_searchTerm={set_searchTerm} />
						</div>
					</div>
					<div className={'grid overflow-x-scroll relative pb-6 md:block md:h-auto h-table-wrapper scrollbar-none'}>
						<RowHead sortBy={sortBy} set_sortBy={set_sortBy} />
						<Table sortBy={sortBy} strategies={filteredStrategies} />
					</div>
				</Card>
			</div>
		</div>
	);
}

export default Index;
