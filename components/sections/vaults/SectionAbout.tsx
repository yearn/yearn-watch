import	React, {ReactElement}					from	'react';
import	{ethers}								from	'ethers';
import	{TVault}								from	'contexts/useWatch.d';
import	{DescriptionList, AddressWithActions}	from	'@yearn-finance/web-lib/components';
import	{format} 								from	'@yearn-finance/web-lib/utils';

type	TSectionAbout = {currentVault: TVault};
const	SectionAbout = React.memo(function SectionAbout({currentVault}: TSectionAbout): ReactElement {
	/* 🔵 - Yearn Finance ******************************************************
	** The total asset represents the total amount of want tokens in the vault.
	** It is calculated by calling balanceOf(vault) on the token contract.
	** The value returned is a BigNumber which is converted to a human readable
	** number.
	**************************************************************************/
	function	computeTotalAssets(): number {
		return (Number(format.units((format.BN(currentVault?.tvl?.total_assets)), currentVault?.decimals || 18)));
	}

	/* 🔵 - Yearn Finance ******************************************************
	** The deposit limit represents the maximum amount of want tokens that can
	** be deposited into the vault.
	**************************************************************************/
	function	computeDepositLimit(): number {
		return (Number(format.units((format.BN(currentVault?.details?.depositLimit)), currentVault?.decimals || 18)));
	}

	/* 🔵 - Yearn Finance ******************************************************
	** The total debt represents the total amount of want tokens that are lent
	** to the strategies. This specific amount is calculated by summing the
	** total debt of each strategy. The value returned is a BigNumber which is
	** converted to a human readable number.
	**************************************************************************/
	function	computeTotalDebt(): number {
		let	totalDebt = ethers.constants.Zero;
		for (const strategy of currentVault?.strategies || []) {
			totalDebt = totalDebt.add(format.BN(strategy?.details?.totalDebt));
		}
		return format.toNormalizedValue(totalDebt, currentVault?.decimals || 18);
	}

	/* 🔵 - Yearn Finance ******************************************************
	** When harvesting, each strategy emit a report. This report can be used to
	** get some insight about the strategy and it's performance.
	** This function check all the strategies and returns the latest report.
	**************************************************************************/
	function	findLastReport(): string {
		const	lastReportedStrategy = ((currentVault?.strategies || []).sort((a, b): number => (Number(b?.details?.lastReport) || 0) - (Number(a?.details?.lastReport) || 0)))[0];
		if (lastReportedStrategy?.details?.lastReport) {
			return (format.since(Number(lastReportedStrategy?.details?.lastReport) * 1000));
		}
		return '-';
	}

	/* 🔵 - Yearn Finance ******************************************************
	** The debt ratio represents the ratio between the total debt and the
	** total assets. It's how much of the vault is in debt to strategies.
	** The value returned is a BigNumber which is converted to a human
	** readable number.
	**************************************************************************/
	function	computeTotalDebtRatio(): number {
		let	ratio = 0;
		for (const strategy of currentVault?.strategies || []) {
			ratio += (strategy?.details?.debtRatio || 0);
		}
		return ratio / 100;
	}

	return (
		<section
			aria-label={'about-vault'}
			className={'col-span-1 flex flex-col'}>
			<h4 className={'mb-4'}>{'About'}</h4>
			<AddressWithActions
				address={currentVault.address}
				truncate={0}
				className={'break-all font-mono text-sm text-neutral-500'} />

			<DescriptionList
				className={'mt-8'}
				options={[
					{
						title: 'API Version',
						details: currentVault?.version
					}, 
					{
						title: 'Emergency shut down',
						details: currentVault?.emergency_shutdown ? 'YES' : 'NO'
					}, 
					{
						title: 'Since Last Report',
						details: findLastReport()
					}, 
					{
						title: 'Management fee',
						details: `${format.amount((currentVault?.details?.managementFee || 0) / 100, 0, 2)}%`
					}, 
					{
						title: 'Performance fee',
						details: `${format.amount((currentVault?.details?.performanceFee || 0) / 100, 0, 2)}%`
					}
				]} />

			<DescriptionList
				className={'mt-8'}
				options={[
					{
						title: 'Total assets',
						details: `${format.amount(computeTotalAssets(), 4)} ${currentVault?.symbol || ''}`
					}, 
					{
						title: 'Deposit limit',
						details: `${format.amount(computeDepositLimit(), 0)} ${currentVault?.symbol || ''}`
					}
				]} />

			<DescriptionList
				className={'mt-8'}
				options={[
					{
						title: 'Total Debt',
						details: `${format.amount(computeTotalDebt(), 4)} ${currentVault?.symbol || ''}`
					}, 
					{
						title: 'Total Asset - Total Debt',
						details: `${format.amount(computeTotalAssets() - computeTotalDebt(), 4)} ${currentVault?.symbol || ''}`
					}, 
					{
						title: 'Total Debt Ratio',
						details: `${format.amount(computeTotalDebtRatio(), 2)}%`
					}
				]} />
		
			<DescriptionList
				className={'mt-8'}
				options={[
					{
						title: 'Management',
						details: <AddressWithActions address={currentVault?.details?.management} />
					}, 
					{
						title: 'Governance',
						details: <AddressWithActions address={currentVault?.details?.governance} />
					}, 
					{
						title: 'Guardian',
						details: <AddressWithActions address={currentVault?.details?.guardian} />
					}, 
					{
						title: 'Rewards',
						details: <AddressWithActions address={currentVault?.details?.rewards} />
					}
				]} />
		</section>
	);
});

export default SectionAbout;