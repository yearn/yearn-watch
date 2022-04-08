import	React, {ReactElement}			from	'react';
import	Image							from	'next/image';
import	Link							from	'next/link';
import	{TStrategy}						from	'contexts/useWatch.d';
import	{HumanizeRisk}					from	'components/HumanizedRisk';
import	{List}							from	'@majorfi/web-lib/layouts';
import	{AddressWithActions, Button}	from	'@majorfi/web-lib/components';
import	* as utils						from	'@majorfi/web-lib/utils';

type		TSectionHealthcheckList = {
	sortBy: string,
	strategies: (TStrategy)[],
};
const	SectionHealthcheckList = React.memo(function SectionHealthcheckList({sortBy, strategies}: TSectionHealthcheckList): ReactElement {
	const	[sortedStrategies, set_sortedStrategies] = React.useState([] as (TStrategy)[]);
	
	React.useEffect((): void => {
		if (['risk', '-risk', ''].includes(sortBy)) {
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
		} else if (['name', '-name'].includes(sortBy)) {
			const	_strategies = [...strategies].sort((a, b): number => {
				const	aName = a.display_name || a.name || '';
				const	bName = b.display_name || b.name || '';
				if (sortBy === '-name')
					return aName.localeCompare(bName);
				return bName.localeCompare(aName);
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

	function rowRenderer(index: number): ReactElement {
		const strategy = sortedStrategies[index];
		return (
			<div key={strategy.address}>
				<div className={'grid relative py-4 px-6 mb-2 w-[965px] h-20 rounded-lg md:w-full grid-cols-22 bg-surface'}>
					<div className={'flex flex-row col-span-8 items-center min-w-32'}>
						<div className={'text-typo-secondary'}>
							<div className={'flex-row-center'}>
								{strategy.vault?.icon ? <Image
									alt={`token ${strategy?.vault.name}`}
									decoding={'async'}
									width={40}
									height={40}
									src={strategy.vault.icon}
									quality={60} /> : <div className={'w-10 min-w-[40px] h-10 min-h-[40px] rounded-full bg-background'} />}
								<div className={'ml-2 md:ml-6'}>
									<b className={'text-ellipsis line-clamp-1'}>{`${strategy.display_name || strategy.name}`}</b>
									<AddressWithActions
										address={strategy.address}
										explorer={strategy.vault.explorer}
										wrapperClassName={'flex'}
										className={'font-mono text-sm text-typo-secondary'} />
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
			</div>
		);
	}


	return (
		<List.Animated>
			{sortedStrategies.map((_, index): ReactElement => rowRenderer(index))}
		</List.Animated>
	);
});

export default SectionHealthcheckList;