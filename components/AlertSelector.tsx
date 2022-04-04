

import	React, {ReactElement}						from	'react';
import	{AlertWarning, AlertError, AlertCritical}	from	'@majorfi/web-lib/icons';

type		TAlertLevels = 'none' | 'info' | 'warning' | 'error' | 'critical';
type		TAlertSelector = {
	selectedLevel: TAlertLevels,
	onSelect: (s: TAlertLevels) => void
}
function	AlertSelector({selectedLevel, onSelect}: TAlertSelector): ReactElement {
	const	defaultClassName = 'border-transparent bg-surface';
	const	warningClassName = 'border-alert-warning-primary bg-alert-warning-secondary';
	const	errorClassName = 'border-alert-error-primary bg-alert-error-secondary';
	const	criticalClassName = 'border-alert-critical-primary bg-alert-critical-secondary';

	return (
		<div className={'flex flex-row items-center space-x-1 md:space-x-2'}>
			<div
				onClick={(): void => onSelect('warning')}
				className={`flex justify-center items-center cursor-pointer py-4 px-4 rounded-lg border transition-colors ${selectedLevel === 'warning' ? warningClassName : defaultClassName}`}>
				<AlertWarning className={'w-6 h-6 text-alert-warning-primary'} />
			</div>
			<div
				onClick={(): void => onSelect('error')}
				className={`flex justify-center items-center cursor-pointer py-4 px-4 rounded-lg border transition-colors ${selectedLevel === 'error' ? errorClassName : defaultClassName}`}>
				<AlertError className={'w-6 h-6 text-alert-error-primary'} />
			</div>
			<div
				onClick={(): void => onSelect('critical')}
				className={`flex justify-center items-center cursor-pointer py-4 px-4 rounded-lg border transition-colors ${selectedLevel === 'critical' ? criticalClassName : defaultClassName}`}>
				<AlertCritical className={'w-6 h-6 text-alert-critical-primary'} />
			</div>
		</div>
	);
}

export {AlertSelector};
export type {TAlertLevels};