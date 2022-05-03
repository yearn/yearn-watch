import	React, {ReactElement}						from	'react';
import	useWatch									from	'contexts/useWatch';
import	{TVault, TStrategy, TAlertLevels}			from	'contexts/useWatch.d';
import	{Card, SearchBox, Switch, Banner}			from	'@yearn/web-lib/components';
import	{AlertSelector}								from	'components/AlertSelector';
import	SectionAlertList							from	'components/sections/alerts/SectionAlertList';
import	{findVaultBySearch, findStrategyBySearch}	from	'utils/filters';

/* 🔵 - Yearn Finance **********************************************************
** Main render of the Alerts page
******************************************************************************/
function	Alerts(): ReactElement {
	const	{vaults} = useWatch();
	const	[filteredStrategies, set_filteredStrategies] = React.useState([] as (TStrategy | TVault)[]);
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[shouldDisplayDismissed, set_shouldDisplayDismissed] = React.useState(false);
	const	[alertFilter, set_alertFilter] = React.useState<TAlertLevels>('none');

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	** If shouldDisplayDismissed is false then only the strategies that are not
	** dismissed are displayed.
	**************************************************************************/
	React.useEffect((): void => {
		const	_vaults = vaults;
		const	_filteredVaults = [..._vaults];
		const	_filteredStrategies = [];

		for (const vault of _filteredVaults) {
			if ((vault?.alerts || []).length > 0) {
				if (findVaultBySearch(vault, searchTerm)) {
					if (alertFilter === 'none' || vault.alerts.some((alert): boolean => alert.level === alertFilter))
						_filteredStrategies.push(vault);
				}
			}
			for (const strategy of vault.strategies) {
				if ((strategy?.alerts || []).length > 0) {
					if (findStrategyBySearch(strategy, searchTerm)) {
						if (alertFilter === 'none' || strategy.alerts.some((alert): boolean => alert.level === alertFilter))
							_filteredStrategies.push(strategy);
					}
				}
			}
		}
		set_filteredStrategies(_filteredStrategies);
	}, [vaults, searchTerm, shouldDisplayDismissed, alertFilter]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex-col-full'}>
			<div className={'mb-4'}>
				<Banner title={'Alerts'}>
					<div>
						<p>{'The alert section is used to hightlight some potential issues. Issues are splitted in 3 categories: warning, error and critical. Alerts can be on the vault level or on the strategy level.'}</p>
						<p className={'block mt-4'}>{'You can dismiss non-revelant alerts safely, they will no longer be displayed in your browser unless some new alerts are triggered on this same element.'}</p>
					</div>
				</Banner>
			</div>
			<div className={'space-y-5 flex-col-full'}>
				<div className={'flex flex-col-reverse items-start space-x-0 md:flex-row md:space-x-4'}>
					<div className={'flex flex-col mt-2 space-y-2 w-full md:mt-0'}>
						<SearchBox
							searchTerm={searchTerm}
							onChange={set_searchTerm} />
						<div className={'flex-row-center'}>
							<p className={'text-xs text-typo-secondary'}>{`Search result: ${filteredStrategies.length}`}</p>
						</div>
					</div>
					<div className={'flex flex-row justify-between items-center space-x-2 md:justify-start md:space-x-4'}>
						<div>
							<Card padding={'narrow'}>
								<label className={'component--switchCard-wrapper'}>
									<p className={'text-sm md:text-base text-typo-secondary'}>{'Dismissed'}</p>
									<Switch isEnabled={shouldDisplayDismissed} onSwitch={set_shouldDisplayDismissed} />
								</label>
							</Card>
						</div>
						<div>
							<AlertSelector
								selectedLevel={alertFilter}
								onSelect={(s): void => set_alertFilter((c): TAlertLevels => c === s ? 'none' : s)} />
						</div>
					</div>
				</div>
				<div className={'flex-col-full'}>
					<SectionAlertList
						shouldDisplayDismissed={shouldDisplayDismissed}
						stratOrVault={filteredStrategies} />
				</div>
			</div>
		</div>
	);
}

export default Alerts;
