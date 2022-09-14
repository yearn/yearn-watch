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
	switchShouldDisplayVaultNoStrats: () => void
}