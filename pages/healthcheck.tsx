import	React, {ReactElement} 							from	'react';
import	{Card, Banner, Switch, SearchBox}				from	'@yearn-finance/web-lib/components';
import	* as utils										from	'@yearn-finance/web-lib/utils';
import	useWatch										from	'contexts/useWatch';
import	{TStrategy, TRowHead}							from	'contexts/useWatch.d';
import	useSettings										from	'contexts/useSettings';
import	{deepFindVaultBySearch, findStrategyBySearch}	from	'utils/filters';
import	SectionHealthcheckList							from	'components/sections/healthcheck/SectionHealthcheckList';
import	{TableHead, TableHeadCell}						from	'components/TableHeadCell';

/* 🔵 - Yearn Finance **********************************************************
** This will render the head of the fake table we have, with the sortable
** elements. This component asks for sortBy and set_sortBy in order to handle
** the chevron displays and to set the sort based on the user's choice.
******************************************************************************/
function	RowHead({sortBy, set_sortBy}: TRowHead): ReactElement {
	return (
		<TableHead sortBy={sortBy} set_sortBy={set_sortBy}>
			<TableHeadCell
				className={'cell-start min-w-32 col-span-8'}
				label={'Strategy'}
				sortId={'name'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-4'}
				label={'Total Value Locked'}
				sortId={'tvl'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-4'}
				label={'Debt Outstanding'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-3'}
				label={'Risk'}
				sortId={'risk'} />
		</TableHead>
	);
}

/* 🔵 - Yearn Finance **********************************************************
** Main render of the Healthcheck page
******************************************************************************/
function	Healthcheck(): ReactElement {
	const	{vaults} = useWatch();
	const	settings = useSettings(); // eslint-disable-line @typescript-eslint/naming-convention
	const	[filteredStrategies, set_filteredStrategies] = React.useState([] as TStrategy[]);
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[isOnlyWithTvl, set_isOnlyWithTvl] = React.useState(true);
	const	[sortBy, set_sortBy] = React.useState('risk');

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	** Displayed strategies will be the one matching one of the following
	** conditions:
	** - ShouldDoHealthCheck is false
	** - Healtchecker address is invalid
	** - TVL is not 0 (can be forced with the isOnlyWithTVL variable)
	**************************************************************************/
	React.useEffect((): void => {
		const	_vaults = vaults;
		let		_filteredVaults = [..._vaults];
		const	_filteredStrategies = [];

		//If the shouldOnlyDisplayEndorsedVaults is checked, we only display the endorsed vaults (by the API)
		if (settings.shouldOnlyDisplayEndorsedVaults) {
			_filteredVaults = _filteredVaults.filter((vault): boolean => vault.isEndorsed);
		}

		//If the shouldDisplayVaultsWithMigration is checked, we also display the vaults with a migration
		if (!settings.shouldDisplayVaultsWithMigration) {
			_filteredVaults = _filteredVaults.filter((vault): boolean => !vault.hasMigration);
		}

		//If the shouldDisplayVaultNoStrats is checked, we to hide all vaults with 0 strategies or none in withdrawal queue
		if (!settings.shouldDisplayVaultNoStrats) {
			_filteredVaults = _filteredVaults.filter((vault): boolean => (
				vault.strategies.length > 0
				&& !vault.strategies.every((strat): boolean => strat.index === 21)
			));
		}

		_filteredVaults = _filteredVaults.filter((vault): boolean => deepFindVaultBySearch(vault, searchTerm));
		_filteredVaults = _filteredVaults.sort((a, b): number => Number(b.version.replace('.', '')) - Number(a.version.replace('.', '')));
		for (const vault of _filteredVaults) {
			let	_strategies = vault.strategies.filter((strat): boolean => strat.shouldDoHealthCheck);
			_strategies = _strategies.filter((strat): boolean => findStrategyBySearch(strat, searchTerm));

			for (const strategy of vault.strategies) {
				const	shouldDoHealtcheck = strategy.shouldDoHealthCheck;
				const	hasValidHealtcheckAddr = !utils.isZeroAddress(strategy.addrHealthCheck);

				if (shouldDoHealtcheck || hasValidHealtcheckAddr || (strategy?.totalDebt.isZero() && isOnlyWithTvl))
					continue;
				_filteredStrategies.push(strategy);
			}
		}
		set_filteredStrategies(_filteredStrategies);
	}, [vaults, searchTerm, isOnlyWithTvl, settings.shouldOnlyDisplayEndorsedVaults, settings.shouldDisplayVaultsWithMigration, settings.shouldDisplayVaultNoStrats]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex-col-full'}>
			<div className={'mb-4'}>
				<Banner title={'Healthchecks'}>
					<div>
						<p>{'The healthchecks have been added since v0.4.2 for the Yearn\'s strategies in order to ensure that they are working properly. The healthchecks are automatically triggered on harvest if the doHealthCheck parameter is enabled, and if a valid address for this check is set. The strategies missing one of theses parameters will be displayed bellow.'}</p>
						<p className={'mt-4 block'}>{'Based on the Total Value Locked (TVL) in the strategy, a Risk score, from 5 (most risky) to 1 (least risky), is computed.'}</p>
					</div>
				</Banner>
			</div>
			<div className={'mb-5 flex flex-col-reverse space-x-0 md:flex-row md:space-x-4'}>
				<div className={'mt-2 flex w-full flex-col space-y-2 md:mt-0'}>
					<SearchBox
						searchTerm={searchTerm}
						onChange={set_searchTerm} />
					<div className={'flex-row-center'}>
						<p className={'text-xs text-neutral-500'}>{`Strategies Found: ${filteredStrategies.length}`}</p>
					</div>
				</div>
				<div>
					<Card padding={'narrow'}>
						<label className={'component--switchCard-wrapper'}>
							<p>{'Hide vaults with no TVL'}</p>
							<Switch isEnabled={isOnlyWithTvl} onSwitch={set_isOnlyWithTvl} />
						</label>
					</Card>
				</div>
			</div>

			<div className={'flex h-full overflow-x-scroll pb-0'}>
				<div className={'flex h-full w-[965px] flex-col md:w-full'}>
					<RowHead sortBy={sortBy} set_sortBy={set_sortBy} />
					<SectionHealthcheckList sortBy={sortBy} strategies={filteredStrategies} />
				</div>
			</div>
		</div>
	);
}

export default Healthcheck;
