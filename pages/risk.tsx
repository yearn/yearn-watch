import	React, {ReactElement} 		from	'react';
import	SectionRiskList				from	'components/sections/risk/SectionRiskList';
import	{TableHead, TableHeadCell}	from	'components/TableHeadCell';
import	RISK						from	'utils/risks.json';
import	useWatch					from	'contexts/useWatch';
import	{TStrategy}					from	'contexts/useWatch.d';
import	{findStrategyBySearch}		from	'utils/filters';
import	{useWeb3}					from	'@majorfi/web-lib/contexts';
import	{getImpactScore, getTvlImpact, getLongevityScore, median}		from	'utils';

type		TRowHead = {
	sortBy: string,
	set_sortBy: React.Dispatch<React.SetStateAction<string>>
};
function	RowHead({sortBy, set_sortBy}: TRowHead): ReactElement {
	return (
		<TableHead sortBy={sortBy} set_sortBy={set_sortBy}>
			<TableHeadCell
				className={'col-span-6 cell-start min-w-32'}
				label={'Group'}
				sortId={'name'} />
			<TableHeadCell
				className={'col-span-4 cell-end min-w-36'}
				label={'Total Value Locked'}
				sortId={'tvl'} />
			<TableHeadCell
				className={'col-span-3 cell-end min-w-36'}
				label={'Risk'}
				sortId={'risk'} />
			<TableHeadCell
				className={'col-span-3 cell-end min-w-36'}
				label={'Likelihood'}
				sortId={'likelihood'} />
			<TableHeadCell
				className={'col-span-2 cell-end min-w-36'}
				label={'Score'}
				sortId={'score'} />
		</TableHead>
	);
}

type TGroup = {
	id: string,
	network: number,
	label: string,
	totalDebtRatio: number,
	tvl: number, //TVL Impact
	tvlScore: number, //TVL Impact
	tvlImpact: number, //TVL Impact
	auditScore: number, //Audit Score
	codeReviewScore: number, //Code Review Score
	testingScore: number, //Testing Score
	protocolSafetyScore: number, //Protocol Safety Score
	complexityScore: number, //Complexity Score
	teamKnowledgeScore: number, //Team Knowledge Score
	longevityScore: number, //Longevity Score
	oldestActivation: number,
	medianScore: number,
	impactScore: number,
	strategiesCount: number,
	criteria: {
		nameLike: string[],
		strategies: string[],
		exclude: string[]
	},
	strategies: TStrategy[]
}

function	MatrixChart({groups}: {groups: TGroup[]}): ReactElement {
	const	[labelPerPosition, set_labelPerPosition] = React.useState([
		[[], [], [], [], []],
		[[], [], [], [], []],
		[[], [], [], [], []],
		[[], [], [], [], []],
		[[], [], [], [], []]
	]);

	React.useEffect((): void => {
		const	_labelPerPosition = [
			[[], [], [], [], []],
			[[], [], [], [], []],
			[[], [], [], [], []],
			[[], [], [], [], []],
			[[], [], [], [], []]
		];
		for (const _group of groups) {
			const likelihoodIndex = _group.medianScore - 1;
			let	impact = _group.tvlImpact;
			if (impact === 0)
				impact = 1;
			const impactIndex = 5 - impact;

			_labelPerPosition[impactIndex][likelihoodIndex].push(_group.label as never);
		}

		set_labelPerPosition(_labelPerPosition);
	}, [groups]);

	return (
		<div className={'flex flex-row pl-0'}>
			<div className={'grid grid-cols-10 gap-0.5 w-full'}>

				<div className={'col-span-2 p-2 space-y-1 h-full text-sm opacity-50 text-typo-secondary'}>{'Rare'}</div>
				<div className={'col-span-2 p-2 space-y-1 h-full text-sm opacity-50 text-typo-secondary'}>{'Unlikely'}</div>
				<div className={'col-span-2 p-2 space-y-1 h-full text-sm opacity-50 text-typo-secondary'}>{'Even chance'}</div>
				<div className={'col-span-2 p-2 space-y-1 h-full text-sm opacity-50 text-typo-secondary'}>{'Likely'}</div>
				<div className={'col-span-2 p-2 space-y-1 h-full text-sm opacity-50 text-typo-secondary'}>{'Almost certain'}</div>

				
				<div className={'relative col-span-2 p-2 space-y-1 min-h-[62px] text-sm bg-[#f5f514] rounded-tl-lg'}>
					<div className={'flex justify-center items-center h-full text-sm text-center'}>
						<p className={'absolute -left-6 opacity-50 -rotate-180 text-typo-secondary'} style={{writingMode: 'vertical-rl'}}>{'Critical'}</p>
					</div>
					{labelPerPosition[0][0].map((e): ReactElement => <p key={e}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>{labelPerPosition[0][1].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262]'}>{labelPerPosition[0][2].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262]'}>{labelPerPosition[0][3].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262] rounded-tr-lg'}>{labelPerPosition[0][4].map((e): ReactElement => <p key={e}>{e}</p>)}</div>

				
				<div className={'relative col-span-2 p-2 space-y-1 min-h-[62px] text-sm bg-[#19c519]'}>
					<div className={'flex justify-center items-center h-full text-sm text-center'}>
						<p className={'absolute -left-6 opacity-50 -rotate-180 text-typo-secondary'} style={{writingMode: 'vertical-rl'}}>{'High'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'High'}</p>
					</div>
					{labelPerPosition[1][0].map((e): ReactElement => <p key={e}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>{labelPerPosition[1][1].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>{labelPerPosition[1][2].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262]'}>{labelPerPosition[1][3].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262]'}>{labelPerPosition[1][4].map((e): ReactElement => <p key={e}>{e}</p>)}</div>

				
				<div className={'relative col-span-2 p-2 space-y-1 min-h-[62px] text-sm bg-[#19c519]'}>
					<div className={'flex justify-center items-center h-full text-sm text-center'}>
						<p className={'absolute -left-6 opacity-50 -rotate-180 text-typo-secondary'} style={{writingMode: 'vertical-rl'}}>{'Severe'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'Severe'}</p>
					</div>
					{labelPerPosition[2][0].map((e): ReactElement => <p key={e}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>{labelPerPosition[2][1].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>{labelPerPosition[2][2].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>{labelPerPosition[2][3].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262]'}>{labelPerPosition[2][4].map((e): ReactElement => <p key={e}>{e}</p>)}</div>

				
				<div className={'relative col-span-2 p-2 space-y-1 min-h-[62px] text-sm bg-[#19c519]'}>
					<div className={'flex justify-center items-center h-full text-sm text-center'}>
						<p className={'absolute -left-6 opacity-50 -rotate-180 text-typo-secondary'} style={{writingMode: 'vertical-rl'}}>{'Medium'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'Medium'}</p>
					</div>
					{labelPerPosition[3][0].map((e): ReactElement => <p key={e}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>{labelPerPosition[3][1].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>{labelPerPosition[3][2].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>{labelPerPosition[3][3].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>{labelPerPosition[3][4].map((e): ReactElement => <p key={e}>{e}</p>)}</div>

				
				<div className={'relative col-span-2 p-2 space-y-1 min-h-[62px] text-sm bg-[#19c519] rounded-bl-lg'}>
					<div className={'flex justify-center items-center h-full text-sm text-center'}>
						<p className={'absolute -left-6 opacity-50 -rotate-180 text-typo-secondary'} style={{writingMode: 'vertical-rl'}}>{'Low'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'Low'}</p>
					</div>
					{labelPerPosition[4][0].map((e): ReactElement => <p key={e}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>{labelPerPosition[4][1].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>{labelPerPosition[4][2].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>{labelPerPosition[4][3].map((e): ReactElement => <p key={e}>{e}</p>)}</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514] rounded-br-lg'}>{labelPerPosition[4][4].map((e): ReactElement => <p key={e}>{e}</p>)}</div>

			</div>
		</div>
	);
}

function	Index(): ReactElement {
	const	{chainID} = useWeb3();
	const	{vaults} = useWatch();
	const	[sortBy, set_sortBy] = React.useState('score');
	const	[groups, set_groups] = React.useState<TGroup[]>([]);

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	** It also takes into account the router query arguments as additional
	** filters.
	**************************************************************************/
	React.useEffect((): void => {
		const	_vaults = vaults;
		const	_groups = [];
		const	riskForNetworks = RISK.filter((r): boolean => r.network === chainID);
		let		_totalDebt = 0;

		for (const group of riskForNetworks) {
			const	_group = {...group} as unknown as TGroup;
			_group.oldestActivation = 0;
			_group.tvl = 0;
			_group.strategiesCount = 0;
			_group.strategies = [];
			for (const vault of _vaults) {
				for (const strategy of vault.strategies) {
					if (group.criteria.exclude.some((exclude): boolean => findStrategyBySearch(strategy, exclude))) {
						continue;
					}
					if (group.criteria.nameLike.some((include): boolean => findStrategyBySearch(strategy, include))) {
						_totalDebt += strategy.totalDebtUSDC;
						_group.tvl += strategy.totalDebtUSDC;
						_group.strategiesCount += 1;
						_group.strategies.push(strategy);
						if (_group.oldestActivation === 0 || _group.oldestActivation > Number(strategy.activation)) {
							_group.oldestActivation = Number(strategy.activation);
						}
					}
				}
			}
			_group.longevityScore = getLongevityScore(((Date.now().valueOf()) - (_group.oldestActivation * 1000)) / 1000 / 60 / 60 / 24);
			_group.medianScore = median([
				_group.auditScore,
				_group.codeReviewScore,
				_group.testingScore,
				_group.protocolSafetyScore,
				_group.complexityScore,
				_group.teamKnowledgeScore,
				_group.longevityScore
			]);
			_group.tvlImpact = getTvlImpact(_group.tvl);
			_group.impactScore = getImpactScore(_group.tvlImpact, _group.medianScore);
			_groups.push(_group);
		}
		for (const group of _groups) {
			group.totalDebtRatio = group.tvl / _totalDebt * 100;
		}


		set_groups(_groups);
	}, [vaults, chainID]);


	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex flex-col w-full h-full'}>
			<div>
				<MatrixChart groups={groups} />
			</div>
			<div className={'flex overflow-x-scroll pb-0 mt-10 h-full'}>
				<div className={'flex flex-col w-[965px] h-full md:w-full'}>
					<RowHead sortBy={sortBy} set_sortBy={set_sortBy} />
					<SectionRiskList sortBy={sortBy} groups={groups} />
				</div>
			</div>
		</div>
	);
}

export default Index;
