import	React, {ReactElement}				from	'react';
import	Image								from	'next/image';
import	Link								from	'next/link';
import	{List}								from	'@yearn-finance/web-lib/layouts';
import	{AddressWithActions, Button, Card}	from	'@yearn-finance/web-lib/components';
import	* as utils							from	'@yearn-finance/web-lib/utils';
import	{TStrategy}							from	'contexts/useWatch.d';
import	{PageController}					from	'components/PageController';
import	{HumanizeRisk}						from	'components/HumanizedRisk';

type		TSectionQueryList = {
	sortBy: string,
	strategies: (TStrategy)[],
};
const	SectionQueryList = React.memo(function SectionQueryList({sortBy, strategies}: TSectionQueryList): ReactElement {
	const	[sortedStrategies, set_sortedStrategies] = React.useState([] as (TStrategy)[]);
	const	[pageIndex, set_pageIndex] = React.useState(0);
	const	[amountToDisplay] = React.useState(20);

	React.useEffect((): void => {
		if (['risk', '-risk', ''].includes(sortBy)) {
			const	_strategies = [...strategies].sort((a, b): number => {
				if (sortBy === '-risk')
					return a.tvlImpact - b.tvlImpact;
				return b.tvlImpact - a.tvlImpact;
			});
			utils.performBatchedUpdates((): void => {
				set_sortedStrategies(_strategies);
				set_pageIndex(0);
			});
		} else if (['tvl', '-tvl'].includes(sortBy)) {
			const	_strategies = [...strategies].sort((a, b): number => {
				if (sortBy === '-tvl')
					return a.totalDebtUSDC - b.totalDebtUSDC;
				return b.totalDebtUSDC - a.totalDebtUSDC;
			});
			utils.performBatchedUpdates((): void => {
				set_sortedStrategies(_strategies);
				set_pageIndex(0);
			});
		} else if (['name', '-name'].includes(sortBy)) {
			const	_strategies = [...strategies].sort((a, b): number => {
				const	aName = a.display_name || a.name || '';
				const	bName = b.display_name || b.name || '';
				if (sortBy === '-name')
					return aName.localeCompare(bName);
				return bName.localeCompare(aName);
			});
			utils.performBatchedUpdates((): void => {
				set_sortedStrategies(_strategies);
				set_pageIndex(0);
			});
		}
	}, [strategies, sortBy]);

	/* 🔵 - Yearn Finance ******************************************************
	** The total debt represents the total amount of want tokens that are lent
	** to the strategies. This specific amount is calculated by summing the
	** total debt of each strategy. The value returned is a BigNumber which is
	** converted to a human readable number.
	**************************************************************************/
	function	computeTotalDebt(totalDebtUSDC: number): string {
		const	acc = Number((sortedStrategies?.reduce((acc: number, strategy: TStrategy): number => acc + strategy.totalDebtUSDC, 0) || 0));
		if (acc === 0)
			return ('0');
		return (utils.format.amount(totalDebtUSDC / acc * 100, 2));
	}

	function	rowRenderer(index: number): ReactElement {
		const strategy = sortedStrategies[index];

		return (
			<Card key={index} className={'mb-2 w-[965px] md:w-full'}>
				<div className={'grid relative grid-cols-22 w-full'}>
					<div className={'flex flex-row col-span-8 items-center min-w-32'}>
						<div className={'text-neutral-500'}>
							<div className={'flex-row-center'}>
								{strategy.vault?.icon ? <Image
									alt={`token ${strategy?.vault.name}`}
									decoding={'async'}
									width={40}
									height={40}
									src={strategy.vault.icon}
									quality={10} /> : <div className={'w-10 min-w-[40px] h-10 min-h-[40px] rounded-full bg-neutral-200'} />}
								<div className={'ml-2 md:ml-6'}>
									<b className={'whitespace-pre-line break-words'}>{`${strategy.display_name || strategy.name}`}</b>
									<AddressWithActions
										address={strategy.address}
										explorer={strategy.vault.explorer}
										wrapperClassName={'flex'}
										className={'font-mono text-sm text-neutral-500'} />
								</div>
							</div>
						</div>
					</div>
					<div className={'flex flex-row col-span-4 items-center tabular-nums min-w-36 cell-end'}>
						<div>
							<b>{`${utils.format.amount(strategy.totalDebtUSDC, 2)}$`}</b>
							<p className={'text-sm'}>{`${computeTotalDebt(strategy.totalDebtUSDC)}%`}</p>
						</div>
					</div>
					<div className={'flex flex-row col-span-4 items-center tabular-nums min-w-36 cell-end'}>
						<div>
							<b>{utils.format.bigNumberAsAmount(strategy.debtOutstanding, strategy.vault.decimals, 4)}</b>
							<p className={'text-sm'}>{strategy.vault.name}</p>
						</div>
					</div>
					<div className={'flex flex-row col-span-3 justify-end items-center tabular-nums min-w-36'}>
						<div>
							<HumanizeRisk risk={strategy.tvlImpact} />
						</div>
					</div>
					<div className={'flex flex-row col-span-3 items-center min-w-36 cell-end'}>
						<Link passHref href={`/vault/${strategy.vault.address}/${strategy.address}`}>
							<Button
								as={'a'}
								variant={'light'}
								className={'px-5 min-w-fit'}>
								<span className={'sr-only'}>{'Access details about this strategy'}</span>
								{'Details'}
							</Button>
						</Link>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<section
			aria-label={'strats-vaults-query-list'}
			className={'min-w-full h-full'}>
			<List>
				{sortedStrategies.slice(pageIndex, pageIndex + amountToDisplay).map((_, index): ReactElement => rowRenderer(
					index + pageIndex
				))}
			</List>
			<div className={'flex flex-row justify-end items-center'}>
				<PageController
					pageIndex={pageIndex}
					pageLen={sortedStrategies.length}
					amountToDisplay={amountToDisplay}
					nextPage={(): void => set_pageIndex(pageIndex + amountToDisplay)}
					previousPage={(): void => set_pageIndex(
						pageIndex - amountToDisplay >= 0 ? pageIndex - amountToDisplay : 0
					)} />
			</div>
		</section>
	);
});

export default SectionQueryList;