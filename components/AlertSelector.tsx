import	React, {ReactElement}						from	'react';
import	{AlertWarning, AlertError, AlertCritical}	from	'@yearn-finance/web-lib/icons';
import	{TAlertLevels}								from	'contexts/useWatch.d';

type		TAlertSelector = {
	selectedLevel: TAlertLevels,
	onSelect: (s: TAlertLevels) => void
}

/* 🔵 - Yearn Finance **********************************************************
** The AlertSelector component is a simple component that allows the user to
** select the level of alerts to display on the /alerts page.
** The params are used to display and change the selected alert level.
******************************************************************************/
function	AlertSelector({selectedLevel, onSelect}: TAlertSelector): ReactElement {
	const	defaultClassName = 'border-transparent bg-neutral-0';
	const	warningClassName = 'border-yellow-900 bg-yellow-300 hover:bg-yellow-200';
	const	errorClassName = 'border-pink-900 bg-pink-300 hover:bg-pink-200';
	const	criticalClassName = 'border-red-900 bg-red-300 hover:bg-red-200';

	return (
		<div className={'component--alertSelector-wrapper'}>
			<div
				onClick={(): void => onSelect('warning')}
				className={`component--alertSelector-base ${selectedLevel === 'warning' ? warningClassName : defaultClassName}`}>
				<AlertWarning className={'h-6 w-6 text-yellow-900'} />
			</div>
			<div
				onClick={(): void => onSelect('error')}
				className={`component--alertSelector-base ${selectedLevel === 'error' ? errorClassName : defaultClassName}`}>
				<AlertError className={'h-6 w-6 text-pink-900'} />
			</div>
			<div
				onClick={(): void => onSelect('critical')}
				className={`component--alertSelector-base ${selectedLevel === 'critical' ? criticalClassName : defaultClassName}`}>
				<AlertCritical className={'h-6 w-6 text-red-900'} />
			</div>
		</div>
	);
}

export {AlertSelector};
export type {TAlertLevels};