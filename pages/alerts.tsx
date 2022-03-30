import	React, {MouseEvent, ReactElement}						from	'react';
import	Image													from	'next/image';
import	useWatch, {TVault, TStrategy}							from	'contexts/useWatch';
import	{Card, AddressWithActions, SearchBox, Switch, AlertBox}	from	'@majorfi/web-lib/components';
import	{ArrowDown, AlertCritical, AlertError, AlertWarning}	from	'@majorfi/web-lib/icons';
import	{useLocalStorage}										from	'@majorfi/web-lib/hooks';

type		TTable = {
	stratOrVault: (TStrategy | TVault)[],
	shouldDisplayDismissed: boolean
};
function	Table({stratOrVault, shouldDisplayDismissed}: TTable): ReactElement {
	const	[sortBy, set_sortBy] = React.useState('');
	const	[sortedStratOrVault, set_sortedStratOrVault] = React.useState([] as (TStrategy | TVault)[]);
	const	[dismissed, set_dismissed] = useLocalStorage('dismissedAlerts', []) as [string[], (s: string[]) => void];
	
	React.useEffect((): void => {
		const	_default = [] as (TStrategy | TVault)[];
		const	_criticals = [] as (TStrategy | TVault)[];
		const	_errors = [] as (TStrategy | TVault)[];
		const	_warnings = [] as (TStrategy | TVault)[];
		for (const _stratOrVault of stratOrVault) {
			if (dismissed.length > 0 && !shouldDisplayDismissed && dismissed.includes(_stratOrVault.alertHash))
				continue;
			if (_stratOrVault.alerts.some((alert): boolean => alert.level === 'critical'))
				_criticals.push(_stratOrVault);
			else if (_stratOrVault.alerts.some((alert): boolean => alert.level === 'error'))
				_errors.push(_stratOrVault);
			else if (_stratOrVault.alerts.some((alert): boolean => alert.level === 'warning'))
				_warnings.push(_stratOrVault);
			_default.push(_stratOrVault);
		}
		if (sortBy === 'level')
			set_sortedStratOrVault([..._criticals, ..._errors, ..._warnings]);
		else if (sortBy === '-level')
			set_sortedStratOrVault([..._warnings, ..._errors, ..._criticals]);
		else 
			set_sortedStratOrVault(_default);
	}, [stratOrVault, sortBy, dismissed, shouldDisplayDismissed]);

	function	onDismissOrTrack(s: string): void {
		if (dismissed.includes(s))
			set_dismissed(dismissed.filter((_s): boolean => _s !== s));
		else
			set_dismissed([...new Set([...dismissed, s])]);
	}

	function	renderTableHead(): ReactElement {
		return (
			<div className={'flex flex-row justify-between items-center px-6 pb-2 w-max'}>
				<div className={'flex flex-row items-start w-[300px]'}>
					<p className={'text-typo-secondary-variant'}>{'Vault'}</p>
				</div>
				<div className={'flex flex-row items-start w-[300px]'}>
					<p className={'text-typo-secondary-variant'}>{'Strategy'}</p>
				</div>
				<div className={'flex flex-row items-center w-[125px] whitespace-nowrap'}>
					<p className={'text-typo-secondary-variant'}>{'Level'}</p>
					<ArrowDown
						onClick={(): void => set_sortBy(sortBy === 'level' ? '-level' : sortBy === '-level' ? '' : 'level')}
						className={`ml-1 w-4 h-4 hover:text-icons-variant transition-all cursor-pointer ${sortBy.includes('level') ? 'text-icon-variant' : 'text-icons-primary'} ${sortBy === '-level' ? 'rotate-180' : 'rotate-0'}`} />
				</div>
			</div>
		);
	}
	function	renderAlertLevel(stratOrVault: TStrategy | TVault): ReactElement {
		if (stratOrVault.alerts.some((alert): boolean => alert.level === 'critical')) {
			return (
				<div className={'w-[125px] text-sm whitespace-nowrap'}>
					<div className={'flex flex-row items-center'}>
						<AlertCritical className={'mr-2 w-5 h-5 text-alert-critical-primary'} />
						<p className={'text-alert-error-primary'}>{'Error'}</p>
					</div>
				</div>
			);
		}
		if (stratOrVault.alerts.some((alert): boolean => alert.level === 'error')) {
			return (
				<div className={'w-[125px] text-sm whitespace-nowrap'}>
					<div className={'flex flex-row items-center'}>
						<AlertError className={'mr-2 w-5 h-5 text-alert-error-primary'} />
						<p className={'text-alert-error-primary'}>{'Error'}</p>
					</div>
				</div>
			);
		}
		return (
			<div className={'w-[125px] text-sm whitespace-nowrap'}>
				<div className={'flex flex-row items-center'}>
					<AlertWarning className={'mr-2 w-5 h-5 text-alert-warning-primary'} />
					<p className={'text-alert-warning-primary'}>{'Warning'}</p>
				</div>
			</div>
		);
	}
	function	renderSummaryStart(stratOrVault: TStrategy | TVault): ReactElement {
		if ((stratOrVault as TStrategy)?.vault) {
			stratOrVault = stratOrVault as TStrategy;
			return (
				<div className={'flex flex-row justify-between items-center w-max'}>
					<div className={'flex flex-row items-start w-[300px]'}>
						<Image width={40} height={40} src={stratOrVault.vault?.icon} quality={90} />
						<div className={'ml-2 md:ml-6'}>
							<b className={'text-base text-typo-primary'}>{stratOrVault.vault?.name}</b>
							<AddressWithActions
								address={stratOrVault.vault.address}
								explorer={stratOrVault.vault.explorer}
								wrapperClassName={'hidden md:flex'}
								className={'font-mono text-xs text-typo-secondary'} />
						</div>
					</div>
					<div className={'flex flex-row items-start w-[300px]'}>
						<div>
							<b className={'text-base text-typo-primary'}>{stratOrVault.display_name}</b>
							<AddressWithActions
								address={stratOrVault.address}
								explorer={stratOrVault.vault.explorer}
								wrapperClassName={'hidden md:flex'}
								className={'font-mono text-xs text-typo-secondary'} />
						</div>
					</div>
					{renderAlertLevel(stratOrVault)}
				</div>
			);
		} else {
			stratOrVault = stratOrVault as TVault;
			return (
				<div className={'flex flex-row justify-between items-center w-max'}>
					<div className={'flex flex-row items-start w-[300px]'}>
						<Image width={40} height={40} src={stratOrVault.icon} quality={90} />
						<div className={'ml-2 md:ml-6'}>
							<b className={'text-base text-typo-primary'}>{stratOrVault.name}</b>
							<AddressWithActions
								address={stratOrVault.address}
								explorer={stratOrVault.explorer}
								wrapperClassName={'hidden md:flex'}
								className={'font-mono text-xs text-typo-secondary'} />
						</div>
					</div>
					<div className={'flex flex-row items-start w-[300px]'}>
						<div>
							<b className={'text-base text-typo-primary'}>{'-'}</b>
						</div>
					</div>
					{renderAlertLevel(stratOrVault)}
				</div>
			);
		}
	}
	function	renderSummaryEnd(stratOrVault: TStrategy | TVault): ReactElement {
		if ((stratOrVault as TStrategy)?.vault) {
			stratOrVault = stratOrVault as TStrategy;
			return (
				<div className={'flex flex-row justify-start items-center w-full md:justify-end'}>
					<div className={'pr-4 pl-3 text-sm font-medium text-right whitespace-nowrap sm:pr-6'}>
						<div onClick={(e: MouseEvent): void => e.stopPropagation()}>
							<button
								onClick={(e): void => {
									e.stopPropagation();
									onDismissOrTrack(stratOrVault.alertHash);
								}}
								className={'ml-0 min-w-[132px] md:ml-6 button button-outline'}>
								{dismissed.includes(stratOrVault.alertHash) ? 'Track' : 'Dismiss'}
							</button>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className={'flex flex-row justify-start items-center w-full md:justify-end'}>
					<div className={'pr-4 pl-3 text-sm font-medium text-right whitespace-nowrap sm:pr-6'}>
						<div onClick={(e: MouseEvent): void => e.stopPropagation()}>
							<button
								onClick={(e): void => {
									e.stopPropagation();
									onDismissOrTrack(stratOrVault.alertHash);
								}}
								className={'ml-0 min-w-[132px] md:ml-6 button button-outline'}>
								{dismissed.includes(stratOrVault.alertHash) ? 'Track' : 'Dismiss'}
							</button>
						</div>
					</div>
				</div>
			);
		}
	}

	return (
		<section className={'min-w-full'}>
			{renderTableHead()}
			<Card.List className={'space-y-2'}>
				{sortedStratOrVault.map((stratOrVault): ReactElement => (
					<div key={stratOrVault.address}>
						<Card.Detail
							key={stratOrVault.address}
							backgroundColor={'bg-surface'}
							isSticky={false}
							summary={(p: unknown): ReactElement => (
								<Card.Detail.Summary
									startChildren={renderSummaryStart(stratOrVault)}
									endChildren={renderSummaryEnd(stratOrVault)}
									{...p} />
							)}>
							<div className={'space-y-2'}>
								<AlertBox level={'critical'} alerts={stratOrVault.alerts.filter((a): unknown => a.level === 'critical')} />
								<AlertBox level={'error'} alerts={stratOrVault.alerts.filter((a): unknown => a.level === 'error')} />
								<AlertBox level={'warning'} alerts={stratOrVault.alerts.filter((a): unknown => a.level === 'warning')} />
							</div>
						</Card.Detail>
					</div>
				))}
			</Card.List>
		</section>
	);
}

function	Index(): ReactElement {
	const	{vaults} = useWatch();
	const	[filteredStrategies, set_filteredStrategies] = React.useState([] as (TStrategy | TVault)[]);
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[shouldDisplayDismissed, set_shouldDisplayDismissed] = React.useState(false);

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	** If shouldDisplayDismissed is false then only the strategies that are not
	** dismissed are displayed.
	**************************************************************************/
	React.useEffect((): void => {
		const	_vaults = vaults;
		let		_filteredVaults = [..._vaults];
		const	_filteredStrategies = [];

		if (searchTerm.length > 0) {
			_filteredVaults = _filteredVaults.filter((vault): boolean => {
				return (
					(vault?.display_name || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.symbol || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.token?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.token?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.token?.display_name || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.strategies || []).some((strategy): boolean => {
						return (
							(strategy?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
							|| (strategy?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
							|| (strategy?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
						);
					})
				);
			});
		}

		for (const vault of _filteredVaults) {
			if ((vault?.alerts || []).length > 0)
				_filteredStrategies.push(vault);
			for (const strategy of vault.strategies) {
				if ((strategy?.alerts || []).length > 0)
					_filteredStrategies.push(strategy);
			}
		}
		set_filteredStrategies(_filteredStrategies);
	}, [vaults, searchTerm, shouldDisplayDismissed]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'w-full'}>
			<div className={'flex flex-col p-6 mb-4 rounded-lg border-2 text-primary bg-secondary border-primary'}>
				<h4 className={'mb-6 text-primary'}>{'Alerts and warnings'}</h4>
				<p>{'Vaults and strategies evolve with the opportunities. Thus, some of they could have point of attention emerging with some time, like a deprecaded strategy with still some TVL, a hight risk with no healthcheck etc.'}</p>
				<p className={'block mt-4'}>{'This page is used to display all of theses warnings to whom it may concern.'}</p>
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
							<p className={'text-typo-primary'}>{'Display dismissed'}</p>
							<Switch isEnabled={shouldDisplayDismissed} set_isEnabled={set_shouldDisplayDismissed} />
						</label>
					</Card>
				</div>
			</div>
			<div className={'flex flex-col space-y-4 w-full'}>
				<Table
					shouldDisplayDismissed={shouldDisplayDismissed}
					stratOrVault={filteredStrategies} />
			</div>
		</div>
	);
}

export default Index;
