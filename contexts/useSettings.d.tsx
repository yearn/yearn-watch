export type	TNetworkURI = {
	[key: number]: string,
}

export type	TSettingsContext = {
	shouldDisplayStratsInQueue: boolean,
	switchShouldDisplayStratsInQueue: () => void,
	shouldUseRemoteFetch: boolean,
	switchShouldUseRemoteFetch: () => void,
	subGraphURI: TNetworkURI,
	updateSubGraphURI: (updated: TNetworkURI) => void,
	rpcURI: TNetworkURI
	updateRPCURI: (updated: TNetworkURI) => void,
}