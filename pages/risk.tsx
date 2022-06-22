import	React, {ReactElement} 		from	'react';
import	axios						from	'axios';
import	{useWeb3}					from	'@yearn-finance/web-lib/contexts';
import	SectionRiskList				from	'components/sections/risk/SectionRiskList';
import	SectionMatrix				from	'components/sections/risk/SectionMatrix';
import	{TableHead, TableHeadCell}	from	'components/TableHeadCell';
import	useWatch					from	'contexts/useWatch';
import	{TRowHead, TRiskGroup}		from	'contexts/useWatch.d';
import	{findStrategyBySearch}		from	'utils/filters';
import	{getImpactScore, getTvlImpact, getLongevityScore, getExcludeIncludeUrlParams, median}		from	'utils';

/* 🔵 - Yearn Finance **********************************************************
** This will render the head of the fake table we have, with the sortable
** elements. This component asks for sortBy and set_sortBy in order to handle
** the chevron displays and to set the sort based on the user's choice.
******************************************************************************/
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

/* 🔵 - Yearn Finance **********************************************************
** Main render of the Risk page
******************************************************************************/
function	Risk(): ReactElement {
	const	{chainID} = useWeb3();
	const	{isUpdating, dataChainID, vaults} = useWatch();
	const	[sortBy, set_sortBy] = React.useState('score');
	const	[groups, set_groups] = React.useState<TRiskGroup[]>([]);
	const [risk, set_risk] = React.useState<TRiskGroup[]>([]);

	// load the risk framework scores from external data sources
	const fetchRiskGroups = React.useCallback(async (): Promise<void> => {
		const	_chainID = chainID || 1;
		const endpoints = [
			process.env.RISK_GH_URL as string,	// Github
			process.env.RISK_API_URL as string + '/riskgroups/'	// Risk API
		];
		for (const endpoint of endpoints) {
			const response = await axios.get(endpoint);
			if (response.status === 200) {
				const riskGroups = response.data as TRiskGroup[];
				const riskForNetworks = riskGroups.filter((r): boolean => r.network === _chainID);
				console.log(riskForNetworks);
				set_risk(riskForNetworks);
				return;
			}
		}
	}, [chainID]);

	React.useEffect((): void => {
		fetchRiskGroups();
	}, [fetchRiskGroups]);

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	** It also takes into account the router query arguments as additional
	** filters.
	**************************************************************************/
	React.useEffect((): void => {
		if (dataChainID !== chainID && !(dataChainID === 1 && chainID === 0)) {
			set_groups([]);
			return;
		}
		const	_vaults = vaults;
		const	_groups = [];
		let		_totalDebt = 0;

		for (const group of risk) {
			const	_group = {...group} as unknown as TRiskGroup;
			_group.oldestActivation = 0;
			_group.tvl = 0;
			_group.strategiesCount = 0;
			_group.strategies = [];
			for (const vault of _vaults) {
				for (const strategy of vault.strategies) {
					if (group.criteria.exclude.some((exclude): boolean => findStrategyBySearch(strategy, exclude))) {
						continue;
					}
					if (group.criteria.nameLike.some((include): boolean => findStrategyBySearch(strategy, include)) ||
							group.criteria.strategies.some((include): boolean => findStrategyBySearch(strategy, include))) {
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
			if (_group.strategies.length === 0)
				_group.longevityScore = 5;
			else
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
			_group.urlParams = getExcludeIncludeUrlParams(group.criteria);
			_groups.push(_group);
		}
		for (const group of _groups) {
			group.totalDebtRatio = group.tvl / _totalDebt * 100;
		}

		set_groups(_groups);
	}, [vaults, dataChainID, chainID, isUpdating, risk]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex-col-full'}>
			<div>
				<SectionMatrix groups={groups} />
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

export default Risk;
