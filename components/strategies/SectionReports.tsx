import	React, {ReactElement}						from	'react';
import	{TVault, TStrategy, TStrategyReport}		from	'contexts/useYearn';
import	* as utils									from	'utils';
import	TxHashWithActions							from	'@lib/TxHashWithActions';
import	StatisticCard								from	'@lib/StatisticCard';
import	Details										from	'@lib/Details';

type	TSectionReports = {currentVault: TVault, currentStrategy: TStrategy | undefined};
const	SectionReports = React.memo(function SectionReports({currentVault, currentStrategy}: TSectionReports): ReactElement {
	function	computeAverageAPR(reports: TStrategyReport[]): number {
		const	totalAPR = reports.reduce((acc, curr): number => acc + curr.apr, 0);
		const	numberOfReports = reports.length || 1;
		return totalAPR / numberOfReports * 100;
	}
	function	computeMedianAPR(reports: TStrategyReport[]): number {
		const	allAPRs = reports.map((v): number => Number(v.apr) * 100);
		allAPRs.sort((a, b): number => a - b);
		const	middle = Math.floor(allAPRs.length / 2);
		if (allAPRs.length % 2)
			return allAPRs[middle];
		return (allAPRs[middle - 1] + allAPRs[middle]) / 2;
	}

	if (!currentStrategy)
		return <div />;
	return (
		<section aria-label={'reports-of-strategy'} className={'flex flex-col col-span-2 w-full'}>
			<span className={'flex flex-row items-center mb-6 space-x-8 w-full'}>
				<b className={'text-lg text-typo-primary'}>{'Last 10 reports'}</b>
				<b className={'text-lg text-typo-primary'}>{`Average APR: ${utils.formatAmount(computeAverageAPR(currentStrategy.reports))}%`}</b>
				<b className={'text-lg text-typo-primary'}>{`Median APR: ${utils.formatAmount(computeMedianAPR(currentStrategy.reports))}%`}</b>
			</span>
			<div className={'flex flex-col space-y-4'}>
				{
					currentStrategy?.reports
						.sort((a, b): number => Number(b.timestamp) - Number(a.timestamp))
						.map((report): ReactElement => (
							<Details
								key={report.id}
								summary={(p: unknown): ReactElement => (
									<Details.Summary
										startChildren={(
											<div>
												<TxHashWithActions
													txHash={report?.id.split('-')[0]}
													explorer={currentVault.explorer}
													className={'font-mono font-bold text-typo-primary'} />
												<p className={'block mt-2 text-typo-secondary-variant'}>
													{utils.formatDate(Number(report?.timestamp || 0))}
												</p>
											</div>
										)}
										{...p} />
								)}>
								<div className={'grid grid-cols-4 gap-4'}>
									<StatisticCard
										label={`Dept Added (${currentVault.symbol})`}
										value={utils.formatBigNumberAsAmount(report?.debtAdded, currentVault.decimals, 4, '')} />
									<StatisticCard
										label={'Dept Limit'}
										value={utils.formatBigNumberAsAmount(report?.debtLimit, 2, 4, '%')} />
									<StatisticCard
										className={'col-span-2'}
										label={`Total Dept (${currentVault.symbol})`}
										value={utils.formatBigNumberAsAmount(report?.totalDebt, currentVault.decimals, 4, '')} />

									<StatisticCard
										label={`Profit (${currentVault.symbol})`}
										value={utils.formatBigNumberAsAmount(report?.gain, currentVault.decimals, 4, '')} />
									<StatisticCard
										label={`Total Profit (${currentVault.symbol})`}
										value={utils.formatBigNumberAsAmount(report?.totalGain, currentVault.decimals, 4, '')} />
									<StatisticCard
										label={`Loss (${currentVault.symbol})`}
										value={utils.formatBigNumberAsAmount(report?.loss, currentVault.decimals, 4, '')} />
									<StatisticCard
										label={`Total Loss (${currentVault.symbol})`}
										value={utils.formatBigNumberAsAmount(report?.totalLoss, currentVault.decimals, 4, '')} />

									<StatisticCard
										label={'Duration'}
										value={utils.formatDuration(Number(report?.duration))} />
									<StatisticCard
										label={'Duration PR'}
										value={`${utils.formatAmount(Number(report?.durationPR.toFixed(4)), 2)}%`} />
									<StatisticCard
										label={'APR'}
										value={`${utils.formatAmount(Number((report?.apr * 100).toFixed(4)), 2)}%`} />
									<StatisticCard
										label={'Dept Paid'}
										value={utils.formatBigNumberAsAmount(report?.debtPaid, currentVault.decimals, 4, '')} />
								</div>
							</Details>
						))
				}
			</div>
		</section>
	);
});

export default SectionReports;