import React, {ReactElement, useState} from 'react';
import {useWatch} from 'contexts/useWatch';
import {useInterval} from '@yearn-finance/web-lib/hooks';
import * as utils from '@yearn-finance/web-lib/utils';

function	AppSync(): ReactElement {
	const	{hasError, lastUpdate, isUpdating} = useWatch();
	const	[lastUpdateDiff, set_lastUpdateDiff] = useState<number>(0);

	/* 🔵 - Yearn Finance ******************************************************
	** Data are cached for 10 minutes to avoid too many loading time for not
	** much change. Theses data can be force updated on demand.
	** Get the difference between the user's browser and the cache update time
	** and register a interval to update this counter every minutes.
	**************************************************************************/
	useInterval((): void => {
		if (lastUpdate) {
			set_lastUpdateDiff(lastUpdate - new Date().valueOf());
		}
	}, 30 * 1000, true, [lastUpdate]);

	return (
		<>
			<a href={'https://ydaemon.ycorpo.com/docs/daemons/list'} target={'_blank'} rel={'noreferrer'}>
				<div className={'flex-row-center cursor-pointer space-x-2'}>
					<div className={`aspect-square h-2 w-2 rounded-full ${isUpdating ? 'animate-spin border-2 border-transparent border-t-accent-500 border-l-accent-500 bg-neutral-200' : lastUpdateDiff < -300_000 ? 'bg-yellow-900' : 'bg-accent-500'}`} />
					<p className={'text-xs text-neutral-500'}>{isUpdating ? 'Fetching data ...' : `Sync ${utils.format.duration(lastUpdateDiff, true)}`}</p>
				</div>
			</a>
			{
				hasError ? (
					<div className={'flex-row-center space-x-2'}>
						<div className={'aspect-square h-2 w-2 rounded-full bg-pink-900'} />
						<p className={'text-xs text-neutral-500'}>{'yDaemon down'}</p>
					</div>
				) : <div className={'flex-row-center space-x-2'}>
					<div className={'aspect-square h-2 w-2 rounded-full bg-accent-500'} />
					<p className={'text-xs text-neutral-500'}>{'yDaemon synced'}</p>
				</div>
			}
		</>
	);
}

export default AppSync;