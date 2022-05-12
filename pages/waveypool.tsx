import	React, {ReactElement, ReactNode}						from	'react';
import	Image										from	'next/image';
import	axios										from	'axios';
import	{Card, StatisticCard, AddressWithActions}	from	'@yearn/web-lib/components';
import	{List}										from	'@yearn/web-lib/layouts';
import	* as utils									from	'@yearn/web-lib/utils';

/* 🔵 - Yearn Finance **********************************************************
** Main render of the WaveHealth page
******************************************************************************/
function	WaveHealth(): ReactElement {
	const [curveData, set_curveData] = React.useState<any[]>([]);
	const [balancerData, set_balancerData] = React.useState<any[]>([]);
	const [lastUpdate, set_lastUpdate] = React.useState(0);

	async function fetchData(): Promise<void> {
		const	{data} = await axios.get('https://wavey.info:3001/position-monitor');
		set_curveData(data.curve_pool_data);
		set_balancerData(data.balancer_pool_data);
		set_lastUpdate(data.last_update);
	}
	React.useEffect((): void => {
		fetchData();	
	}, []);

	function	poolToSymbol(_addr: string): ReactNode {
		if (_addr === '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022') {
			return (
				<Image
					decoding={'async'}
					width={40}
					height={40}
					src={`https://rawcdn.githack.com/yearn/yearn-assets/f35402d5fd225ca9f434134105e828462474a368/icons/multichain-tokens/1/${utils.toAddress('0xae7ab96520de3a18e5e111b5eaab095312d7fe84')}/logo-128.png`}
					quality={60} />
			);
		} else if (_addr === '0x2dded6Da1BF5DBdF597C45fcFaa3194e53EcfeAF') {
			return (
				<Image
					decoding={'async'}
					width={40}
					height={40}
					src={`https://rawcdn.githack.com/yearn/yearn-assets/f35402d5fd225ca9f434134105e828462474a368/icons/multichain-tokens/1/${utils.toAddress('0x2ba592f78db6436527729929aaf6c908497cb200')}/logo-128.png`}
					quality={60} />
			);
		} else if (_addr === '0x06Df3b2bbB68adc8B0e302443692037ED9f91b42') {
			return (
				<Image
					decoding={'async'}
					width={40}
					height={40}
					src={`https://rawcdn.githack.com/yearn/yearn-assets/f35402d5fd225ca9f434134105e828462474a368/icons/multichain-tokens/1/${utils.toAddress('0xba100000625a3754423978a60c9317c58a424e3d')}/logo-128.png`}
					quality={60} />
			);
		}
		return (<div className={'w-10 min-w-[40px] h-10 min-h-[40px] rounded-full bg-background'} />);
	}

	function rowRendererCurve(index: number): ReactElement {
		const pool = curveData[index];
		return (
			<Card key={pool.strategy_address} className={'grid grid-cols-1 gap-4 mb-6 w-[965px] md:w-full'} variant={'background'}>
				<div className={'grid relative grid-cols-22 w-full'}>
					<div className={'flex flex-row col-span-8 items-center min-w-32'}>
						<div className={'text-typo-secondary'}>
							<div className={'flex-row-center'}>
								{pool?.address ? poolToSymbol(pool?.address) : <div className={'w-10 min-w-[40px] h-10 min-h-[40px] rounded-full bg-background'} />}
								<div className={'ml-2 md:ml-6'}>
									<b className={'text-ellipsis line-clamp-1'}>{`${pool?.name}`}</b>
									<AddressWithActions
										address={pool?.address}
										explorer={'https://etherscan/address/'}
										wrapperClassName={'flex'}
										className={'font-mono text-sm text-typo-secondary'} />
								</div>
							</div>
						</div>
					</div>
				</div>
				<StatisticCard.Wrapper>
					{pool?.tokens.map((token: any, index: number): ReactElement => (
						<StatisticCard
							key={index}
							label={token?.symbol}
							value={(
								<div>
									{`${utils.format.amount(token?.balance / pool.total_assets * 100, 2, 2)} %`}
									<div className={'text-base font-normal'}>
										{`${utils.format.amount(token?.balance, 0, token?.symbol.includes('BTC') ? 2 : 0)} ${token.symbol}`}
									</div>
								</div>
							)} />
					))}
				</StatisticCard.Wrapper>
			</Card>
		);
	}

	function rowRendererBalance(index: number): ReactElement {
		const pool = balancerData[index];
		return (
			<Card key={pool.strategy_address} className={'grid grid-cols-1 gap-4 mb-6 w-[965px] md:w-full'} variant={'background'}>
				<div className={'grid relative grid-cols-22 w-full'}>
					<div className={'flex flex-row col-span-8 items-center min-w-32'}>
						<div className={'text-typo-secondary'}>
							<div className={'flex-row-center'}>
								{pool?.address ? poolToSymbol(pool?.address) : <div className={'w-10 min-w-[40px] h-10 min-h-[40px] rounded-full bg-background'} />}
								<div className={'ml-2 md:ml-6'}>
									<b className={'text-ellipsis line-clamp-1'}>{`${pool?.name}`}</b>
									<AddressWithActions
										address={pool?.address}
										explorer={'https://etherscan/address/'}
										wrapperClassName={'flex'}
										className={'font-mono text-sm text-typo-secondary'} />
								</div>
							</div>
						</div>
					</div>
				</div>
				<StatisticCard.Wrapper>
					{pool?.tokens.map((token: any, index: number): ReactElement => (
						<StatisticCard
							key={index}
							label={token?.symbol}
							value={(
								<div>
									{`${utils.format.amount(token?.balance / pool.total_assets * 100, 2, 2)} %`}
									<div className={'text-base font-normal'}>
										{`${utils.format.amount(token?.balance, 0, token?.symbol.includes('BTC') ? 2 : 0)} ${token.symbol}`}
									</div>
								</div>
							)} />
					))}
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
					<h4>{'Pools data'}</h4>
					<p className={'text-sm cursor-pointer'} onClick={fetchData}>
						{`Last update: ${utils.format.duration((lastUpdate * 1000) - Number(new Date().valueOf()), true)}`}
					</p>
				</div>
				<List>
					{curveData.map((_, index): ReactElement => rowRendererCurve(index))}
					{balancerData.map((_, index): ReactElement => rowRendererBalance(index))}
				</List>
			</Card>
		</div>
	);
}

export default WaveHealth;
