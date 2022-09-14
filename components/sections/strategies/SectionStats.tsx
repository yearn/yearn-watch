import React, {ReactElement, memo} from 'react';
import {TStrategy, TVault} from 'contexts/useWatch.d';
import {AddressWithActions, DescriptionList} from '@yearn-finance/web-lib/components';
import {format}  from '@yearn-finance/web-lib/utils';
import {ethers} from 'ethers';

type	TSectionStats = {currentVault: TVault, currentStrategy: TStrategy | undefined};
const	SectionStats = memo(function SectionStats({currentVault, currentStrategy}: TSectionStats): ReactElement {
	if (!currentStrategy) {
		return <div />;
	}

	return (
		<section
			aria-label={'stats-of-the-strategy'}
			className={'col-span-1 flex flex-col'}>
			<h4 className={'mb-4'}>{'About'}</h4>
			<AddressWithActions
				address={currentStrategy.address}
				truncate={0}
				className={'break-all font-mono text-sm text-neutral-500'} />
			<DescriptionList
				className={'mt-8'}
				options={[
					{
						title: 'API Version',
						details: currentStrategy?.details?.version || '-'
					},
					{
						title: 'Activation Date',
						details: format.date(Number(currentStrategy?.details?.activation) * 1000 || 0)
					},
					{
						title: 'Since Last Harvest',
						details: currentStrategy?.details?.lastReport ? format.since(Number(currentStrategy?.details?.lastReport) * 1000) : 'never'
					},
					{
						title: 'Emergency exit',
						details: currentStrategy?.details?.emergencyExit ? 'Yes' : 'No'
					},
					{
						title: 'Active',
						details: currentStrategy?.details?.isActive ? 'Yes' : 'No'
					},
					{
						title: 'Total Estimated Assets',
						details: format.bigNumberAsAmount(format.BN(currentStrategy?.details?.estimatedTotalAssets), currentVault.decimals, 4)
					},
					{
						title: 'Credit Available',
						details: format.bigNumberAsAmount(format.BN(currentStrategy?.details?.creditAvailable), currentVault.decimals, 4)
					},
					{
						title: 'Debt Outstanding ',
						details: format.bigNumberAsAmount(format.BN(currentStrategy?.details?.debtOutstanding), currentVault.decimals, 4)
					},
					{
						title: 'Debt Ratio',
						details: format.bigNumberAsAmount(format.BN(currentStrategy?.details?.debtRatio), 2, 2, '%')
					},
					{
						title: 'Total Debt',
						details: format.bigNumberAsAmount(format.BN(currentStrategy?.details?.totalDebt), currentVault.decimals, 4)
					},
					{
						title: 'Total Gain ',
						details: format.bigNumberAsAmount(format.BN(currentStrategy?.details?.totalGain), currentVault.decimals, 4)
					},
					{
						title: 'Total Loss',
						details: format.bigNumberAsAmount(format.BN(currentStrategy?.details?.totalLoss), currentVault.decimals, 4)
					},
					{
						title: 'Expected Return ',
						details: format.bigNumberAsAmount(format.BN(currentStrategy?.details?.expectedReturn), currentVault.decimals, 4)
					},
					{
						title: 'Performance Fee ',
						details: format.bigNumberAsAmount(format.BN(currentStrategy?.details?.performanceFee), 2, 2, '%')
					},
					{
						title: 'Min Debt Per Harvest ',
						details: format.bigNumberAsAmount(format.BN(currentStrategy?.details?.minDebtPerHarvest), currentVault.decimals, 4)
					},
					{
						title: 'Max Debt Per Harvest ',
						details: format.bigNumberAsAmount(format.BN(currentStrategy?.details?.maxDebtPerHarvest), currentVault.decimals, 4)
					},
					{
						title: 'KeepCRV ',
						details: currentStrategy?.details?.keepCRV
					},
					{
						title: 'Keeper',
						details: <AddressWithActions address={currentStrategy?.details?.keeper || ethers.constants.AddressZero} />
					}, 
					{
						title: 'Rewards',
						details: <AddressWithActions address={currentStrategy?.details?.rewards || ethers.constants.AddressZero} />
					}, 
					{
						title: 'Strategist',
						details: <AddressWithActions address={currentStrategy?.details?.strategist || ethers.constants.AddressZero} />
					}, 
					{
						title: 'Vault',
						details: <AddressWithActions address={currentVault?.address || ethers.constants.AddressZero} />}
				]} />
		</section>
	);
});

export default SectionStats;