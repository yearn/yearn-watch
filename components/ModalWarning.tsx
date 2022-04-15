import	React, {ReactElement}	from	'react';
import	{TAlert}				from	'contexts/useWatch.d';
import	{Modal}					from	'@yearn/web-lib/components';
import	{Cross, AlertWarning}	from	'@yearn/web-lib/icons';

type	TModalWarning = {
	alerts: TAlert[],
	isOpen: boolean,
	set_isOpen: React.Dispatch<React.SetStateAction<boolean>>,
}
function	ModalWarning({alerts, isOpen, set_isOpen}: TModalWarning): ReactElement {
	return (
		<Modal
			isOpen={isOpen}
			onClose={(): void => set_isOpen(false)}>
			<div className={'p-6'}>
				<div className={'flex flex-row justify-between items-center mb-4'}>
					<b>{'Warnings'}</b>
					<div onClick={(): void => set_isOpen(false)}>
						<Cross className={'w-6 h-6 transition-colors cursor-pointer text-primary hover:text-typo-primary-variant'} />
					</div>
				</div>
				<div className={'p-2 rounded-lg flex-row-start text-alert-warning-primary bg-alert-warning-secondary'}>
					<AlertWarning className={'w-5 h-5'} />
					<div className={'pl-2'}>
						{alerts.map((alert): ReactElement => (
							<div key={alert.message} className={'flex-row-center'}>
								<p>{alert.message}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</Modal>
	);
}


export default ModalWarning;