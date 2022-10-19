import React, {ReactElement, useCallback, useEffect, useState}  from 'react';
import axios from 'axios';
import {useWeb3} from '@yearn-finance/web-lib/contexts';
import SectionRiskList from 'components/sections/risk/SectionRiskList';
import SectionMatrix from 'components/sections/risk/SectionMatrix';
import {TableHead, TableHeadCell} from 'components/TableHeadCell';
import {useWatch} from 'contexts/useWatch';
import {TRiskGroup, TVaultWithRiskGroup, TRowHead} from 'contexts/useWatch.d';
import {findStrategyBySearch} from 'utils/filters';
import {getExcludeIncludeUrlParams, getImpactScore, getLongevityScore, getTvlImpact, median} from 'utils';

/* 🔵 - Yearn Finance **********************************************************
** This will render the head of the fake table we have, with the sortable
** elements. This component asks for sortBy and set_sortBy in order to handle
** the chevron displays and to set the sort based on the user's choice.
******************************************************************************/
function	RowHead({sortBy, set_sortBy}: TRowHead): ReactElement {
	return (
		<TableHead sortBy={sortBy} set_sortBy={set_sortBy}>
			<TableHeadCell
				className={'cell-start min-w-32 col-span-6'}
				label={'Group'}
				sortId={'name'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-4'}
				label={'Total Value Locked'}
				sortId={'tvl'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-3'}
				label={'Risk'}
				sortId={'risk'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-3'}
				label={'Likelihood'}
				sortId={'likelihood'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-2'}
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
	const	{isUpdating, vaults} = useWatch();
	const	[sortBy, set_sortBy] = useState('score');
	const	[groups, set_groups] = useState<TRiskGroup[]>([]);
	const [risk, set_risk] = useState<TRiskGroup[]>([]);

	// load the risk framework scores from external data sources
	const fetchRiskGroups = useCallback(async (): Promise<void> => {
		const _chainID = chainID || 1;
		const endpoint = `${process.env.YDAEMON_BASE_URL}/${_chainID}/vaults/all?classification=all&strategiesRisk=withRisk`;
		const response = await axios.get(endpoint);
		if (response.status === 200) {
			const vaultWithRiskGroup = response.data as TVaultWithRiskGroup[];
			const riskGroup = vaultWithRiskGroup.reduce((obj, vault) => {
				let _obj: Record<string, TRiskGroup> = { ...obj };
				vault.strategies.forEach((strategy) => {
					const { risk, address } = strategy;
					const label = risk.riskGroup;
					if (!label) return;

					const id = `${_chainID}_${label.toLowerCase().split(' ').join('')}`;
					const strategyCriteria = [...(_obj[id]?.criteria.strategies ?? [])];
					const group = {
						[id]: {
							id,
							network: _chainID,
							label,
							urlParams: '',
							totalDebtRatio: 0,
							tvl: 0,
							tvlImpact: risk.TVLImpact,
							auditScore: risk.auditScore,
							codeReviewScore: risk.codeReviewScore,
							testingScore: risk.testingScore,
							protocolSafetyScore: risk.protocolSafetyScore,
							complexityScore: risk.complexityScore,
							teamKnowledgeScore: risk.teamKnowledgeScore,
							longevityScore: risk.longevityImpact,
							oldestActivation: 0,
							medianScore: 0,
							impactScore: 0,
							strategiesCount: 0,
							criteria: {
								strategies: [...strategyCriteria, address],
								exclude: []
							},
							strategies: []
						} as TRiskGroup
					};
					_obj = {..._obj, ...group};
				});
				return _obj;
			}, {} as Record<string, TRiskGroup>);
			set_risk(Object.values(riskGroup));
			return;
		}

	}, [chainID]);

	useEffect((): void => {
		fetchRiskGroups();
	}, [fetchRiskGroups]);

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	** It also takes into account the router query arguments as additional
	** filters.
	**************************************************************************/
	useEffect((): void => {
		if (chainID === 0) {
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
					if (group.criteria.strategies.some((include): boolean => findStrategyBySearch(strategy, include))) {
						_totalDebt += strategy?.details?.totalDebtUSDC;
						_group.tvl += strategy?.details?.totalDebtUSDC;
						_group.strategiesCount += 1;
						_group.strategies.push(strategy);
						if (_group.oldestActivation === 0 || _group.oldestActivation > Number(strategy?.details?.activation)) {
							_group.oldestActivation = Number(strategy?.details?.activation);
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
	}, [vaults, chainID, isUpdating, risk]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex-col-full'}>
			<div>
				<SectionMatrix groups={groups} />
			</div>
			<div className={'mt-10 flex h-full overflow-x-scroll pb-0 scrollbar-none'}>
				<div className={'flex h-full w-[965px] flex-col md:w-full'}>
					<RowHead sortBy={sortBy} set_sortBy={set_sortBy} />
					<SectionRiskList sortBy={sortBy} groups={groups} />
				</div>
			</div>
		</div>
	);
}

export default Risk;
