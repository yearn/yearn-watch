import	React, {ReactElement}			from	'react';
import	{List}							from	'@majorfi/web-lib/layouts';
import	{Card, SearchBox, Switch}		from	'@majorfi/web-lib/components';
import	* as utils						from	'@majorfi/web-lib/utils';
import	useWatch						from	'contexts/useWatch';
import	VaultBox						from	'components/sections/vaults/VaultBox';
import	{deepFindVaultBySearch}			from	'utils/filters';

/* 🔵 - Yearn Finance **********************************************************
** Main render of the home page
******************************************************************************/
function	Index(): ReactElement {
	const	{vaults} = useWatch();
	const	[filteredVaults, set_filteredVaults] = React.useState(vaults);
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[isOnlyWarning, set_isOnlyWarning] = React.useState(false);
	const	[searchResult, set_searchResult] = React.useState({vaults: 0, strategies: 0, notAllocated: 0});

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	**************************************************************************/
	React.useEffect((): void => {
		const	_vaults = vaults;
		let		_filteredVaults = [..._vaults];

		if (isOnlyWarning) {
			_filteredVaults = _filteredVaults.filter((vault): boolean => (vault.alerts?.length || 0) > 0);
		}
		_filteredVaults = _filteredVaults.filter((vault): boolean => deepFindVaultBySearch(vault, searchTerm));
		utils.performBatchedUpdates((): void => {
			let	notAllocated = 0;
			for (const vault of _filteredVaults) {
				const reduceSum = vault.strategies.reduce((acc, _strategy): number => (
					acc += Number(_strategy.totalDebtUSDC)
				), 0);
				const	totalAssetsUSDC = Number(utils.format.units((vault?.balanceTokens) || 0, vault?.decimals || 18)) * vault.tokenPriceUSDC;

				notAllocated += (totalAssetsUSDC - reduceSum);
			}
			set_filteredVaults(_filteredVaults);
			set_searchResult({
				vaults: _filteredVaults.length,
				strategies: _filteredVaults.reduce((acc, vault): number => acc + (vault?.strategies?.length || 0), 0),
				notAllocated: notAllocated
			});
		});
	}, [vaults, searchTerm, isOnlyWarning]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'w-full'}>
			<div className={'flex flex-col-reverse mb-5 space-x-0 md:flex-row md:space-x-4'}>
				<div className={'flex flex-col mt-2 space-y-2 w-full md:mt-0'}>
					<SearchBox
						searchTerm={searchTerm}
						onChange={set_searchTerm} />
					<div className={'flex-row-center'}>
						<p className={'mr-4 text-xs md:mr-10 text-typo-secondary'}>{`Vaults Found: ${searchResult.vaults}`}</p>
						<p className={'mr-4 text-xs md:mr-10 text-typo-secondary'}>{`Strategies Found: ${searchResult.strategies}`}</p>
						<p className={'text-xs text-typo-secondary'}>{`Not allocated: ~${utils.format.amount(searchResult.notAllocated, 2)} $`}</p>
					</div>
				</div>
				<div>
					<Card isNarrow>
						<label className={'component--switchCard-wrapper'}>
							<p>{'Only vaults with warnings'}</p>
							<Switch isEnabled={isOnlyWarning} set_isEnabled={set_isOnlyWarning} />
						</label>
					</Card>
				</div>
			</div>
			<List.Animated className={'flex flex-col space-y-4 w-full'}>
				{filteredVaults.map((vault): ReactElement => (
					<div key={vault.address}>
						<VaultBox vault={vault} />
					</div>
				))}
			</List.Animated>
		</div>
	);
}

export default Index;
