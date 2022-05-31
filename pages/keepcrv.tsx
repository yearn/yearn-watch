import	React, {ReactElement} 					from	'react';
import	useWatch								from	'contexts/useWatch';
import	{TStrategy, TRowHead}					from	'contexts/useWatch.d';
import	{Card, Banner, Switch, SearchBox}		from	'@yearn/web-lib/components';
import	{deepFindVaultBySearch}					from	'utils/filters';
import	SectionHealthcheckList					from	'components/sections/healthcheck/SectionHealthcheckList';
import	{TableHead, TableHeadCell}				from	'components/TableHeadCell';

/* 🔵 - Yearn Finance **********************************************************
** This will render the head of the fake table we have, with the sortable
** elements. This component asks for sortBy and set_sortBy in order to handle
** the chevron displays and to set the sort based on the user's choice.
******************************************************************************/
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

/* 🔵 - Yearn Finance **********************************************************
** Main render of the Healthcheck page
******************************************************************************/
function	Healthcheck(): ReactElement {
	const	{vaults} = useWatch();
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

		_filteredVaults = _filteredVaults.filter((vault): boolean => deepFindVaultBySearch(vault, searchTerm));

		for (const vault of _filteredVaults) {
			for (const strategy of vault.strategies) {
				const	shouldKeepCRV = strategy.shouldKeepCRV;

				if (!shouldKeepCRV || (strategy?.totalDebt.isZero() && isOnlyWithTvl))
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
		<div className={'flex-col-full'}>
			<div className={'mb-4'}>
				<Banner title={'Keep CRV'}>
					<div>
						<p>{'The KeepCRV is a specific fiels for the strategies.'}</p>
						<p className={'block mt-4'}>{'Based on the Total Value Locked (TVL) in the strategy, a Risk score, from 5 (most risky) to 1 (least risky), is computed.'}</p>
					</div>
				</Banner>
			</div>
			<div className={'flex flex-col-reverse mb-5 space-x-0 md:flex-row md:space-x-4'}>
				<div className={'flex flex-col mt-2 space-y-2 w-full md:mt-0'}>
					<SearchBox
						searchTerm={searchTerm}
						onChange={set_searchTerm} />
					<div className={'flex-row-center'}>
						<p className={'text-xs text-typo-secondary'}>{`Strategies Found: ${filteredStrategies.length}`}</p>
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

			<div className={'flex overflow-x-scroll pb-0 h-full'}>
				<div className={'flex flex-col w-[965px] h-full md:w-full'}>
					<RowHead sortBy={sortBy} set_sortBy={set_sortBy} />
					<SectionHealthcheckList sortBy={sortBy} strategies={filteredStrategies} />
				</div>
			</div>
		</div>
	);
}

export default Healthcheck;
