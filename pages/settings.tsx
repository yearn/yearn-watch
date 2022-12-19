import React, {ReactElement, useMemo, useState} from 'react';
import {Button, Card, Switch} from '@yearn-finance/web-lib/components';
import {useSettings as productUseSettings} from 'contexts/useSettings';
import {useSettings} from '@yearn-finance/web-lib/contexts';

type TWrappedInput = {
	title: string;
	initialValue: string;
	onSave: (value: string) => void;
}

function	WrappedInput({title, initialValue, onSave}: TWrappedInput): ReactElement {
	const	[isFocused, set_isFocused] = useState(false);
	const	[value, set_value] = useState(initialValue);
	const	isInitialValue = useMemo((): boolean => value === initialValue, [value, initialValue]);

	return (
		<label>
			<p className={'pb-1 text-neutral-900'}>{title}</p>
			<div className={'flex flex-row space-x-2'}>
				<div data-focused={isFocused} className={'yearn--input relative w-full'}>
					<input
						onFocus={(): void => set_isFocused(true)}
						onBlur={(): void => set_isFocused(false)}
						className={'h-10 w-full overflow-x-scroll border-2 border-neutral-700 bg-neutral-0 p-2 outline-none scrollbar-none'}
						placeholder={'Use default'}
						value={value}
						type={'text'}
						onChange={(e): void => set_value(e.target.value)}
					/>
				</div>
				<Button
					disabled={isInitialValue}
					className={'w-full rounded-none md:w-48'}
					onClick={(): void => onSave(value)}>
					{'Save'}
				</Button>
			</div>
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
						initialValue={''}
						onSave={(value): void => {
							onUpdateNetworks({1: {rpcURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						initialValue={''}
						onSave={(value): void => {
							onUpdateNetworks({10: {rpcURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
						initialValue={''}
						onSave={(value): void => {
							onUpdateNetworks({250: {rpcURI: value}});
							set_nonce((n: number): number => n + 1);
						}} />

					<WrappedInput
						title={''}
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
						initialValue={baseAPISettings.yDaemonBaseURI}
						onSave={(value): void => onUpdateBaseSettings({
							...baseAPISettings,
							yDaemonBaseURI: value
						})} />
					<WrappedInput
						title={''}
						initialValue={baseAPISettings.apiBaseURI}
						onSave={(value): void => onUpdateBaseSettings({
							...baseAPISettings,
							apiBaseURI: value
						})} />
					<WrappedInput
						title={''}
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
		</div>
		
	);
}

export default Settings;
