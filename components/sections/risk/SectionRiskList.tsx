import	React, {ReactElement}			from	'react';
import	Link							from	'next/link';
import	{List}							from	'@yearn/web-lib/layouts';
import	{Card, Button, StatisticCard}	from	'@yearn/web-lib/components';
import	* as utils						from	'@yearn/web-lib/utils';
import	{Chevron}						from	'@yearn/web-lib/icons';
import	{TRiskGroup}					from	'contexts/useWatch.d';
import	StrategyBox						from	'components/sections/vaults/StrategyBox';
import	{getImpactScoreColor}			from	'utils';

const	GroupBox = React.memo(function GroupBox({group}: {group: TRiskGroup}): ReactElement {
	function	renderSummary(p: {open: boolean}): ReactElement {
		return (
			<div className={`grid relative py-4 px-6 w-[965px] h-20 rounded-lg md:w-full grid-cols-22 bg-surface transition-colors ${p.open ? '' : 'hover:bg-surface-variant'}`}>
				<div className={'flex flex-row col-span-6 items-center min-w-32'}>
					<div className={'text-typo-secondary'}>
						<div className={'flex-row-center'}>
							<div>
								<b>{group.label}</b>
								<p className={'text-xs text-typo-secondary'}>
									{group.strategiesCount > 1 ? `${group.strategiesCount} strats` : `${group.strategiesCount} strat`}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className={'flex flex-row col-span-4 items-center tabular-nums min-w-36 cell-end'}>
					<div>
						<b>{`${utils.format.amount(group.tvl, 2)}$`}</b>
						<p className={'text-sm'}>{`${utils.format.amount(group.totalDebtRatio, 2)}%`}</p>
					</div>
				</div>
				<div className={'flex flex-row col-span-3 items-center tabular-nums min-w-36 cell-end'}>
					<div>
						{/* <HumanizeRisk risk={group.tvlImpact} /> */}
						{group.tvlImpact}
					</div>
				</div>
				<div className={'flex flex-row col-span-3 items-center tabular-nums min-w-36 cell-end'}>
					<div>
						{/* <HumanizeRisk risk={group.medianScore} /> */}
						{group.medianScore}
					</div>
				</div>
				<div className={'flex flex-row col-span-2 justify-end items-center tabular-nums min-w-36'}>
					<div className={'w-4 h-4 rounded-full'} style={{backgroundColor: getImpactScoreColor(group.impactScore)}} />
				</div>
				<div className={'flex flex-row col-span-4 items-center min-w-36 cell-end'}>
					<Link passHref href={`/query${group.urlParams}`}>
						<Button
							as={'a'}
							variant={'light'}
							className={'px-5 min-w-fit'}>
							<span className={'sr-only'}>{'Access details about this strategy'}</span>
							{'Details'}
						</Button>
					</Link>
					<div className={'ml-2'}>
						<Chevron
							className={`w-6 h-6 text-primary transition-transform ${p.open ? '-rotate-90' : '-rotate-180'}`} />
					</div>
				</div>
			</div>
		);
	}

	return (
		<Card.Detail summary={(p: unknown): ReactElement => renderSummary(p as {open: boolean})}>
			<StatisticCard.Wrapper>
				<StatisticCard
					variant={'background'}
					className={'col-span-12 md:col-span-3'}
					label={'TVL Impact'}
					value={(group.tvlImpact).toString()} />
				<StatisticCard
					variant={'background'}
					className={'col-span-12 md:col-span-3'}
					label={'Audit Score'}
					value={(group.auditScore).toString()} />
				<StatisticCard
					variant={'background'}
					className={'col-span-12 md:col-span-3'}
					label={'Code Review Score'}
					value={(group.codeReviewScore).toString()} />
				<StatisticCard
					variant={'background'}
					className={'col-span-12 md:col-span-3'}
					label={'Complexity Score'}
					value={(group.complexityScore).toString()} />
				
				<StatisticCard
					variant={'background'}
					className={'col-span-12 md:col-span-3'}
					label={'Longevity Impact'}
					value={(group.longevityScore).toString()} />
				<StatisticCard
					variant={'background'}
					className={'col-span-12 md:col-span-3'}
					label={'Protocol Safety Score'}
					value={(group.protocolSafetyScore).toString()} />
				<StatisticCard
					variant={'background'}
					className={'col-span-12 md:col-span-3'}
					label={'Team Knowledge Score'}
					value={(group.teamKnowledgeScore).toString()} />
				<StatisticCard
					variant={'background'}
					className={'col-span-12 md:col-span-3'}
					label={'Testing Score'}
					value={(group.testingScore).toString()} />
			</StatisticCard.Wrapper>
			<div className={'mt-10'}>
				<b className={'mb-1 ml-2'}>{'Attached Strategies'}</b>
				{
					group.strategies
						.sort((a, b): number => (a.index || 0) - (b.index || 0))
						.map((strategy, index: number): ReactElement => (
							<StrategyBox
								key={index}
								strategy={strategy}
								symbol={strategy.vault.name}
								decimals={strategy.vault.decimals || 18}
								vaultAddress={strategy.vault.address}
								vaultExplorer={strategy.vault.explorer} />
						))
				}
			</div>
		</Card.Detail>
	);
});

type		TSectionRiskList = {
	sortBy: string,
	groups: TRiskGroup[],
};
const	SectionRiskList = React.memo(function SectionRiskList({sortBy, groups}: TSectionRiskList): ReactElement {
	const	[sortedGroups, set_sortedGroups] = React.useState([] as (TRiskGroup)[]);
	
	React.useEffect((): void => {
		if (['risk', '-risk', ''].includes(sortBy)) {
			const	_groups = [...groups].sort((a, b): number => {
				if (sortBy === '-risk')
					return a.tvlImpact - b.tvlImpact;
				return b.tvlImpact - a.tvlImpact;
			});
			set_sortedGroups(_groups);
		} else if (['tvl', '-tvl'].includes(sortBy)) {
			const	_groups = [...groups].sort((a, b): number => {
				if (sortBy === '-tvl')
					return a.tvl - b.tvl;
				return b.tvl - a.tvl;
			});
			set_sortedGroups(_groups);
		} else if (['name', '-name'].includes(sortBy)) {
			const	_groups = [...groups].sort((a, b): number => {
				const	aName = a.label || '';
				const	bName = b.label || '';
				if (sortBy === '-name')
					return aName.localeCompare(bName);
				return bName.localeCompare(aName);
			});
			set_sortedGroups(_groups);
		} else if (['likelihood', '-likelihood', ''].includes(sortBy)) {
			const	_groups = [...groups].sort((a, b): number => {
				if (sortBy === '-likelihood')
					return a.medianScore - b.medianScore;
				return b.medianScore - a.medianScore;
			});
			set_sortedGroups(_groups);
		} else if (['score', '-score', ''].includes(sortBy)) {
			const	_groups = [...groups].sort((a, b): number => {
				if (sortBy === '-score')
					return a.impactScore - b.impactScore;
				return b.impactScore - a.impactScore;
			});
			set_sortedGroups(_groups);
		}
	}, [groups, sortBy]);

	return (
		<List.Animated className={'flex flex-col space-y-2 w-full'}>
			{sortedGroups.map((group): ReactElement => <span key={group.id}><GroupBox group={group} /></span>)}
		</List.Animated>
	);
});

export default SectionRiskList;