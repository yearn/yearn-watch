import	React, {MouseEvent, ReactElement}	from	'react';
import	Link								from	'next/link';
import	{TStrategy}							from	'contexts/useYearn';
import	* as utils							from	'utils';
import	AddressWithActions					from	'@lib/AddressWithActions';
import	Card								from	'@lib/Card';
import	StatisticCard						from	'@lib/StatisticCard';

type 		TStrategyBox = {strategy: TStrategy, symbol: string, decimals: number, vaultAddress: string, vaultExplorer: string}
function	StrategyBox({strategy, symbol, decimals, vaultAddress, vaultExplorer}: TStrategyBox): ReactElement {
	return (
		<Card backgroundColor={'bg-background'} className={'mb-4'}>
			<div className={'flex flex-row justify-between items-center'}>
				<div>
					<b className={'mb-2 text-base text-typo-primary'}>{strategy.name}</b>
					<p className={'text-xs text-typo-secondary'}>
						{`Last report: ${strategy?.lastReport ? utils.formatSince(Number(strategy.lastReport) * 1000) : 'never'}`}
					</p>
				</div>
				<div className={'flex flex-row items-center'}>
					<AddressWithActions
						address={strategy.address}
						explorer={vaultExplorer}
						className={'font-mono text-sm text-typo-secondary'} />
					<div onClick={(e: MouseEvent): void => e.stopPropagation()}>
						<Link href={`/vault/${vaultAddress}/${strategy.address}`}>
							<button className={'mr-10 ml-6 min-w-[132px] button button-outline'}>
								{'Details'}
							</button>
						</Link>
					</div>
				</div>
			</div>
			<div className={'my-6 w-3/4'}>
				<p
					className={'text-sm text-typo-primary'}
					dangerouslySetInnerHTML={{__html: utils.parseMarkdown((strategy?.description || '').replace(/{{token}}/g, symbol) || '')}} />
			</div>
			<div className={'grid grid-cols-3 gap-4'}>
				<StatisticCard
					label={'Total debt'}
					value={utils.formatBigNumberAsAmount(strategy.totalDebt, decimals, 5)} />
				<StatisticCard
					label={'Debt ratio'}
					value={utils.formatBigNumberAsAmount(strategy.debtRatio, 2, 2, '%')} />
				<StatisticCard
					label={'Average APR'}
					value={`${utils.formatAmount((strategy?.apr || 0) * 100, 2)}%`} />
				<StatisticCard
					label={'Credit available'}
					value={utils.formatBigNumberAsAmount(strategy.creditAvailable, decimals, 4)} />
				<StatisticCard
					label={'Total Estimated Assets'}
					value={utils.formatBigNumberAsAmount(strategy.estimatedTotalAssets, decimals, 4)} />
				<StatisticCard
					label={'Index'}
					value={utils.formatAmount((strategy?.index === 21 ? -1 : strategy?.index || 0))} />
			</div>
		</Card>
	);
}

export default StrategyBox;