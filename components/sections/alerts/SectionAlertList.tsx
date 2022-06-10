import	React, {ReactElement}									from	'react';
import	Image													from	'next/image';
import	{List}													from	'@yearn-finance/web-lib/layouts';
import	{Card, AddressWithActions, AlertBox, Button}			from	'@yearn-finance/web-lib/components';
import	{useLocalStorage}										from	'@yearn-finance/web-lib/hooks';
import	{performBatchedUpdates}									from	'@yearn-finance/web-lib/utils';
import	{ArrowDown, AlertCritical, AlertError, AlertWarning}	from	'@yearn-finance/web-lib/icons';
import	{TVault, TStrategy}										from	'contexts/useWatch.d';
import	{PageController}										from	'components/PageController';

type	TSectionAlertList = {
	stratOrVault: (TStrategy | TVault)[],
	shouldDisplayDismissed: boolean
};
type	TStorageDismissed = [string[], (s: string[]) => string[]];
const	SectionAlertList = React.memo(function SectionAlertList({stratOrVault, shouldDisplayDismissed}: TSectionAlertList): ReactElement {
	const	[sortBy, set_sortBy] = React.useState('');
	const	[pageIndex, set_pageIndex] = React.useState(0);
	const	[amountToDisplay] = React.useState(20);
	const	[sortedStratOrVault, set_sortedStratOrVault] = React.useState([] as (TStrategy | TVault)[]);
	const	[dismissed, set_dismissed] = useLocalStorage('dismissedAlerts', []) as TStorageDismissed;
	
	/* 🔵 - Yearn Finance ******************************************************
	** This effect is used to display the alerts based on the level filter.
	** The easy win for this part is to split the alerts in 3 differents array
	** and then to merge them with the right order.
	**************************************************************************/
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

		performBatchedUpdates((): void => {
			if (sortBy === 'level')
				set_sortedStratOrVault([..._criticals, ..._errors, ..._warnings]);
			else if (sortBy === '-level')
				set_sortedStratOrVault([..._warnings, ..._errors, ..._criticals]);
			else 
				set_sortedStratOrVault(_default);
			set_pageIndex(0);
		});
	}, [stratOrVault, sortBy, dismissed, shouldDisplayDismissed]);

	/* 🔵 - Yearn Finance ******************************************************
	** The alerts can be dismissed or tracked, aka ignored or displayed. A
	** specific toggle allows us to switch the view for this. Non-dismissed
	** alers will be dismissed, and dismissed ones will be tracked.
	**************************************************************************/
	function	onDismissOrTrack(s: string): void {
		if (dismissed.includes(s))
			set_dismissed(dismissed.filter((_s: string): boolean => _s !== s));
		else
			set_dismissed([...new Set([...dismissed, s])]);
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Render the Head of our fake table. This head will display the topic for
	** each column and allow us to sort the alerts by level.
	**************************************************************************/
	function	renderTableHead(): ReactElement {
		return (
			<div className={'flex flex-row justify-between items-center px-6 pb-2 w-max'}>
				<div className={'w-[300px] flex-row-start'}>
					<p className={'text-typo-secondary'}>{'Vault'}</p>
				</div>
				<div className={'w-[300px] flex-row-start'}>
					<p className={'text-typo-secondary'}>{'Strategy'}</p>
				</div>
				<div className={'w-[125px] whitespace-nowrap flex-row-center'}>
					<p className={'text-typo-secondary'}>{'Level'}</p>
					<ArrowDown
						onClick={(): void => set_sortBy(sortBy === 'level' ? '-level' : sortBy === '-level' ? '' : 'level')}
						className={`ml-1 w-4 h-4 hover:text-icons-variant transition-all cursor-pointer ${sortBy.includes('level') ? 'text-icon-variant' : 'text-icons-primary'} ${sortBy === '-level' ? 'rotate-180' : 'rotate-0'}`} />
				</div>
			</div>
		);
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Render the current level of the alert. The displayed level matches the
	** highest level of the alerts (critical -> error -> warning).
	**************************************************************************/
	function	renderAlertLevel(stratOrVault: TStrategy | TVault): ReactElement {
		if (stratOrVault.alerts.some((alert): boolean => alert.level === 'critical')) {
			return (
				<div className={'flex absolute top-0 right-0 flex-row items-center md:relative'}>
					<AlertCritical className={'mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5 text-alert-critical-primary'} />
					<p className={'text-alert-error-primary'}>{'Error'}</p>
				</div>
			);
		}
		if (stratOrVault.alerts.some((alert): boolean => alert.level === 'error')) {
			return (
				<div className={'flex absolute top-0 right-0 flex-row items-center md:relative'}>
					<AlertError className={'mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5 text-alert-error-primary'} />
					<p className={'text-alert-error-primary'}>{'Error'}</p>
				</div>
			);
		}
		return (
			<div className={'flex absolute top-0 right-0 flex-row items-center md:relative'}>
				<AlertWarning className={'mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5 text-alert-warning-primary'} />
				<p className={'text-alert-warning-primary'}>{'Warning'}</p>
			</div>
		);
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Render the first half of the Summary component. Based on if the data is
	** a Vault or a Strategy, the elements are displayed differently.
	**************************************************************************/
	function	renderSummaryStart(stratOrVault: TStrategy | TVault): ReactElement {
		if ((stratOrVault as TStrategy)?.vault) {
			stratOrVault = stratOrVault as TStrategy;
			return (
				<div className={'flex relative flex-col justify-between items-center w-full md:flex-row md:w-max'}>
					<div className={'w-full md:w-[300px] flex-row-start'}>
						{stratOrVault.vault?.icon ? <Image
							alt={`token ${stratOrVault.vault?.name}`}
							decoding={'async'}
							width={40}
							height={40}
							src={stratOrVault.vault?.icon}
							quality={70} /> : <div className={'w-10 min-w-[40px] h-10 min-h-[40px] rounded-full bg-background'} />}
						<div className={'ml-2 md:ml-6'}>
							<b>{stratOrVault.vault?.name}</b>
							<AddressWithActions
								address={stratOrVault.vault.address}
								explorer={stratOrVault.vault.explorer}
								wrapperClassName={'flex'}
								className={'font-mono text-xs text-typo-secondary'} />
						</div>
					</div>
					<div className={'my-4 w-full md:my-0 md:w-[300px] flex-row-start'}>
						<div className={'flex mr-2 w-10 md:hidden'}/>
						<div>
							<b>{stratOrVault.display_name}</b>
							<AddressWithActions
								address={stratOrVault.address}
								explorer={stratOrVault.vault.explorer}
								wrapperClassName={'flex'}
								className={'font-mono text-xs text-typo-secondary'} />
						</div>
					</div>
					{renderAlertLevel(stratOrVault)}
				</div>
			);
		} else {
			stratOrVault = stratOrVault as TVault;
			return (
				<div className={'flex relative flex-col justify-between items-center w-full md:flex-row md:w-max'}>
					<div className={'w-full md:w-[300px] flex-row-start'}>
						{stratOrVault.icon ? <Image
							alt={`token ${stratOrVault.name}`}
							decoding={'async'}
							width={40}
							height={40}
							src={stratOrVault.icon}
							quality={70} /> : <div className={'w-10 min-w-[40px] h-10 min-h-[40px] rounded-full bg-background'} />}
						<div className={'ml-2 md:ml-6'}>
							<b>{stratOrVault.name}</b>
							<AddressWithActions
								address={stratOrVault.address}
								explorer={stratOrVault.explorer}
								wrapperClassName={'flex'}
								className={'font-mono text-xs text-typo-secondary'} />
						</div>
					</div>
					<div className={'hidden flex-row items-start w-full md:flex md:w-[300px]'}>
						<div>
							<b>{'-'}</b>
						</div>
					</div>
					{renderAlertLevel(stratOrVault)}
				</div>
			);
		}
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Render the second half of the Summary component. Based on if the data is
	** a Vault or a Strategy, the elements are displayed differently.
	**************************************************************************/
	function	renderSummaryEnd(stratOrVault: TStrategy | TVault): ReactElement {
		return (
			<div className={'flex flex-row justify-start items-center w-full md:justify-end'}>
				<div className={'text-sm font-medium text-right whitespace-nowrap sm:pr-6'}>
					<div>
						<Button
							variant={'outlined'}
							shouldStopPropagation
							onClick={(): void => onDismissOrTrack(stratOrVault.alertHash)}
							className={'ml-0 min-w-[132px] md:ml-6'}>
							{dismissed.includes(stratOrVault.alertHash) ? 'Track' : 'Dismiss'}
						</Button>
					</div>
				</div>
			</div>
		);
	}

	function	rowRenderer(index: number): ReactElement {
		const stratOrVault = sortedStratOrVault[index];
		return (
			<div key={index} className={'mb-2'}>
				<Card.Detail
					key={stratOrVault.address}
					isSticky={false}
					summary={(p: unknown[]): ReactElement => (
						<Card.Detail.Summary
							startChildren={renderSummaryStart(stratOrVault)}
							endChildren={renderSummaryEnd(stratOrVault)}
							{...p} />
					)}>
					<div className={'space-y-2'}>
						<AlertBox
							level={'critical'}
							alerts={(
								stratOrVault.alerts
									.filter((a): unknown => a.level === 'critical')
									.map((e): string => e.message)
							)} />
						<AlertBox
							level={'error'}
							alerts={(
								stratOrVault.alerts
									.filter((a): unknown => a.level === 'error')
									.map((e): string => e.message)
							)} />
						<AlertBox
							level={'warning'}
							alerts={(
								stratOrVault.alerts
									.filter((a): unknown => a.level === 'warning')
									.map((e): string => e.message)
							)} />
					</div>
				</Card.Detail>
			</div>
		);
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the section
	**************************************************************************/
	return (
		<>
			<div className={'hidden md:block'}>
				{renderTableHead()}
			</div>
			<section
				aria-label={'strats-vaults-alerts-list'}
				className={'min-w-full h-full'}>
				<List>
					{sortedStratOrVault.slice(pageIndex, pageIndex + amountToDisplay).map((_, index): ReactElement => rowRenderer(
						index + pageIndex
					))}
				</List>
				<div className={'flex flex-row justify-end items-center'}>
					<PageController
						pageIndex={pageIndex}
						pageLen={sortedStratOrVault.length}
						amountToDisplay={amountToDisplay}
						nextPage={(): void => set_pageIndex(pageIndex + amountToDisplay)}
						previousPage={(): void => set_pageIndex(
							pageIndex - amountToDisplay >= 0 ? pageIndex - amountToDisplay : 0
						)} />
				</div>
			</section>
		</>
	);
});

export default SectionAlertList;