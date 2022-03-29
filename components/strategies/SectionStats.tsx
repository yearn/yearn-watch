import	React, {ReactElement}						from	'react';
import	{TVault, TStrategy}							from	'contexts/useWatch';
import	DescriptionList								from	'@lib/components/DescriptionList';
import	AddressWithActions							from	'@lib/components/AddressWithActions';
import	* as format									from	'@lib/utils/format';

type	TSectionStats = {currentVault: TVault, currentStrategy: TStrategy | undefined};
const	SectionStats = React.memo(function SectionStats({currentVault, currentStrategy}: TSectionStats): ReactElement {
	if (!currentStrategy) {
		return <div />;
	}

	return (
		<section aria-label={'stats-of-the-strategy'} className={'flex flex-col col-span-1'}>
			<h4 className={'mb-4'}>{'About'}</h4>
			<AddressWithActions
				address={currentStrategy.address}
				explorer={currentVault.explorer}
				truncate={0}
				className={'font-mono text-sm text-typo-secondary-variant'} />
			<DescriptionList
				className={'mt-8'}
				options={[
					{title: 'API Version', details: currentStrategy?.apiVersion || '-'},
					{title: 'Activation Date', details: format.date(Number(currentStrategy?.activation) * 1000 || 0)},
					{title: 'Since Last Harvest', details: currentStrategy?.lastReport ? format.since(Number(currentStrategy.lastReport) * 1000) : 'never'},
					{title: 'Emergency exit', details: currentStrategy?.isEmergencyExit ? 'Yes' : 'No'},
					{title: 'Active', details: currentStrategy?.isActive ? 'Yes' : 'No'},
					{title: 'Total Estimated Assets', details: format.bigNumberAsAmount(currentStrategy.estimatedTotalAssets, currentVault.decimals, 4)},
					{title: 'Credit Available', details: format.bigNumberAsAmount(currentStrategy.creditAvailable, currentVault.decimals, 4)},
					{title: 'Debt Outstanding ', details: format.bigNumberAsAmount(currentStrategy.debtOutstanding, currentVault.decimals, 4)},
					{title: 'Debt Ratio', details: format.bigNumberAsAmount(currentStrategy.debtRatio, 2, 2, '%')},
					{title: 'Total Debt', details: format.bigNumberAsAmount(currentStrategy.totalDebt, currentVault.decimals, 4)},
					{title: 'Total Gain ', details: format.bigNumberAsAmount(currentStrategy.totalGain, currentVault.decimals, 4)},
					{title: 'Total Loss', details: format.bigNumberAsAmount(currentStrategy.totalLoss, currentVault.decimals, 4)},
					{title: 'Expected Return ', details: format.bigNumberAsAmount(currentStrategy.expectedReturn, currentVault.decimals, 4)},
					{title: 'Performance Fee ', details: format.bigNumberAsAmount(currentStrategy.performanceFee, 2, 2, '%')},
					{title: 'Min Debt Per Harvest ', details: format.bigNumberAsAmount(currentStrategy.minDebtPerHarvest, currentVault.decimals, 4)},
					{title: 'Max Debt Per Harvest ', details: format.bigNumberAsAmount(currentStrategy.maxDebtPerHarvest, currentVault.decimals, 4)},
					{title: 'Keeper', details: <AddressWithActions address={currentStrategy?.addrKeeper || ''} explorer={currentVault.explorer} />}, 
					{title: 'Rewards', details: <AddressWithActions address={currentStrategy?.addrRewards || ''} explorer={currentVault.explorer} />}, 
					{title: 'Strategist', details: <AddressWithActions address={currentStrategy?.addrStrategist || ''} explorer={currentVault.explorer} />}, 
					{title: 'Vault', details: <AddressWithActions address={currentVault?.address || ''} explorer={currentVault.explorer} />}
				]} />
		</section>
	);
});

export default SectionStats;