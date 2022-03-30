import	React, {ReactElement}					from	'react';
import	{BigNumber}								from	'ethers';
import	{TVault, TStrategy}						from	'contexts/useWatch';
import	{DescriptionList, AddressWithActions}	from	'@majorfi/web-lib/components';
import	{format} 								from	'@majorfi/web-lib/utils';

type	TSectionAbout = {currentVault: TVault};
const	SectionAbout = React.memo(function SectionAbout({currentVault}: TSectionAbout): ReactElement {
	/* 🔵 - Yearn Finance ******************************************************
	** The total asset represents the total amount of want tokens in the vault.
	** It is calculated by calling balanceOf(vault) on the token contract.
	** The value returned is a BigNumber which is converted to a human readable
	** number.
	**************************************************************************/
	function	computeTotalAssets(): number {
		return (Number(format.units((currentVault?.balanceTokens) || 0, currentVault?.decimals || 18)));
	}

	/* 🔵 - Yearn Finance ******************************************************
	** The total debt represents the total amount of want tokens that are lent
	** to the strategies. This specific amount is calculated by summing the
	** total debt of each strategy. The value returned is a BigNumber which is
	** converted to a human readable number.
	**************************************************************************/
	function	computeTotalDebt(): number {
		return (
			Number(format.units(
				(currentVault?.strategies?.reduce((acc: BigNumber, strategy: TStrategy): BigNumber => acc.add(strategy.totalDebt), BigNumber.from(0)) || 0),
				currentVault?.decimals || 18
			))
		);
	}

	/* 🔵 - Yearn Finance ******************************************************
	** When harvesting, each strategy emit a report. This report can be used to
	** get some insight about the strategy and it's performance.
	** This function check all the strategies and returns the latest report.
	**************************************************************************/
	function	findLastReport(): string {
		const	lastReportedStrategy = ((currentVault?.strategies || []).sort((a, b): number => (Number(b.lastReport) || 0) - (Number(a.lastReport) || 0)))[0];
		if (lastReportedStrategy?.lastReport) {
			return (format.since(Number(lastReportedStrategy.lastReport) * 1000));
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
		return (
			Number(format.units(
				(currentVault?.strategies?.reduce((acc: BigNumber, strategy: TStrategy): BigNumber => acc.add(strategy.debtRatio), BigNumber.from(0)) || 0),
				2
			))
		);
	}

	return (
		<section aria-label={'about-vault'} className={'flex flex-col col-span-1'}>
			<h4 className={'mb-4'}>{'About'}</h4>
			<AddressWithActions
				address={currentVault.address}
				explorer={currentVault.explorer}
				truncate={0}
				className={'font-mono text-sm text-typo-secondary-variant'} />

			<DescriptionList
				className={'mt-8'}
				options={[
					{title: 'API Version', details: currentVault?.version}, 
					{title: 'Emergency shut down', details: currentVault?.emergency_shutdown ? 'YES' : 'NO'}, 
					{title: 'Since Last Report', details: findLastReport()}, 
					{title: 'Management fee', details: format.bigNumberAsAmount(currentVault.managementFeeBps, 2, 2, '%')}, 
					{title: 'Performance fee', details: format.bigNumberAsAmount(currentVault.performanceFeeBps, 2, 2, '%')}
				]} />

			<DescriptionList
				className={'mt-8'}
				options={[
					{title: 'Total assets', details: format.bigNumberAsAmount(currentVault.balanceTokens, currentVault.decimals, 4, currentVault.symbol)}, 
					{title: 'Deposit limit', details: format.bigNumberAsAmount(currentVault.depositLimit, currentVault.decimals, 4, currentVault.symbol)}
				]} />

			<DescriptionList
				className={'mt-8'}
				options={[
					{title: 'Total Debt', details: `${format.amount(computeTotalDebt(), 4)} ${currentVault?.symbol || ''}`}, 
					{title: 'Total Asset - Total Debt', details: `${format.amount(computeTotalAssets() - computeTotalDebt(), 4)} ${currentVault?.symbol || ''}`}, 
					{title: 'Total Debt Ratio', details: `${format.amount(computeTotalDebtRatio(), 4)}%`}
				]} />
		
			<DescriptionList
				className={'mt-8'}
				options={[
					{title: 'Management', details: <AddressWithActions address={currentVault?.management} explorer={currentVault.explorer} />}, 
					{title: 'Governance', details: <AddressWithActions address={currentVault?.governance} explorer={currentVault.explorer} />}, 
					{title: 'Guardian', details: <AddressWithActions address={currentVault?.guardian} explorer={currentVault.explorer} />}, 
					{title: 'Rewards', details: <AddressWithActions address={currentVault?.rewards} explorer={currentVault.explorer} />}
				]} />
		</section>
	);
});

export default SectionAbout;