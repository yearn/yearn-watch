import React, {ReactElement, useMemo, useState} from 'react';
import {Card, Switch} from '@yearn-finance/web-lib/components';
import {useSettings as productUseSettings} from 'contexts/useSettings';
import {useSettings} from '@yearn-finance/web-lib/contexts';

type TWrappedInput = {
	title: string;
	caption: string;
	initialValue: string;
	onSave: (value: string) => void;
}

function	WrappedInput({title, caption, initialValue, onSave}: TWrappedInput): ReactElement {
	const	[isFocused, set_isFocused] = useState(false);
	const	[value, set_value] = useState(initialValue);
	const	isInitialValue = useMemo((): boolean => value === initialValue, [value, initialValue]);

	return (
		<label>
			<p className={`transition-colors ${isFocused ? 'text-primary-500' : 'text-neutral-900'}`}>
				{title}
			</p>
			<div data-focused={isFocused} className={'yearn--input relative'}>
				<input
					onFocus={(): void => set_isFocused(true)}
					onBlur={(): void => set_isFocused(false)}
					placeholder={'Use default RPC'}
					value={value}
					type={'text'}
					onChange={(e): void => set_value(e.target.value)}
				/>
				<div className={`absolute inset-y-0 right-2 flex justify-center ${isInitialValue ? 'pointer-events-none opacity-0' : 'opacity-100'} transition-opacity`}>
					<button
						onClick={(): void => onSave(value)}
						className={'flex h-6 cursor-pointer items-center justify-center bg-primary-500 px-2 py-1 text-center hover:bg-primary-600'}>
						<p className={'text-sm text-neutral-0'}>{'Save'}</p>
					</button>
				</div>
			</div>
			<p className={'yearn--input-caption'}>
				{caption}
			</p>
		</label>
	);
}


function	SectionRPCEndpoints(): ReactElement {
	const	{onUpdateNetworks} = useSettings();
	const	[, set_nonce] = useState(0);

	return (
		<Card>
			<div className={'flex w-full flex-row justify-between pb-4'}>
				<h4 className={'text-lg font-bold'}>{'RPC Endpoints'}</h4>
			</div>
			<div className={'text-justify'}>
				<p>
					{'The RPC Endpoints are the ways in which your wallet communicates with a given network. Without this, the dApp will not be able to read or write informations on the blockchain.'}
				</p>
				<div className={'mt-4 grid grid-cols-1 gap-4'}>
					<WrappedInput
						title={''}
						caption={'Endpoint to use to read and write on the Ethereum Mainnet chain (chainID: 1).'}
						initialValue={''}
						onSave={(value): void => {
							onUpdateNetworks({1: {rpcURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Endpoint to use to read and write on the Optimism chain (chainID: 10).'}
						initialValue={''}
						onSave={(value): void => {
							onUpdateNetworks({10: {rpcURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Endpoint to use to read and write on the Fantom Opera chain (chainID: 250).'}
						initialValue={''}
						onSave={(value): void => {
							onUpdateNetworks({250: {rpcURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Endpoint to use to read and write on the Arbitrum chain (chainID: 42161).'}
						initialValue={''}
						onSave={(value): void => {
							onUpdateNetworks({42161: {rpcURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />
				</div>
			</div>
		</Card>
	);
}

function	SectionSubGraphEndpoints(): ReactElement {
	const	{onUpdateNetworks, networks} = useSettings();
	const	[, set_nonce] = useState(0);

	return (
		<Card>
			<div className={'flex w-full flex-row justify-between pb-4'}>
				<h4 className={'text-lg font-bold'}>{'Subgraph Endpoints'}</h4>
			</div>
			<div className={'text-justify'}>
				<p>
					{'The blockchain is an ever-growing chain of blocks and each block has a small piece of information inside it, when we need to query for something that needs data from many blocks we need to read through them all and aggregate the data, turns out this can get super complex and hard to maintain, so we use Subgraphs to make it easier.'}
				</p>
				<div className={'mt-4 grid grid-cols-1 gap-4'}>
					<WrappedInput
						title={''}
						caption={'Subgraph endpoint for the Ethereum Mainnet chain (chainID: 1).'}
						initialValue={networks[1].graphURI}
						onSave={(value): void => {
							onUpdateNetworks({1: {graphURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Subgraph endpoint for the Optimism chain (chainID: 10).'}
						initialValue={networks[10].graphURI}
						onSave={(value): void => {
							onUpdateNetworks({1: {graphURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Subgraph endpoint for the Fantom Opera chain (chainID: 250).'}
						initialValue={networks[250].graphURI}
						onSave={(value): void => {
							onUpdateNetworks({1: {graphURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Subgraph endpoint for the Arbitrum chain (chainID: 42161).'}
						initialValue={networks[42161].graphURI}
						onSave={(value): void => {
							onUpdateNetworks({1: {graphURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />
				</div>
			</div>
		</Card>
	);
}

function	SectionExplorerBaseURI(): ReactElement {
	const	{onUpdateNetworks, networks} = useSettings();
	const	[, set_nonce] = useState(0);

	return (
		<Card>
			<div className={'flex w-full flex-row justify-between pb-4'}>
				<h4 className={'text-lg font-bold'}>{'Explorer Base URL'}</h4>
			</div>
			<div className={'text-justify'}>
				<p>
					{'Base URL of the chain explorer in order to list transactions and follow the blocks.'}
				</p>
				<div className={'mt-4 grid grid-cols-1 gap-4'}>
					<WrappedInput
						title={''}
						caption={'Explorer Base URL for the Ethereum Mainnet chain (chainID: 1).'}
						initialValue={networks[1].explorerBaseURI}
						onSave={(value): void => {
							onUpdateNetworks({1: {explorerBaseURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Explorer Base URL for the Optimism chain (chainID: 10).'}
						initialValue={networks[10].explorerBaseURI}
						onSave={(value): void => {
							onUpdateNetworks({10: {explorerBaseURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Explorer Base URL for the Fantom Opera chain (chainID: 250).'}
						initialValue={networks[250].explorerBaseURI}
						onSave={(value): void => {
							onUpdateNetworks({250: {explorerBaseURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Explorer Base URL for the Arbitrum chain (chainID: 42161).'}
						initialValue={networks[42161].explorerBaseURI}
						onSave={(value): void => {
							onUpdateNetworks({42161: {explorerBaseURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />
				</div>
			</div>
		</Card>
	);
}

function	SectionOracleAddress(): ReactElement {
	const	{onUpdateNetworks, networks} = useSettings();
	const	[, set_nonce] = useState(0);

	return (
		<Card>
			<div className={'flex w-full flex-row justify-between pb-4'}>
				<h4 className={'text-lg font-bold'}>{'Lens Oracle Address'}</h4>
			</div>
			<div className={'text-justify'}>
				<p>
					{'The Lens oracle provide an easy way to display the USD value for a given token.'}
				</p>
				<div className={'mt-4 grid grid-cols-1 gap-4'}>
					<WrappedInput
						title={''}
						caption={'Explorer Base URL for the Ethereum Mainnet chain (chainID: 1).'}
						initialValue={networks[1].lensAddress}
						onSave={(value): void => {
							onUpdateNetworks({1: {lensAddress: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Explorer Base URL for the Optimism chain (chainID: 10).'}
						initialValue={networks[10].lensAddress}
						onSave={(value): void => {
							onUpdateNetworks({10: {lensAddress: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Explorer Base URL for the Fantom Opera chain (chainID: 250).'}
						initialValue={networks[250].lensAddress}
						onSave={(value): void => {
							onUpdateNetworks({250: {lensAddress: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						caption={'Explorer Base URL for the Arbitrum chain (chainID: 42161).'}
						initialValue={networks[42161].lensAddress}
						onSave={(value): void => {
							onUpdateNetworks({42161: {lensAddress: value}});
							set_nonce((n: number): number => n + 1);
						}} />
				</div>
			</div>
		</Card>
	);
}

function	SectionYearnAPIBaseURI(): ReactElement {
	const	{onUpdateBaseSettings, settings: baseAPISettings} = useSettings();

	return (
		<Card>
			<div className={'flex w-full flex-row justify-between pb-4'}>
				<h4 className={'text-lg font-bold'}>{'Yearn\'s APIs'}</h4>
			</div>
			<div className={'text-justify'}>
				<p>
					{'The Yearn\'s API endpoints are used to get some specific Yearn\'s related information about the vaults, the strategies and much more.'}
				</p>
				<div className={'mt-4 grid grid-cols-1 gap-4'}>
					<WrappedInput
						title={''}
						caption={'yDaemon API endpoint to get the list of Vaults and Strategies along with their details.'}
						initialValue={baseAPISettings.yDaemonBaseURI}
						onSave={(value): void => onUpdateBaseSettings({
							...baseAPISettings,
							yDaemonBaseURI: value
						})} />
					<WrappedInput
						title={''}
						caption={'Legacy API endpoint to get the list of Vaults and Strategies along with their details.'}
						initialValue={baseAPISettings.apiBaseURI}
						onSave={(value): void => onUpdateBaseSettings({
							...baseAPISettings,
							apiBaseURI: value
						})} />
					<WrappedInput
						title={''}
						caption={'Meta API endpoint to get the some human readable information about the vaults, strategies and protocols.'}
						initialValue={baseAPISettings.metaBaseURI}
						onSave={(value): void => onUpdateBaseSettings({
							...baseAPISettings,
							metaBaseURI: value
						})} />
				</div>
			</div>
		</Card>
	);
}

/* 🔵 - Yearn Finance **********************************************************
** Main render of the Settings page
******************************************************************************/
function	Settings(): ReactElement {
	const {
		shouldDisplayStratsInQueue, switchShouldDisplayStratsInQueue,
		shouldOnlyDisplayEndorsedVaults, switchShouldOnlyDisplayEndorsedVaults,
		shouldDisplayVaultsWithMigration, switchShouldDisplayVaultsWithMigration,
		shouldDisplayVaultNoStrats, switchShouldDisplayVaultNoStrats
	} = productUseSettings();
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
						{'Display endorsed vault only'}
					</label></div>
					<div className={'w-full md:w-7/12'}>
						<Switch
							isEnabled={shouldOnlyDisplayEndorsedVaults}
							onSwitch={(): void => switchShouldOnlyDisplayEndorsedVaults()} />
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
			<SectionYearnAPIBaseURI />
			<SectionRPCEndpoints />
			<SectionSubGraphEndpoints />
			<SectionExplorerBaseURI />
			<SectionOracleAddress />
		</div>
		
	);
}

export default Settings;
