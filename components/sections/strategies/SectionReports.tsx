import React, {ReactElement, memo} from 'react';
import axios from 'axios';
import useSWR from 'swr';
import {useWeb3} from '@yearn-finance/web-lib/contexts';
import {Card, StatisticCard, TxHashWithActions} from '@yearn-finance/web-lib/components';
import {format}  from '@yearn-finance/web-lib/utils';
import {TStrategy, TStrategyReport, TVault} from 'contexts/useWatch.d';
import {useSettings} from '@yearn-finance/web-lib/contexts';

const fetcher = async (url: string): Promise<TStrategyReport[]> => axios.get(url).then((res): TStrategyReport[] => res.data);

type	TSectionReports = {currentVault: TVault, currentStrategy: TStrategy | undefined};
const	SectionReports = memo(
	function SectionReports({currentVault, currentStrategy}: TSectionReports): ReactElement {
		const	{chainID} = useWeb3();
		const 	{settings: baseAPISettings} = useSettings();
		const	{data: allReports} = useSWR(`${baseAPISettings.yDaemonBaseURI}/${chainID}/reports/${currentStrategy?.address}`, fetcher);

		function	computeAverageAPR(reports: TStrategyReport[]): number {
			const	totalAPR = reports.reduce((acc, curr): number => acc + Number(curr?.results?.[0]?.APR || 0), 0);
			const	numberOfReports = reports.length || 1;
			return totalAPR / numberOfReports * 100;
		}
		function	computeMedianAPR(reports: TStrategyReport[]): number {
			const	allAPRs = reports.map((v): number => Number(v?.results?.[0]?.APR || 0) * 100);
			if (allAPRs.length === 0)
				return (0);
			allAPRs.sort((a, b): number => a - b);
			const	middle = Math.floor(allAPRs.length / 2);
			if (allAPRs.length % 2)
				return allAPRs[middle];
			return (allAPRs[middle - 1] + allAPRs[middle]) / 2;
		}

		if (!currentStrategy || !allReports)
			return <div />;

		return (
			<section
				aria-label={'reports-of-strategy'}
				className={'flex w-full flex-col'}>
				<div className={'mb-6 grid w-full grid-cols-2 gap-4 md:grid-cols-3 md:gap-8'}>
					<div className={'col-span-1 text-left md:text-center'}>
						<b className={'text-base md:text-lg'}>{'Last 10 reports'}</b>
					</div>
					<div className={'col-span-1 text-left md:text-center'}>
						<b className={'text-base md:text-lg'}>
							{`Average APR: ${format.amount(computeAverageAPR(allReports || []))}%`}
						</b>
					</div>
					<div className={'col-span-1 text-left md:text-center'}>
						<b className={'text-base md:text-lg'}>
							{`Median APR: ${format.amount(computeMedianAPR(allReports || []))}%`}
						</b>
					</div>
				</div>
				<div className={'flex flex-col space-y-4'}>
					{
						(allReports || [])
							.sort((a, b): number => Number(b.timestamp) - Number(a.timestamp))
							.map((report): ReactElement => (
								<Card.Detail
									key={report.id}
									variant={'background'}
									isSticky={false}
									summary={(p: unknown[]): ReactElement => (
										<Card.Detail.Summary
											startChildren={(
												<div>
													<TxHashWithActions
														txHash={report?.id.split('-')[0]}
														className={'font-mono font-bold'} />
													<p className={'mt-2 block text-neutral-500'}>
														{format.date(Number(report?.timestamp || 0))}
													</p>
												</div>
											)}
											{...p} />
									)}>
									<StatisticCard.Wrapper>
										<StatisticCard
											className={'col-span-12 md:col-span-3'}
											label={`Debt Added (${currentVault.symbol})`}
											value={format.bigNumberAsAmount(format.BN(report?.debtAdded), currentVault.decimals, 4, '')} />
										<StatisticCard
											className={'col-span-12 md:col-span-3'}
											label={'Debt Limit'}
											value={format.bigNumberAsAmount(format.BN(report?.debtLimit), 2, 4, '%')} />
										<StatisticCard
											className={'col-span-12 md:col-span-6'}
											label={`Total Debt (${currentVault.symbol})`}
											value={format.bigNumberAsAmount(format.BN(report?.totalDebt), currentVault.decimals, 4, '')} />

										<StatisticCard
											className={'col-span-12 md:col-span-3'}
											label={`Profit (${currentVault.symbol})`}
											value={format.bigNumberAsAmount(format.BN(report?.gain), currentVault.decimals, 4, '')} />
										<StatisticCard
											className={'col-span-12 md:col-span-3'}
											label={`Total Profit (${currentVault.symbol})`}
											value={format.bigNumberAsAmount(format.BN(report?.totalGain), currentVault.decimals, 4, '')} />
										<StatisticCard
											className={'col-span-12 md:col-span-3'}
											label={`Loss (${currentVault.symbol})`}
											value={format.bigNumberAsAmount(format.BN(report?.loss), currentVault.decimals, 4, '')} />
										<StatisticCard
											className={'col-span-12 md:col-span-3'}
											label={`Total Loss (${currentVault.symbol})`}
											value={format.bigNumberAsAmount(format.BN(report?.totalLoss), currentVault.decimals, 4, '')} />

										<StatisticCard
											className={'col-span-12 md:col-span-3'}
											label={'Duration'}
											value={format.duration(Number(report?.results?.[0]?.duration || 0))} />
										<StatisticCard
											className={'col-span-12 md:col-span-3'}
											label={'Duration PR'}
											value={`${format.amount(Number((report?.results?.[0]?.durationPR || 0)), 2)}%`} />
										<StatisticCard
											className={'col-span-12 md:col-span-3'}
											label={'APR'}
											value={`${format.amount(Number((Number(report?.results?.[0]?.APR || 0) * 100)), 2)}%`} />
										<StatisticCard
											className={'col-span-12 md:col-span-3'}
											label={'Debt Paid'}
											value={format.bigNumberAsAmount(format.BN(report?.debtPaid), currentVault.decimals, 4, '')} />
									</StatisticCard.Wrapper>
								</Card.Detail>
							))
					}
				</div>
			</section>
		);
	}
);

export default SectionReports;