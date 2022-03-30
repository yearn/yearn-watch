import	React, {MouseEvent, ReactElement} 								from	'react';
import	Link															from	'next/link';
import	Image															from	'next/image';
import	useWatch, {TStrategy}											from	'contexts/useWatch';
import	{Card, AddressWithActions, StatisticCard, Switch, SearchBox}	from	'@majorfi/web-lib/components';
import	* as utils														from	'@majorfi/web-lib/utils';

function	Index(): ReactElement {
	const	{vaults} = useWatch();
	const	[filteredStrategies, set_filteredStrategies] = React.useState([] as TStrategy[]);
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[isOnlyWithTvl, set_isOnlyWithTvl] = React.useState(true);

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	**************************************************************************/
	React.useEffect((): void => {
		const	_vaults = vaults;
		let		_filteredVaults = [..._vaults];
		const	_filteredStrategies = [];

		if (searchTerm.length > 0) {
			_filteredVaults = _filteredVaults.filter((vault): boolean => {
				return (
					(vault?.display_name || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.symbol || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.token?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.token?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.token?.display_name || '').toLowerCase().includes(searchTerm.toLowerCase())
					|| (vault?.strategies || []).some((strategy): boolean => {
						return (
							(strategy?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
							|| (strategy?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
							|| (strategy?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
						);
					})
				);
			});
		}

		for (const vault of _filteredVaults) {
			for (const strategy of vault.strategies) {
				const	shouldDoHealtcheck = strategy.shouldDoHealthCheck;
				const	hasValidHealtcheckAddr = !utils.isZeroAddress(strategy.addrHealthCheck);

				if (shouldDoHealtcheck || hasValidHealtcheckAddr || (strategy?.totalDebt.isZero() && isOnlyWithTvl))
					continue;
				_filteredStrategies.push(strategy);
			}
		}
		set_filteredStrategies(_filteredStrategies);
	}, [vaults, searchTerm, isOnlyWithTvl]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'w-full'}>
			<div className={'flex flex-col p-6 mb-4 rounded-lg border-2 text-primary bg-secondary border-primary'}>
				<h4 className={'mb-6 text-primary'}>{'Alerts and warnings'}</h4>
				<p>{'The healthchecks have been added since v0.4.2 for the Yearn\'s strategies in order to ensure that they are working properly. The healthchecks are automatically triggered on harvest if the doHealthCheck parameter is enabled, and if a valid address for this check is set. The strategies missing one of theses parameters will be displayed bellow.'}</p>
				<p className={'block mt-4'}>{'Based on the Total Value Locked (TVL) in the strategy, a Risk score, from 5 (most risky) to 1 (least risky), is computed.'}</p>
			</div>

			<div className={'flex flex-col-reverse mb-5 space-x-0 md:flex-row md:space-x-4'}>
				<div className={'flex flex-col mt-2 space-y-2 w-full md:mt-0'}>
					<SearchBox searchTerm={searchTerm} set_searchTerm={set_searchTerm} />
					<div className={'flex flex-row items-center'}>
						<p className={'text-xs text-typo-secondary'}>{`Strategies Found: ${filteredStrategies.length}`}</p>
					</div>
				</div>
				<div>
					<Card isNarrow>
						<label className={'flex flex-row justify-between p-2 space-x-6 w-full cursor-pointer md:p-0 md:w-max'}>
							<p className={'text-typo-primary'}>{'Hide vaults with no TVL'}</p>
							<Switch isEnabled={isOnlyWithTvl} set_isEnabled={set_isOnlyWithTvl} />
						</label>
					</Card>
				</div>
			</div>

			<Card.List className={'flex flex-col space-y-4 w-full'}>
				{
					filteredStrategies
						.sort((a, b): number => b.totalDebtUSDC - a.totalDebtUSDC)
						.map((strategy): ReactElement => (
							<div key={strategy.address}>
								<Card>
									<div className={'flex flex-col w-full'}>
										<div className={'flex flex-col justify-between items-start w-full md:flex-row md:items-center'}>
											<div className={'w-full'}>
												<div className={'flex flex-row items-start'}>
													<Image width={40} height={40} src={strategy.vault?.icon || ''} quality={90} />
													<div className={'ml-2 md:ml-6'}>
														<b className={'text-base text-typo-primary'}>{`${strategy.display_name} (${strategy.name})`}</b>
														<p className={'text-xs text-typo-secondary'}>{strategy.vault?.name}</p>
													</div>
												</div>
											</div>
											<div className={'flex flex-row justify-end items-center mt-4 w-full md:mt-0'}>
												<AddressWithActions
													address={strategy.address}
													explorer={strategy.vault.explorer}
													wrapperClassName={'hidden md:flex'}
													className={'font-mono text-sm text-typo-secondary'} />
												<div onClick={(e: MouseEvent): void => e.stopPropagation()}>
													<Link href={`/vault/${strategy.vault.address}`}>
														<button className={'ml-0 min-w-[132px] md:ml-6 button button-outline'}>
															{'Details'}
														</button>
													</Link>
												</div>
											</div>
										</div>
										<div className={'mt-8'}>
											<StatisticCard.Wrapper>
												<StatisticCard
													backgroundColor={'bg-background'}
													label={'Activation'}
													value={utils.format.date(Number(strategy.activation) * 1000)} />
												<StatisticCard
													backgroundColor={'bg-background'}
													label={'Total USDC Value Locked'}
													value={utils.format.amount(strategy.totalDebtUSDC, 4)} />
												<StatisticCard
													backgroundColor={'bg-background'}
													label={'Risk Factor'}
													value={String(strategy.tvlImpact)} />
											</StatisticCard.Wrapper>
										</div>
									</div>
								</Card>
							</div>
						))
				}
			</Card.List>
		</div>
	);
}

export default Index;
