import	React, {ReactElement}		from	'react';
import	{Card, Switch}				from	'@yearn-finance/web-lib/components';
import	useSettings					from	'contexts/useSettings';
import	SectionFormGraphURI			from	'components/sections/settings/SectionFormGraphURI';
import	SectionFormRpcURI			from	'components/sections/settings/SectionFormRpcURI';

/* 🔵 - Yearn Finance **********************************************************
** Main render of the Settings page
******************************************************************************/
function	Settings(): ReactElement {
	const {
		shouldDisplayStratsInQueue, switchShouldDisplayStratsInQueue,
		shouldOnlyDisplayEndorsedVaults, switchShouldOnlyDisplayEndorsedVaults,
		shouldDisplayVaultsWithMigration, switchShouldDisplayVaultsWithMigration,
		shouldDisplayVaultNoStrats, switchShouldDisplayVaultNoStrats,
		shouldDisplayWithNoDebt, switchShouldDisplayWithNoDebt,
		shouldGivePriorityToSubgraph, switchShouldGivePriorityToSubgraph,
		shouldUseRemoteFetch, switchShouldUseRemoteFetch,
		shouldFetchStratsFromVault, switchShouldFetchStratsFromVault
	} = useSettings();
	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex-col-full space-y-4'}>
			<Card className={'flex w-full flex-col space-y-4'}>
				<div className={'pb-6'}>
					<h4>{'Vaults & Strategies'}</h4>
				</div>
				<div className={'flex w-full flex-row'}>
					<div className={'w-full pb-2 md:w-5/12 md:pb-0'}><label className={'test-sm'}>
						{'Only display endorsed Vaults'}
					</label></div>
					<div className={'w-full md:w-7/12'}>
						<Switch
							isEnabled={shouldOnlyDisplayEndorsedVaults}
							onSwitch={(): void => switchShouldOnlyDisplayEndorsedVaults()} />
					</div>
				</div>
				<div className={'flex w-full flex-row'}>
					<div className={'w-full pb-2 md:w-5/12 md:pb-0'}><label className={'test-sm'}>
						{'Display vaults with migration'}
					</label></div>
					<div className={'w-full md:w-7/12'}>
						<Switch
							isEnabled={shouldDisplayVaultsWithMigration}
							onSwitch={(): void => switchShouldDisplayVaultsWithMigration()} />
					</div>
				</div>
				<div className={'flex w-full flex-row'}>
					<div className={'w-full pb-2 md:w-5/12 md:pb-0'}><label className={'test-sm'}>
						{'Hide vaults with no strategies'}
					</label></div>
					<div className={'w-full md:w-7/12'}>
						<Switch
							isEnabled={shouldDisplayVaultNoStrats}
							onSwitch={(): void => switchShouldDisplayVaultNoStrats()} />
					</div>
				</div>
				<div className={'flex w-full flex-row'}>
					<div className={'w-full pb-2 md:w-5/12 md:pb-0'}><label className={'test-sm'}>{'Hide strategies not in withdraw queue'}</label></div>
					<div className={'w-full md:w-7/12'}>
						<Switch
							isEnabled={shouldDisplayStratsInQueue}
							onSwitch={(): void => switchShouldDisplayStratsInQueue()} />
					</div>
				</div>
			</Card>

			<Card className={'flex w-full flex-col space-y-4'}>
				<div className={'pb-6'}>
					<h4>{'Fetching method'}</h4>
				</div>
				<div className={'flex w-full flex-row'}>
					<div className={'w-full pb-2 md:w-5/12 md:pb-0'}><label className={'test-sm'}>{'Should use remote fetcher'}</label></div>
					<div className={'w-full md:w-7/12'}>
						<Switch
							isEnabled={shouldUseRemoteFetch}
							onSwitch={(): void => switchShouldUseRemoteFetch()} />
					</div>
				</div>
				<div className={`flex w-full flex-row ${shouldUseRemoteFetch ? 'cursor-not-allowed opacity-60' : ''}`}>
					<div className={'w-full pb-2 md:w-5/12 md:pb-0'}><label className={'test-sm'}>{'Give priority to Subgraph'}</label></div>
					<div className={'w-full md:w-7/12'}>
						<Switch
							isEnabled={shouldGivePriorityToSubgraph}
							onSwitch={(): void => switchShouldGivePriorityToSubgraph()} />
					</div>
				</div>
				<div className={`flex w-full flex-row ${shouldUseRemoteFetch ? 'cursor-not-allowed opacity-60' : ''}`}>
					<div className={'w-full pb-2 md:w-5/12 md:pb-0'}>
						<label className={'test-sm'}>
							{'Display vault with balanceTokensIdle and balanceTokensInvested equal to 0'}
						</label>
					</div>
					<div className={'w-full md:w-7/12'}>
						<Switch
							isEnabled={shouldDisplayWithNoDebt}
							onSwitch={(): void => switchShouldDisplayWithNoDebt()} />
					</div>
				</div>
				<div className={`flex w-full flex-row ${shouldFetchStratsFromVault ? 'cursor-not-allowed opacity-60' : ''}`}>
					<div className={'w-full pb-2 md:w-5/12 md:pb-0'}>
						<label className={'test-sm'}>
							{'Fetch withdrawal queue from contract directly (slower)'}
						</label>
					</div>
					<div className={'w-full md:w-7/12'}>
						<Switch
							isEnabled={shouldFetchStratsFromVault}
							onSwitch={(): void => switchShouldFetchStratsFromVault()} />
					</div>
				</div>
			</Card>

			<SectionFormGraphURI />
			<SectionFormRpcURI />
		</div>
	);
}

export default Settings;
