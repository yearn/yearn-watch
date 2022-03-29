import	React, {ReactElement}	from	'react';
import	Modal					from	'@lib/components/Modal';
import	IconCross				from	'@icons/IconCross';
import	IconWarning				from	'@icons/IconAlertWarning';
import	{TAlert}				from	'contexts/useWatch';

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
					<b className={'text-typo-primary'}>{'Warnings'}</b>
					<div onClick={(): void => set_isOpen(false)}>
						<IconCross className={'w-6 h-6 text-primary hover:text-typo-primary-variant transition-colors cursor-pointer'} />
					</div>
				</div>
				<div className={'flex flex-row items-start p-2 text-alert-warning-primary bg-alert-warning-secondary rounded-lg'}>
					<IconWarning className={'w-5 h-5'} />
					<div className={'pl-2'}>
						{alerts.map((alert): ReactElement => (
							<div key={alert.message} className={'flex flex-row items-center'}>
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