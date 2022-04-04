import	React, {ReactElement}			from	'react';
import	Image							from	'next/image';
import	Link							from	'next/link';
import	{TStrategy}						from	'contexts/useWatch.d';
import	{List}							from	'@majorfi/web-lib/layouts';
import	{AddressWithActions, Button}	from	'@majorfi/web-lib/components';
import	* as utils						from	'@majorfi/web-lib/utils';

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

	function rowRenderer({key, index, style}: {key: string, index: number, style: {[key: string]: string}}): ReactElement {
		const strategy = sortedStrategies[index];
		return (
			<div key={key} style={style}>
				<div className={`grid grid-cols-22 w-[965px] md:w-full h-20 relative px-6 py-4 mb-2 rounded-lg ${index % 2 ? 'bg-surface' : 'bg-surface'}`}>
					<div className={'flex flex-row col-span-8 items-center min-w-32'}>
						<div className={'text-typo-secondary'}>
							<div className={'flex flex-row items-center'}>
								<Image width={40} height={40} src={strategy.vault?.icon || ''} quality={60} loading={'eager'} />
								<div className={'ml-2 md:ml-6'}>
									<b className={'text-base text-ellipsis line-clamp-1 text-typo-primary'}>{`${strategy.display_name || strategy.name}`}</b>
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
							<b>{`${utils.format.amount(strategy.totalDebtUSDC, 4)}$`}</b>
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
							{humanizeRisk(strategy.tvlImpact)}
						</div>
					</div>
					<div className={'flex flex-row col-span-3 items-center min-w-36 cell-end'}>
						<Link passHref href={`/vault/${strategy.vault.address}/${strategy.address}`}>
							<Button
								as={'a'}
								variant={'light'}
								className={'px-5 min-w-fit'}>
								{'Details'}
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}


	return (
		<List.Virtualized
			elements={sortedStrategies}
			rowHeight={88}
			rowRenderer={rowRenderer} />
	);
});

export default SectionHealthcheckList;