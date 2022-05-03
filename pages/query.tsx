import	React, {ReactElement}			from	'react';
import	{GetServerSideProps}			from	'next';
import	{useRouter}						from	'next/router';
import	{SearchBox}						from	'@yearn/web-lib/components';
import	{findStrategyBySearch}			from	'utils/filters';
import	useWatch						from	'contexts/useWatch';
import	{TStrategy, TRowHead}			from	'contexts/useWatch.d';
import	SectionQueryList				from	'components/sections/query/SectionQueryList';
import	{TableHead, TableHeadCell}		from	'components/TableHeadCell';

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
** Main render of the Query page
******************************************************************************/
function	Query(): ReactElement {
	const	router = useRouter();
	const	{vaults} = useWatch();
	const	[filteredStrategies, set_filteredStrategies] = React.useState([] as (TStrategy)[]);
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[sortBy, set_sortBy] = React.useState('risk');

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	** It also takes into account the router query arguments as additional
	** filters.
	**************************************************************************/
	React.useEffect((): void => {
		const	_vaults = vaults;
		const	_routerExcludeUnknown = (router?.query?.exclude || []);
		const	_routerExcludeArr = typeof(_routerExcludeUnknown) === 'string' ? [_routerExcludeUnknown] : _routerExcludeUnknown;
		const	excludeStrategies = (_routerExcludeArr as string[]).map((v): string => v.toLowerCase());
		const	_routerIncludeUnknown = (router?.query?.include || []);
		const	_routerIncludeArr = typeof(_routerIncludeUnknown) === 'string' ? [_routerIncludeUnknown] : _routerIncludeUnknown;
		const	includeStrategies = (_routerIncludeArr as string[]).map((v): string => v.toLowerCase());
		const	_filteredVaults = [..._vaults];

		const		_filteredStrategies = [];
		for (const vault of _filteredVaults) {
			for (const strategy of vault.strategies) {
				if (excludeStrategies.some((exclude): boolean => findStrategyBySearch(strategy, exclude))) {
					continue;
				}
				if (includeStrategies.some((include): boolean => findStrategyBySearch(strategy, include))) {
					_filteredStrategies.push(strategy);
				} else if (searchTerm !== '' && findStrategyBySearch(strategy, searchTerm)) {
					_filteredStrategies.push(strategy);
				}
			}
		}
		set_filteredStrategies(_filteredStrategies);
	}, [vaults, searchTerm, router.query]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex-col-full'}>
			<div className={'space-y-5 flex-col-full'}>
				<div className={'flex flex-col-reverse space-x-0 md:flex-row md:space-x-4'}>
					<div className={'flex flex-col mt-2 space-y-2 w-full md:mt-0'}>
						<SearchBox
							searchTerm={searchTerm}
							onChange={set_searchTerm} />
						<div className={'flex-row-center'}>
							<p className={'text-xs text-typo-secondary'}>{`Elements Found: ${filteredStrategies.length}`}</p>
						</div>
					</div>
				</div>

				<div className={'flex overflow-x-scroll pb-0 h-full'}>
					<div className={'flex flex-col w-[965px] h-full md:w-full'}>
						<RowHead sortBy={sortBy} set_sortBy={set_sortBy} />
						<SectionQueryList sortBy={sortBy} strategies={filteredStrategies} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Query;

// Used to directly fetch the query params
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps: GetServerSideProps = async (): Promise<any> => {
	return {props: {}};
};