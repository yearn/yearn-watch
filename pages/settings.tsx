import	React, {ReactElement}		from	'react';
import	{Card, Switch}				from	'@yearn/web-lib/components';
import	useSettings					from	'contexts/useSettings';
import	SectionFormGraphURI			from	'components/sections/settings/SectionFormGraphURI';
import	SectionFormRpcURI			from	'components/sections/settings/SectionFormRpcURI';

/* 🔵 - Yearn Finance **********************************************************
** Main render of the Settings page
******************************************************************************/
function	Settings(): ReactElement {
	const {
		shouldDisplayStratsInQueue, switchShouldDisplayStratsInQueue,
		shouldUseRemoteFetch, switchShouldUseRemoteFetch
	} = useSettings();
	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'space-y-4 flex-col-full'}>
			<Card className={'flex flex-col space-y-4 w-full'}>
				<div className={'pb-6'}>
					<h4>{'Strategies'}</h4>
				</div>
				<div className={'flex flex-row w-full'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Hide strategies not in withdraw queue'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<Switch
							isEnabled={shouldDisplayStratsInQueue}
							onSwitch={(): void => switchShouldDisplayStratsInQueue()} />
					</div>
				</div>
			</Card>

			<Card className={'flex flex-col space-y-4 w-full'}>
				<div className={'pb-6'}>
					<h4>{'Fetching method'}</h4>
				</div>
				<div className={'flex flex-row w-full'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Should use remote fetcher'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<Switch
							isEnabled={shouldUseRemoteFetch}
							onSwitch={(): void => switchShouldUseRemoteFetch()} />
					</div>
				</div>
			</Card>

			<SectionFormGraphURI />
			<SectionFormRpcURI />
		</div>
	);
}

export default Settings;
