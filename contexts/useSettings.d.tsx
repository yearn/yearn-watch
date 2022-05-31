export type	TNetworkURI = {
	[key: number]: string,
}

export type	TSettingsContext = {
	shouldDisplayStratsInQueue: boolean,
	switchShouldDisplayStratsInQueue: () => void,

	shouldOnlyDisplayEndorsedVaults: boolean,
	switchShouldOnlyDisplayEndorsedVaults: () => void,

	shouldDisplayVaultsWithMigration: boolean,
	switchShouldDisplayVaultsWithMigration: () => void,

	shouldDisplayVaultNoStrats: boolean,
	switchShouldDisplayVaultNoStrats: () => void,

	shouldGivePriorityToSubgraph: boolean,
	switchShouldGivePriorityToSubgraph: () => void,

	shouldDisplayWithNoDebt: boolean,
	switchShouldDisplayWithNoDebt: () => void,

	shouldUseRemoteFetch: boolean,
	switchShouldUseRemoteFetch: () => void,

	subGraphURI: TNetworkURI,
	updateSubGraphURI: (updated: TNetworkURI) => void,

	rpcURI: TNetworkURI
	updateRPCURI: (updated: TNetworkURI) => void,
}