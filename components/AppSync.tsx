import	React, {ReactElement}	from	'react';
import	useWatch				from	'contexts/useWatch';
import	{useInterval}			from	'@yearn-finance/web-lib/hooks';
import	* as utils				from	'@yearn-finance/web-lib/utils';

function	AppSync(): ReactElement | null {
	const	{network, lastUpdate, isUpdating, update} = useWatch();
	const	[blockDiff, set_blockDiff] = React.useState<number>(0);
	const	[lastUpdateDiff, set_lastUpdateDiff] = React.useState<number>(0);
	const	[shouldRender, set_shouldRender] = React.useState(false);

	/* 🔵 - Yearn Finance ******************************************************
	** We are using the subgraph for some of the data. The subgraph could be
	** a few blocks outdated, so we need to display the difference between
	** the rpc block height and the subgraph block height.
	**
	** -1 is returned if the subgraph is not available, otherwise the we return
	** the absolute difference between the two.
	**************************************************************************/
	React.useEffect((): void => {
		if (network.hasGraphIndexingErrors)
			set_blockDiff(-1);
		else if (network.blockNumber && network.graphBlockNumber)
			set_blockDiff(Math.abs(network.blockNumber - network.graphBlockNumber));
	}, [network.blockNumber, network.graphBlockNumber, network.hasGraphIndexingErrors]);

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

	React.useEffect((): void => {
		set_shouldRender(true);
	}, []);


	function	renderBlockDiff(): string {
		if (blockDiff === -1)
			return 'Error with graph height';
		if (blockDiff === 0)
			return 'Graph is up to date';
		return `Graph is ${blockDiff} block${blockDiff > 1 ? 's' : ''} behind`;
	}

	if (typeof(window) === 'undefined' || !shouldRender) {
		return null;
	}

	return (
		<>
			<div className={'flex-row-center cursor-pointer space-x-2'} onClick={update}>
				<div className={`aspect-square h-2 w-2 rounded-full ${isUpdating ? 'animate-spin border-2 border-transparent border-t-accent-500 border-l-accent-500 bg-neutral-200' : lastUpdateDiff < -300_000 ? 'bg-yellow-900' : 'bg-accent-500'}`} />
				<p className={'text-xs text-neutral-500'}>{isUpdating ? 'Fetching data ...' : `Sync ${utils.format.duration(lastUpdateDiff, true)}`}</p>
			</div>
			<div className={'flex-row-center space-x-2'}>
				<div className={`aspect-square h-2 w-2 rounded-full ${blockDiff === -1 ? 'bg-pink-900' : blockDiff > 100 ? 'bg-yellow-900' : 'bg-accent-500'}`} />
				<p className={'text-xs text-neutral-500'}>{renderBlockDiff()}</p>
			</div>
			{
				network?.status?.rpc === 0 ? (
					<div className={'flex-row-center space-x-2'}>
						<div className={'aspect-square h-2 w-2 rounded-full bg-pink-900'} />
						<p className={'text-xs text-neutral-500'}>{'RPC is down'}</p>
					</div>
				) : null
			}
			{
				network?.status?.graph === 0 ? (
					<div className={'flex-row-center space-x-2'}>
						<div className={'aspect-square h-2 w-2 rounded-full bg-pink-900'} />
						<p className={'text-xs text-neutral-500'}>{'SubGraph is down'}</p>
					</div>
				) : null
			}
			{
				network?.status?.yearnApi === 0 ? (
					<div className={'flex-row-center space-x-2'}>
						<div className={'aspect-square h-2 w-2 rounded-full bg-pink-900'} />
						<p className={'text-xs text-neutral-500'}>{'Yearn API is down'}</p>
					</div>
				) : null
			}
			{
				network?.status?.yearnMeta === 0 ? (
					<div className={'flex-row-center space-x-2'}>
						<div className={'aspect-square h-2 w-2 rounded-full bg-pink-900'} />
						<p className={'text-xs text-neutral-500'}>{'Yearn Meta is down'}</p>
					</div>
				) : null
			}
		</>
	);
}

export default AppSync;