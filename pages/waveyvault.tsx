import	React, {ReactElement}						from	'react';
import	Image										from	'next/image';
import	axios										from	'axios';
import	{Card, AddressWithActions}					from	'@yearn/web-lib/components';
import	* as utils									from	'@yearn/web-lib/utils';

/* 🔵 - Yearn Finance **********************************************************
** Main render of the WaveHealth page
******************************************************************************/
function	WaveHealth(): ReactElement {
	const [vaultData, set_vaultData] = React.useState<any[]>([]);
	const [lastUpdate, set_lastUpdate] = React.useState(0);

	async function fetchData(): Promise<void> {
		const	{data} = await axios.get('https://wavey.info:3001/position-monitor');
		set_vaultData(data.vault_data);
		set_lastUpdate(data.last_update);
	}
	React.useEffect((): void => {
		fetchData();	
	}, []);

	function rowRenderer(index: number): ReactElement {
		const vault = vaultData[index];
		return (
			<Card key={vault?.address} className={'flex flex-col px-4'} variant={'background'}>
				<div className={'flex flex-row justify-between items-center pb-4 w-full'}>
					<div className={'text-typo-secondary'}>
						<div className={'flex-row-center'}>
							{vault?.address ? (
								<Image
									decoding={'async'}
									width={40}
									height={40}
									src={`https://rawcdn.githack.com/yearn/yearn-assets/f35402d5fd225ca9f434134105e828462474a368/icons/multichain-tokens/1/${utils.toAddress(vault.address)}/logo-128.png`}
									quality={60} />
							) : <div className={'w-10 min-w-[40px] h-10 min-h-[40px] rounded-full bg-background'} />}
							<div className={'ml-2 md:ml-6'}>
								<b className={'text-ellipsis line-clamp-1'}>{`${vault?.symbol}`}</b>
								<AddressWithActions
									address={vault?.address}
									explorer={'https://etherscan/address/'}
									wrapperClassName={'flex'}
									className={'font-mono text-sm text-typo-secondary'} />
							</div>
						</div>
					</div>
				</div>
				<div className={'mt-4 space-y-2 w-full'}>
					<div className={'flex flex-row justify-between items-center'}>
						<div className={'text-sm'}>{'Total Assets'}</div>
						<div className={'text-base font-bold tabular-nums text-light-primary'}>
							{`${utils.format.amount(vault?.total_assets, 6, 6)} ${vault?.symbol}`}
						</div>
					</div>
					<div className={'flex flex-row justify-between items-center'}>
						<div className={'text-sm'}>{'Reserves'}</div>
						<div className={'text-base font-bold tabular-nums text-light-primary'}>
							{`${utils.format.amount(vault?.available_reserves, 6, 6)} ${vault?.symbol}`}
						</div>
					</div>
					<div className={'flex flex-row justify-between items-center'}>
						<div className={'text-sm'}>{'Ratio'}</div>
						<div className={'text-base font-bold tabular-nums'}>
							{`${utils.format.amount(vault?.available_reserves / vault?.total_assets, 2, 2)} %`}
						</div>
					</div>
				</div>
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
				<div className={'grid grid-cols-1 gap-4 md:grid-cols-2'}>
					{vaultData.map((_, index): ReactElement => rowRenderer(index))}
				</div>
			</Card>
		</div>
	);
}

export default WaveHealth;
