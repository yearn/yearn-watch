import	React, {ReactElement}						from	'react';
import	Image										from	'next/image';
import	axios										from	'axios';
import	{Card, StatisticCard, AddressWithActions}	from	'@yearn/web-lib/components';
import	{List}										from	'@yearn/web-lib/layouts';
import	* as utils									from	'@yearn/web-lib/utils';

/* 🔵 - Yearn Finance **********************************************************
** Main render of the WaveHealth page
******************************************************************************/
function	WaveHealth(): ReactElement {
	const [simulationData, set_simulationData] = React.useState<any[]>([]);
	const [lastUpdate, set_lastUpdate] = React.useState(0);

	async function fetchData(): Promise<void> {
		const	{data} = await axios.get('https://wavey.info:3001/position-monitor');
		console.log(data);
		set_simulationData(data.simulation_data);
		set_lastUpdate(data.last_update);
	}
	React.useEffect((): void => {
		fetchData();	
	}, []);

	function rowRenderer(index: number): ReactElement {
		const strategy = simulationData[index];
		const	maxRatioReduc = (strategy?.max_ratio_reduction || 0) * -1;
		return (
			<Card key={strategy.strategy_address} className={'grid grid-cols-1 gap-4 mb-6 w-full'} variant={'background'}>
				<div className={'grid relative grid-cols-12 w-full'}>
					<div className={'flex flex-row col-span-12 items-center min-w-32'}>
						<div className={'text-typo-secondary'}>
							<div className={'flex-row-center'}>
								{strategy?.vault_address ? <Image
									alt={`token ${strategy?.vault_symbol}`}
									decoding={'async'}
									width={40}
									height={40}
									src={`https://rawcdn.githack.com/yearn/yearn-assets/f35402d5fd225ca9f434134105e828462474a368/icons/multichain-tokens/1/${utils.toAddress(strategy.vault_address)}/logo-128.png`}
									quality={60} /> : <div className={'w-10 min-w-[40px] h-10 min-h-[40px] rounded-full bg-background'} />}
								<div className={'ml-2 md:ml-6'}>
									<b className={'text-ellipsis line-clamp-1'}>{`${strategy.strategy_name} - (${strategy.vault_symbol})`}</b>
									<AddressWithActions
										address={strategy.strategy_address}
										explorer={'https://etherscan.io'}
										wrapperClassName={'flex'}
										className={'font-mono text-sm text-typo-secondary'} />
								</div>
							</div>
						</div>
					</div>
				</div>
				<StatisticCard.Wrapper>
					<StatisticCard
						label={'Debt Payment'}
						value={(
							<div>
								{utils.format.amount(strategy.debt_payment, 0, strategy?.vault_symbol.includes('BTC') ? 2 : 0)}
								<p className={'text-sm font-normal'}>
									{`${utils.format.amount(strategy?.debt_payment_usd, 2, 2)} $`}
								</p>
							</div>
						)} />
					<StatisticCard
						label={'Max No Loss Ratio'}
						value={(
							<div>
								{`${utils.format.amount(strategy.max_no_loss_ratio / 100, 2, 2)}%`}
								<p className={`text-sm tabular-nums font-normal ${maxRatioReduc <= 0 ? 'text-primary' : 'text-alert-critical-primary'}`}>
									{`${maxRatioReduc > 0 ? '+' : ''}${utils.format.amount(maxRatioReduc / 100, 2, 2) || '-'}%`}
								</p>
							</div>
						)} />
					<StatisticCard
						label={'Current Ratio'}
						value={`${utils.format.amount(strategy.current_ratio / 100, 2, 2)}%`} />
					<StatisticCard
						label={'Profit - Loss'}
						value={`${utils.format.amount((strategy?.profit || 0) - (strategy?.loss || 0), 0, strategy?.vault_symbol.includes('BTC') ? 2 : 0)}`} />
					<StatisticCard
						label={'Debt Before'}
						value={(
							<div>
								{utils.format.amount(strategy.strategy_debt_before, 0, strategy?.vault_symbol.includes('BTC') ? 2 : 0)}
								<p className={'text-sm font-normal'}>
									{`${utils.format.amount(strategy?.strategy_debt_before_usd, 2, 2)} $`}
								</p>
							</div>
						)} />
					<StatisticCard
						label={'Debt After'}
						value={(
							<div>
								{utils.format.amount(strategy.strategy_debt_after, 0, strategy?.vault_symbol.includes('BTC') ? 2 : 0)}
								<p className={'text-sm font-normal'}>
									{`${utils.format.amount(strategy?.strategy_debt_after_usd, 2, 2)} $`}
								</p>
							</div>
						)} />
				</StatisticCard.Wrapper>
			</Card>
		);
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'space-y-4 flex-col-full'}>
			<Card className={'flex flex-col space-y-4 w-full'}>
				<div className={'flex justify-between items-center pb-6'}>
					<h4>{'Simulations data'}</h4>
					<p className={'text-sm cursor-pointer'} onClick={fetchData}>
						{`Last update: ${utils.format.duration((lastUpdate * 1000) - Number(new Date().valueOf()), true)}`}
					</p>
				</div>
				<List>
					{simulationData.map((_, index): ReactElement => rowRenderer(index))}
				</List>
			</Card>
		</div>
	);
}

export default WaveHealth;
