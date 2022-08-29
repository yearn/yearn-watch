import	React, {MouseEvent, ReactElement}	from	'react';
import	Link								from	'next/link';
import	{List}								from	'@yearn-finance/web-lib/layouts';
import	{Card, Button, StatisticCard}		from	'@yearn-finance/web-lib/components';
import	* as utils							from	'@yearn-finance/web-lib/utils';
import	{Chevron}							from	'@yearn-finance/web-lib/icons';
import	{TRiskGroup}						from	'contexts/useWatch.d';
import	StrategyBox							from	'components/sections/vaults/StrategyBox';
import	{getImpactScoreColor}				from	'utils';

const	GroupBox = React.memo(
	function GroupBox({group}: {group: TRiskGroup}): ReactElement {
		function	renderSummary(p: {open: boolean}): ReactElement {
			return (
				<div className={`rounded-default relative grid h-20 w-[965px] grid-cols-22 bg-neutral-0 py-4 px-6 transition-colors md:w-full ${p.open ? '' : 'hover:bg-neutral-100'}`}>
					<div className={'min-w-32 col-span-6 flex flex-row items-center'}>
						<div className={'text-neutral-500'}>
							<div className={'flex-row-center'}>
								<div>
									<b>{group.label}</b>
									<p className={'text-xs text-neutral-500'}>
										{group.strategiesCount > 1 ? `${group.strategiesCount} strats` : `${group.strategiesCount} strat`}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className={'min-w-36 cell-end col-span-4 flex flex-row items-center tabular-nums'}>
						<div>
							<b>{`${utils.format.amount(group.tvl, 2)}$`}</b>
							<p className={'text-sm'}>{`${utils.format.amount(group.totalDebtRatio, 2)}%`}</p>
						</div>
					</div>
					<div className={'min-w-36 cell-end col-span-3 flex flex-row items-center tabular-nums'}>
						<div>
							{/* <HumanizeRisk risk={group.tvlImpact} /> */}
							{group.tvlImpact}
						</div>
					</div>
					<div className={'min-w-36 cell-end col-span-3 flex flex-row items-center tabular-nums'}>
						<div>
							{/* <HumanizeRisk risk={group.medianScore} /> */}
							{group.medianScore}
						</div>
					</div>
					<div className={'min-w-36 col-span-2 flex flex-row items-center justify-end tabular-nums'}>
						<div className={'h-4 w-4 rounded-full'} style={{backgroundColor: getImpactScoreColor(group.impactScore)}} />
					</div>
					<div className={'min-w-36 cell-end col-span-4 flex flex-row items-center'}>
						<Link passHref href={`/query${group.urlParams}`}>
							<Button
								onClick={(e: MouseEvent): void => e.stopPropagation()}
								as={'a'}
								variant={'light'}
								className={'min-w-fit px-5'}>
								<span className={'sr-only'}>{'Access details about this strategy'}</span>
								{'Details'}
							</Button>
						</Link>
						<div className={'ml-2'}>
							<Chevron
								className={`h-6 w-6 text-accent-500 transition-transform ${p.open ? '-rotate-90' : '-rotate-180'}`} />
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
							.sort((a, b): number => (a?.details?.index || 0) - (b?.details?.index || 0))
							.map((strategy, index: number): ReactElement => (
								<StrategyBox
									key={index}
									strategy={strategy}
									decimals={strategy.vault.decimals || 18}
									vaultAddress={strategy.vault.address} />
							))
					}
				</div>
			</Card.Detail>
		);
	}
);

	type		TSectionRiskList = {
		sortBy: string,
		groups: TRiskGroup[],
	};
const	SectionRiskList = React.memo(
	function SectionRiskList({sortBy, groups}: TSectionRiskList): ReactElement {
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
			<List className={'flex w-full flex-col space-y-2'}>
				{sortedGroups.map((group): ReactElement => <span key={group.id}><GroupBox group={group} /></span>)}
			</List>
		);
	}
);

export default SectionRiskList;