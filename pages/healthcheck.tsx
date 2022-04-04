import	React, {ReactElement} 					from	'react';
import	useWatch								from	'contexts/useWatch';
import	{TStrategy}								from	'contexts/useWatch.d';
import	{Card, AlertBanner, Switch, SearchBox}	from	'@majorfi/web-lib/components';
import	* as utils								from	'@majorfi/web-lib/utils';
import	{deepFindVaultBySearch}					from	'utils/filters';
import	SectionHealthcheckList					from	'components/sections/healthcheck/SectionHealthcheckList';
import	{TableHead, TableHeadCell}				from	'components/TableHeadCell';

type		TRowHead = {
	sortBy: string,
	set_sortBy: React.Dispatch<React.SetStateAction<string>>
};
function	RowHead({sortBy, set_sortBy}: TRowHead): ReactElement {
	return (
		<TableHead sortBy={sortBy} set_sortBy={set_sortBy}>
			<TableHeadCell
				className={'col-span-8 cell-start min-w-32'}
				label={'Strategy'}
				sortId={'name'} />
			<TableHeadCell
				className={'col-span-4 cell-end min-w-36'}
				label={'Total Value Locked'}
				sortId={'tvl'} />
			<TableHeadCell
				className={'col-span-4 cell-end min-w-36'}
				label={'Debt Outstanding'} />
			<TableHeadCell
				className={'col-span-3 cell-end min-w-36'}
				label={'Risk'}
				sortId={'risk'} />
		</TableHead>
	);
}

function	Index(): ReactElement {
	const	{vaults} = useWatch();
	const	[filteredStrategies, set_filteredStrategies] = React.useState([] as TStrategy[]);
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[isOnlyWithTvl, set_isOnlyWithTvl] = React.useState(true);
	const	[sortBy, set_sortBy] = React.useState('risk');

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	**************************************************************************/
	React.useEffect((): void => {
		const	_vaults = vaults;
		let		_filteredVaults = [..._vaults];
		const	_filteredStrategies = [];

		_filteredVaults = _filteredVaults.filter((vault): boolean => deepFindVaultBySearch(vault, searchTerm));

		for (const vault of _filteredVaults) {
			for (const strategy of vault.strategies) {
				const	shouldDoHealtcheck = strategy.shouldDoHealthCheck;
				const	hasValidHealtcheckAddr = !utils.isZeroAddress(strategy.addrHealthCheck);

				if (shouldDoHealtcheck || hasValidHealtcheckAddr || (strategy?.totalDebt.isZero() && isOnlyWithTvl))
					continue;
				_filteredStrategies.push(strategy);
			}
		}
		set_filteredStrategies(_filteredStrategies);
	}, [vaults, searchTerm, isOnlyWithTvl]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex flex-col w-full h-full'}>
			<div>
				<AlertBanner title={'Alerts and warnings'} level={'info'}>
					<div>
						<p>{'The healthchecks have been added since v0.4.2 for the Yearn\'s strategies in order to ensure that they are working properly. The healthchecks are automatically triggered on harvest if the doHealthCheck parameter is enabled, and if a valid address for this check is set. The strategies missing one of theses parameters will be displayed bellow.'}</p>
						<p className={'block mt-4'}>{'Based on the Total Value Locked (TVL) in the strategy, a Risk score, from 5 (most risky) to 1 (least risky), is computed.'}</p>
					</div>
				</AlertBanner>
			</div>
			<div className={'flex flex-col-reverse mb-5 space-x-0 md:flex-row md:space-x-4'}>
				<div className={'flex flex-col mt-2 space-y-2 w-full md:mt-0'}>
					<SearchBox searchTerm={searchTerm} set_searchTerm={set_searchTerm} />
					<div className={'flex flex-row items-center'}>
						<p className={'text-xs text-typo-secondary'}>{`Strategies Found: ${filteredStrategies.length}`}</p>
					</div>
				</div>
				<div>
					<Card isNarrow>
						<label className={'flex flex-row justify-between p-2 space-x-6 w-full cursor-pointer md:p-0 md:w-max'}>
							<p className={'text-typo-primary'}>{'Hide vaults with no TVL'}</p>
							<Switch isEnabled={isOnlyWithTvl} set_isEnabled={set_isOnlyWithTvl} />
						</label>
					</Card>
				</div>
			</div>

			<div className={'flex flex-col pb-0 h-full'}>
				<RowHead sortBy={sortBy} set_sortBy={set_sortBy} />
				<SectionHealthcheckList sortBy={sortBy} strategies={filteredStrategies} />
			</div>
		</div>
	);
}

export default Index;
