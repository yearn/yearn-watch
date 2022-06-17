import	React, {MouseEvent, ReactElement}					from	'react';
import	Link												from	'next/link';
import	{TStrategy}											from	'contexts/useWatch.d';
import	{StatisticCard, Card, Button, AddressWithActions}	from	'@yearn-finance/web-lib/components';
import	* as utils											from	'@yearn-finance/web-lib/utils';

type 		TStrategyBox = {strategy: TStrategy, symbol: string, decimals: number, vaultAddress: string, vaultExplorer: string}
function	StrategyBox({strategy, symbol, decimals, vaultAddress, vaultExplorer}: TStrategyBox): ReactElement {
	return (
		<Card variant={'background'} className={'mb-4'}>
			<div className={'justify-between md:items-center flex-row-start'}>
				<div>
					<b className={'mb-2'}>{strategy.name}</b>
					<p className={'text-xs text-neutral-500'}>
						{`Last report: ${strategy?.lastReport ? utils.format.since(Number(strategy.lastReport) * 1000) : 'never'}`}
					</p>
					<AddressWithActions
						address={strategy.address}
						explorer={vaultExplorer}
						truncate={3}
						wrapperClassName={'flex md:hidden mt-2'}
						className={'font-mono text-sm text-neutral-500'} />
				</div>
				<div className={'flex-row-center'}>
					<AddressWithActions
						address={strategy.address}
						explorer={vaultExplorer}
						wrapperClassName={'hidden md:flex'}
						className={'font-mono text-sm text-neutral-500'} />
					<div onClick={(e: MouseEvent): void => e.stopPropagation()}>
						<Link passHref href={`/vault/${vaultAddress}/${strategy.address}`}>
							<Button
								as={'a'}
								variant={'outlined'}
								className={'mx-0 min-w-fit md:mr-10 md:ml-6 md:min-w-[132px]'}>
								<span className={'sr-only'}>{'Access details about this strategy'}</span>
								{'Details'}
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<div className={'my-6 w-full md:w-3/4'}>
				<p
					className={'text-sm'}
					dangerouslySetInnerHTML={{__html: utils.parseMarkdown((strategy?.description || '').replace(/{{token}}/g, symbol) || '')}} />
			</div>
			<StatisticCard.Wrapper>
				<StatisticCard
					label={'Total debt'}
					className={'col-span-12 md:col-span-4'}
					value={utils.format.bigNumberAsAmount(strategy.totalDebt, decimals, 5)} />
				<StatisticCard
					label={'Credit available'}
					className={'col-span-12 md:col-span-4'}
					value={utils.format.bigNumberAsAmount(strategy.creditAvailable, decimals, 4)} />
				<StatisticCard
					label={'Total Estimated Assets'}
					className={'col-span-12 md:col-span-4'}
					value={utils.format.bigNumberAsAmount(strategy.estimatedTotalAssets, decimals, 4)} />
				<StatisticCard
					className={'col-span-6 md:col-span-4'}
					label={'Debt ratio'}
					value={utils.format.bigNumberAsAmount(strategy.debtRatio, 2, 2, '%')} />
				<StatisticCard
					className={'col-span-6 md:col-span-4'}
					label={'Average APR'}
					value={`${utils.format.amount((strategy?.apr || 0) * 100, 2)}%`} />
				<StatisticCard
					className={'col-span-6 md:col-span-4'}
					label={'Index'}
					value={utils.format.amount((strategy?.index === 21 ? -1 : strategy?.index || 0), 0, 0)} />
			</StatisticCard.Wrapper>
		</Card>
	);
}

export default StrategyBox;