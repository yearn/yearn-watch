import	React, {ReactElement}						from	'react';
import	{TVault, TStrategy, TStrategyReport}		from	'contexts/useWatch';
import	{Card, TxHashWithActions, StatisticCard}	from	'@majorfi/web-lib/components';
import	{format} 									from	'@majorfi/web-lib/utils';

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
				<b className={'text-lg text-typo-primary'}>{`Average APR: ${format.amount(computeAverageAPR(currentStrategy?.reports || []))}%`}</b>
				<b className={'text-lg text-typo-primary'}>{`Median APR: ${format.amount(computeMedianAPR(currentStrategy?.reports || []))}%`}</b>
			</span>
			<div className={'flex flex-col space-y-4'}>
				{
					(currentStrategy?.reports || [])
						.sort((a, b): number => Number(b.timestamp) - Number(a.timestamp))
						.map((report): ReactElement => (
							<Card.Detail
								key={report.id}
								isSticky={false}
								summary={(p: unknown): ReactElement => (
									<Card.Detail.Summary
										startChildren={(
											<div>
												<TxHashWithActions
													txHash={report?.id.split('-')[0]}
													explorer={currentVault.explorer}
													className={'font-mono font-bold text-typo-primary'} />
												<p className={'block mt-2 text-typo-secondary-variant'}>
													{format.date(Number(report?.timestamp || 0))}
												</p>
											</div>
										)}
										{...p} />
								)}>
								<StatisticCard.Wrapper cols={{mobile: 4, desktop: 4}}>
									<StatisticCard
										cols={{mobile: 1, desktop: 1}}
										label={`Dept Added (${currentVault.symbol})`}
										value={format.bigNumberAsAmount(report?.debtAdded, currentVault.decimals, 4, '')} />
									<StatisticCard
										cols={{mobile: 1, desktop: 1}}
										label={'Dept Limit'}
										value={format.bigNumberAsAmount(report?.debtLimit, 2, 4, '%')} />
									<StatisticCard
										cols={{mobile: 1, desktop: 2}}
										className={'col-span-2'}
										label={`Total Dept (${currentVault.symbol})`}
										value={format.bigNumberAsAmount(report?.totalDebt, currentVault.decimals, 4, '')} />

									<StatisticCard
										cols={{mobile: 1, desktop: 1}}
										label={`Profit (${currentVault.symbol})`}
										value={format.bigNumberAsAmount(report?.gain, currentVault.decimals, 4, '')} />
									<StatisticCard
										cols={{mobile: 1, desktop: 1}}
										label={`Total Profit (${currentVault.symbol})`}
										value={format.bigNumberAsAmount(report?.totalGain, currentVault.decimals, 4, '')} />
									<StatisticCard
										cols={{mobile: 1, desktop: 1}}
										label={`Loss (${currentVault.symbol})`}
										value={format.bigNumberAsAmount(report?.loss, currentVault.decimals, 4, '')} />
									<StatisticCard
										cols={{mobile: 1, desktop: 1}}
										label={`Total Loss (${currentVault.symbol})`}
										value={format.bigNumberAsAmount(report?.totalLoss, currentVault.decimals, 4, '')} />

									<StatisticCard
										cols={{mobile: 1, desktop: 1}}
										label={'Duration'}
										value={format.duration(Number(report?.duration))} />
									<StatisticCard
										cols={{mobile: 1, desktop: 1}}
										label={'Duration PR'}
										value={`${format.amount(Number(report?.durationPR.toFixed(4)), 2)}%`} />
									<StatisticCard
										cols={{mobile: 1, desktop: 1}}
										label={'APR'}
										value={`${format.amount(Number((report?.apr * 100).toFixed(4)), 2)}%`} />
									<StatisticCard
										cols={{mobile: 1, desktop: 1}}
										label={'Dept Paid'}
										value={format.bigNumberAsAmount(report?.debtPaid, currentVault.decimals, 4, '')} />
								</StatisticCard.Wrapper>
							</Card.Detail>
						))
				}
			</div>
		</section>
	);
});

export default SectionReports;