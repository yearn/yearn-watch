import	React, {ReactElement}						from	'react';
import	{TVault, TStrategy}							from	'contexts/useYearn';
import	* as utils									from	'utils';
import	DescriptionList								from	'@lib/DescriptionList';
import	AddressWithActions							from	'@lib/AddressWithActions';

type	TSectionStats = {currentVault: TVault, currentStrategy: TStrategy | undefined};
const	SectionStats = React.memo(function SectionStats({currentVault, currentStrategy}: TSectionStats): ReactElement {
	if (!currentStrategy) {
		return <div />;
	}

	return (
		<section aria-label={'stats-of-the-strategy'} className={'flex flex-col col-span-1'}>
			<h4 className={'mb-4 text-lg font-bold text-typo-primary'}>{'About'}</h4>
			<AddressWithActions
				address={currentStrategy.address}
				explorer={currentVault.explorer}
				truncate={0}
				className={'font-mono text-sm text-typo-secondary-variant'} />
			<DescriptionList
				className={'mt-8'}
				options={[
					{title: 'API Version', details: currentStrategy?.apiVersion || '-'},
					{title: 'Activation Date', details: utils.formatDate(Number(currentStrategy?.activation) * 1000 || 0)},
					{title: 'Since Last Harvest', details: currentStrategy?.lastReport ? utils.formatSince(Number(currentStrategy.lastReport) * 1000) : 'never'},
					{title: 'Emergency exit', details: currentStrategy?.isEmergencyExit ? 'Yes' : 'No'},
					{title: 'Active', details: currentStrategy?.isActive ? 'Yes' : 'No'},
					{title: 'Total Estimated Assets', details:utils.formatBigNumberAsAmount(currentStrategy.estimatedTotalAssets, currentVault.decimals, 4)},
					{title: 'Credit Available', details: utils.formatBigNumberAsAmount(currentStrategy.creditAvailable, currentVault.decimals, 4)},
					{title: 'Debt Outstanding ', details: utils.formatBigNumberAsAmount(currentStrategy.debtOutstanding, currentVault.decimals, 4)},
					{title: 'Debt Ratio', details: utils.formatBigNumberAsAmount(currentStrategy.debtRatio, 2, 2, '%')},
					{title: 'Total Debt', details: utils.formatBigNumberAsAmount(currentStrategy.totalDebt, currentVault.decimals, 4)},
					{title: 'Total Gain ', details: utils.formatBigNumberAsAmount(currentStrategy.totalGain, currentVault.decimals, 4)},
					{title: 'Total Loss', details: utils.formatBigNumberAsAmount(currentStrategy.totalLoss, currentVault.decimals, 4)},
					{title: 'Expected Return ', details: utils.formatBigNumberAsAmount(currentStrategy.expectedReturn, currentVault.decimals, 4)},
					{title: 'Performance Fee ', details: utils.formatBigNumberAsAmount(currentStrategy.performanceFee, 2, 2, '%')},
					{title: 'Min Debt Per Harvest ', details: utils.formatBigNumberAsAmount(currentStrategy.minDebtPerHarvest, currentVault.decimals, 4)},
					{title: 'Max Debt Per Harvest ', details: utils.formatBigNumberAsAmount(currentStrategy.maxDebtPerHarvest, currentVault.decimals, 4)},
					{title: 'Keeper', details: <AddressWithActions address={currentStrategy?.addrKeeper || ''} explorer={currentVault.explorer} />}, 
					{title: 'Rewards', details: <AddressWithActions address={currentStrategy?.addrRewards || ''} explorer={currentVault.explorer} />}, 
					{title: 'Strategist', details: <AddressWithActions address={currentStrategy?.addrStrategist || ''} explorer={currentVault.explorer} />}, 
					{title: 'Vault', details: <AddressWithActions address={currentVault?.address || ''} explorer={currentVault.explorer} />}
				]} />
		</section>
	);
});

export default SectionStats;