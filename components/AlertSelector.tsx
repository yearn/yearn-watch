import	React, {ReactElement}						from	'react';
import	{AlertWarning, AlertError, AlertCritical}	from	'@yearn/web-lib/icons';
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
	const	defaultClassName = 'border-transparent bg-surface';
	const	warningClassName = 'border-alert-warning-primary bg-alert-warning-secondary hover:bg-alert-warning-secondary-variant';
	const	errorClassName = 'border-alert-error-primary bg-alert-error-secondary hover:bg-alert-error-secondary-variant';
	const	criticalClassName = 'border-alert-critical-primary bg-alert-critical-secondary hover:bg-alert-critical-secondary-variant';

	return (
		<div className={'component--alertSelector-wrapper'}>
			<div
				onClick={(): void => onSelect('warning')}
				className={`component--alertSelector-base ${selectedLevel === 'warning' ? warningClassName : defaultClassName}`}>
				<AlertWarning className={'w-6 h-6 text-alert-warning-primary'} />
			</div>
			<div
				onClick={(): void => onSelect('error')}
				className={`component--alertSelector-base ${selectedLevel === 'error' ? errorClassName : defaultClassName}`}>
				<AlertError className={'w-6 h-6 text-alert-error-primary'} />
			</div>
			<div
				onClick={(): void => onSelect('critical')}
				className={`component--alertSelector-base ${selectedLevel === 'critical' ? criticalClassName : defaultClassName}`}>
				<AlertCritical className={'w-6 h-6 text-alert-critical-primary'} />
			</div>
		</div>
	);
}

export {AlertSelector};
export type {TAlertLevels};