import	React, {ReactElement}			from	'react';
import	{List}							from	'@yearn/web-lib/layouts';
import	{Card, SearchBox, Switch}		from	'@yearn/web-lib/components';
import	* as utils						from	'@yearn/web-lib/utils';
import	useWatch						from	'contexts/useWatch';
import	{TVault}						from	'contexts/useWatch.d';
import	useSettings						from	'contexts/useSettings';
import	VaultBox						from	'components/sections/vaults/VaultBox';
import	{deepFindVaultBySearch}			from	'utils/filters';

/* 🔵 - Yearn Finance **********************************************************
** Main render of the home page
******************************************************************************/
function	Index(): ReactElement {
	const	{vaults} = useWatch();
	const	settings = useSettings(); // eslint-disable-line @typescript-eslint/naming-convention
	const	[filteredVaults, set_filteredVaults] = React.useState<TVault[]>([]);
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

		//If the isOnlyWarning is checked, we only display the vaults with a warning
		if (isOnlyWarning) {
			_filteredVaults = _filteredVaults.filter((vault): boolean => (vault.alerts?.length || 0) > 0);
		}

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
				strategies: _filteredVaults.reduce((acc, vault): number => acc + ((vault.strategies.filter((strat): boolean => settings.shouldDisplayStratsInQueue ? strat.index !== 21 : true))?.length || 0), 0),
				notAllocated: notAllocated
			});
		});
	}, [vaults, searchTerm, isOnlyWarning, settings.shouldDisplayStratsInQueue, settings.shouldDisplayVaultNoStrats, settings.shouldOnlyDisplayEndorsedVaults, settings.shouldDisplayVaultsWithMigration]);

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
						{/* <p className={'text-xs text-typo-secondary'}>{`Not allocated: ~${utils.format.amount(searchResult.notAllocated, 2)} $`}</p> */}
					</div>
				</div>
				<div>
					<Card padding={'narrow'}>
						<label className={'component--switchCard-wrapper'}>
							<p>{'Only with warnings'}</p>
							<Switch isEnabled={isOnlyWarning} onSwitch={set_isOnlyWarning} />
						</label>
					</Card>
				</div>
				<div>
					<Card padding={'narrow'}>
						<label className={'component--switchCard-wrapper'}>
							<p>{'Only in queue'}</p>
							<Switch isEnabled={settings.shouldDisplayStratsInQueue} onSwitch={settings.switchShouldDisplayStratsInQueue} />
						</label>
					</Card>
				</div>
			</div>
			{filteredVaults ? (
				<List className={'flex flex-col space-y-2 w-full'}>
					{filteredVaults.map((vault): ReactElement => (
						<div key={vault.address}>
							<VaultBox vault={vault} isOnlyInQueue={settings.shouldDisplayStratsInQueue} />
						</div>
					))}
				</List>
			) : null}
		</div>
	);
}

export default Index;
