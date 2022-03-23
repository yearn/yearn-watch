import	React, {MouseEvent, ReactElement}	from	'react';
import	Link								from	'next/link';
import	Image								from	'next/image';
import	useYearn, {TVault}					from	'contexts/useYearn';
import	StrategyBox							from	'components/vaults/StrategyBox';
import	Card								from	'@lib/Card';
import	SearchCard							from	'@lib/SearchCard';
import	Switch								from	'@lib/Switch';
import	AddressWithActions					from	'@lib/AddressWithActions';
import	Details								from	'@lib/Details';
import	IconWarning							from	'@icons/IconWarning';

type 		TVaultBox = {vault: TVault}

const VaultBox = React.memo(function VaultBox({vault}: TVaultBox): ReactElement {
	function	renderSummaryStart(): ReactElement {
		return (
			<div className={'flex flex-row items-start'}>
				<Image width={40} height={40} src={vault.icon} quality={90} />
				<div className={'ml-6'}>
					<b className={'text-base text-typo-primary'}>{vault.display_name}</b>
					<p className={'text-xs text-typo-secondary'}>
						{(vault.strategies).length > 1 ? `${(vault.strategies).length} strats` : `${(vault.strategies).length} strat`}
					</p>
				</div>
			</div>
		);
	}
	function	renderSummaryEnd(): ReactElement {
		return (
			<React.Fragment>
				<AddressWithActions
					address={vault.address}
					explorer={vault.explorer}
					className={'font-mono text-sm text-typo-secondary'} />
				<div onClick={(e: MouseEvent): void => e.stopPropagation()}>
					<Link href={`/vault/${vault.address}`}>
						<button className={'mr-10 ml-6 min-w-[132px] button button-outline'}>
							{'Details'}
						</button>
					</Link>
				</div>
			</React.Fragment>
		);
	}

	return (
		<Details
			backgroundColor={'bg-surface'}
			summary={(p: unknown): ReactElement => (
				<Details.Summary
					startChildren={renderSummaryStart()}
					endChildren={renderSummaryEnd()}
					{...p} />
			)}>
			{(vault.warnings || []).length > 0 ? <div className={'flex flex-row items-center p-2 mb-4 bg-[#FFF9D9] rounded-lg'}>
				<IconWarning className={'w-6 h-6 text-[#FF8A00]'} />
				<p className={'pl-2 text-[#FF8A00]'}>{vault.warnings}</p>
			</div> : null}
			{
				vault.strategies
					.sort((a, b): number => (a.index || 0) - (b.index || 0))
					.map((strategy, index: number): ReactElement => (
						<StrategyBox
							key={index}
							strategy={strategy}
							symbol={vault.symbol}
							decimals={vault.decimals}
							vaultAddress={vault.address}
							vaultExplorer={vault.explorer} />
					))
			}
		</Details>
	);
});

function	Index(): ReactElement {
	const	{vaults} = useYearn();
	const	[filteredVaults, set_filteredVaults] = React.useState(vaults);
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[isOnlyWarning, set_isOnlyWarning] = React.useState(false);

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	**************************************************************************/
	React.useEffect((): void => {
		const	_vaults = vaults;
		let		_filteredVaults = [..._vaults];

		if (isOnlyWarning) {
			_filteredVaults = _filteredVaults.filter((vault): boolean => (vault.warnings?.length || 0) > 0);
		}
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
		set_filteredVaults(_filteredVaults);
	}, [vaults, searchTerm, isOnlyWarning]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'w-full'}>
			<div className={'flex flex-row mb-5 space-x-4'}>
				<div className={'flex flex-col space-y-2 w-full'}>
					<SearchCard searchTerm={searchTerm} set_searchTerm={set_searchTerm} />
					<div className={'flex flex-row items-center'}>
						<p className={'mr-10 text-xs text-typo-secondary'}>{`Vaults Found: ${filteredVaults.length}`}</p>
						<p className={'text-xs text-typo-secondary'}>
							{`Strategies Found: ${filteredVaults.reduce((acc, vault): number => acc + (vault?.strategies?.length || 0), 0)}`}
						</p>
					</div>
				</div>
				<div>
					<Card isNarrow>
						<label className={'flex flex-row space-x-6 w-max cursor-pointer'}>
							<p className={'text-typo-primary'}>{'Only vaults with warnings'}</p>
							<Switch isEnabled={isOnlyWarning} set_isEnabled={set_isOnlyWarning} />
						</label>
					</Card>
				</div>
			</div>
			<div className={'flex flex-col space-y-4 w-full'}>
				{filteredVaults.map((vault): ReactElement => <VaultBox key={vault.address} vault={vault} />)}
			</div>
		</div>
	);
}

export default Index;
