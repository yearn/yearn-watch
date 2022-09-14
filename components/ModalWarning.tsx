import React, {ReactElement} from 'react';
import {TAlert} from 'contexts/useWatch.d';
import {Modal} from '@yearn-finance/web-lib/components';
import {AlertWarning, Cross} from '@yearn-finance/web-lib/icons';

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
				<div className={'mb-4 flex flex-row items-center justify-between'}>
					<b>{'Warnings'}</b>
					<div onClick={(): void => set_isOpen(false)}>
						<Cross className={'h-6 w-6 cursor-pointer text-accent-500 transition-colors hover:text-accent-600'} />
					</div>
				</div>
				<div className={'rounded-default flex-row-start bg-yellow-300 p-2 text-yellow-900'}>
					<AlertWarning className={'h-5 w-5'} />
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