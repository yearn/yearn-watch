import	React, {ReactElement}			from	'react';
import	{GetServerSideProps}			from	'next';
import	useWatch						from	'contexts/useWatch';
import	{TStrategy}						from	'contexts/useWatch.d';
import	{useRouter}						from	'next/router';
import	{SearchBox}						from	'@majorfi/web-lib/components';
import	{findStrategyBySearch}			from	'utils/filters';
import	SectionQueryList				from	'components/sections/query/SectionQueryList';
import	{TableHead, TableHeadCell}		from	'components/TableHeadCell';

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
		const	excludeStrategies = ((router.query?.exclude || []) as string[]).map((v): string => v.toLowerCase());
		const	_filteredVaults = [..._vaults];
		let		_filteredStrategies = [];

		for (const vault of _filteredVaults) {
			for (const strategy of vault.strategies) {
				if (excludeStrategies.some((exclude): boolean => findStrategyBySearch(strategy, exclude))) {
					continue;
				}
				_filteredStrategies.push(strategy);
			}
		}
		_filteredStrategies = _filteredStrategies.filter((strategy): boolean => findStrategyBySearch(strategy, searchTerm || 'nothing'));

		set_filteredStrategies(_filteredStrategies);
	}, [vaults, searchTerm, router.query]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex flex-col w-full h-full'}>
			<div className={'flex flex-col space-y-4 w-full h-full'}>
				<div className={'flex flex-col-reverse space-x-0 md:flex-row md:space-x-4'}>
					<div className={'flex flex-col mt-2 space-y-2 w-full md:mt-0'}>
						<SearchBox
							searchTerm={searchTerm}
							onChange={set_searchTerm} />
						<div className={'flex flex-row items-center'}>
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

export default Index;

// Used to directly fetch the query params
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps: GetServerSideProps = async (): Promise<any> => {
	return {props: {}};
};