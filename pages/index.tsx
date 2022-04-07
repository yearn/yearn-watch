import	React, {MouseEvent, ReactElement}				from	'react';
import	Link											from	'next/link';
import	Image											from	'next/image';
import	useWatch										from	'contexts/useWatch';
import	{TVault}										from	'contexts/useWatch.d';
import	StrategyBox										from	'components/sections/vaults/StrategyBox';
import	ModalWarning									from	'components/ModalWarning';
import	{List}											from	'@majorfi/web-lib/layouts';
import	{Card, SearchBox, Switch, AddressWithActions, Button}	from	'@majorfi/web-lib/components';
import	{AlertWarning}									from	'@majorfi/web-lib/icons';
import	* as utils										from	'@majorfi/web-lib/utils';
import	{deepFindVaultBySearch}							from	'utils/filters';

type 		TVaultBox = {vault: TVault}

const VaultBox = React.memo(function VaultBox({vault}: TVaultBox): ReactElement {
	const		[isOpen, set_isOpen] = React.useState(false);
	function	renderSummaryStart(): ReactElement {
		return (
			<div className={'flex flex-row justify-between items-start w-full md:w-max'}>
				<div className={'flex flex-row items-start'}>
					{vault.icon ? <Image
						alt={`token ${vault.name}`}
						decoding={'async'}
						width={40}
						height={40}
						src={vault.icon}
						quality={70}
						className={'w-10 h-10'} /> : <div className={'w-10 min-w-[40px] h-10 min-h-[40px] rounded-full bg-background'} />}
					<div className={'ml-2 md:ml-6'}>
						<b className={'text-base text-typo-primary'}>{vault.display_name}</b>
						<p className={'text-xs text-typo-secondary'}>
							{(vault.strategies).length > 1 ? `${(vault.strategies).length} strats` : `${(vault.strategies).length} strat`}
						</p>
					</div>
				</div>
				<AddressWithActions
					address={`${vault.address}#code`}
					explorer={vault.explorer}
					truncate={3}
					wrapperClassName={'flex md:hidden'}
					className={'font-mono text-sm leading-6 text-typo-secondary'} />
			</div>
		);
	}
	function	renderSummaryEnd(): ReactElement {
		return (
			<div className={'flex flex-row justify-start items-center w-full md:justify-end'}>
				{(vault.alerts || []).length > 0 ? (
					<>
						<div
							onClick={(e: MouseEvent<HTMLDivElement>): void => {
								e.stopPropagation();
								set_isOpen(true);
							}}
							className={'flex flex-row items-center p-1 mr-2 w-32 h-8 rounded-lg border transition-colors cursor-pointer md:mr-5 text-alert-warning-primary bg-alert-warning-secondary hover:bg-alert-warning-secondary-variant border-alert-warning-primary'}>
							<AlertWarning className={'w-4 h-4 md:w-5 md:h-5'} />
							<p className={'pl-1 md:pl-2'}>{`${vault.alerts.length} warning${vault.alerts.length === 1 ? ' ' : 's'}`}</p>
						</div>
						<ModalWarning
							alerts={vault.alerts}
							isOpen={isOpen}
							set_isOpen={set_isOpen} />
					</>
				) : null}
				<AddressWithActions
					address={vault.address}
					explorer={vault.explorer}
					wrapperClassName={'hidden md:flex'}
					className={'font-mono text-sm text-typo-secondary'} />
				<div onClick={(e: MouseEvent): void => e.stopPropagation()}>
					<Link passHref href={`/vault/${vault.address}`}>
						<Button
							as={'a'}
							variant={'outlined'}
							className={'mr-10 ml-0 min-w-[132px] md:ml-6'}>
							<span className={'sr-only'}>{'Access details about this strategy'}</span>
							{'Details'}
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<Card.Detail
			variant={'surface'}
			summary={(p: unknown): ReactElement => (
				<Card.Detail.Summary
					startChildren={renderSummaryStart()}
					endChildren={renderSummaryEnd()}
					{...p} />
			)}>
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
		</Card.Detail>
	);
});

function	Index(): ReactElement {
	const	{vaults} = useWatch();
	const	[filteredVaults, set_filteredVaults] = React.useState(vaults);
	const	[searchTerm, set_searchTerm] = React.useState('');
	const	[isOnlyWarning, set_isOnlyWarning] = React.useState(false);
	const	[searchResult, set_searchResult] = React.useState({vaults: 0, strategies: 0});

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	**************************************************************************/
	React.useEffect((): void => {
		const	_vaults = vaults;
		let		_filteredVaults = [..._vaults];

		if (isOnlyWarning) {
			_filteredVaults = _filteredVaults.filter((vault): boolean => (vault.alerts?.length || 0) > 0);
		}
		_filteredVaults = _filteredVaults.filter((vault): boolean => deepFindVaultBySearch(vault, searchTerm));
		utils.performBatchedUpdates((): void => {
			set_filteredVaults(_filteredVaults);
			set_searchResult({vaults: _filteredVaults.length, strategies: _filteredVaults.reduce((acc, vault): number => acc + (vault?.strategies?.length || 0), 0)});
		});
	}, [vaults, searchTerm, isOnlyWarning]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'w-full'}>
			<div className={'flex flex-col-reverse mb-5 space-x-0 md:flex-row md:space-x-4'}>
				<div className={'flex flex-col mt-2 space-y-2 w-full md:mt-0'}>
					<SearchBox
						searchTerm={searchTerm}
						onChange={set_searchTerm} />
					<div className={'flex flex-row items-center'}>
						<p className={'mr-4 text-xs md:mr-10 text-typo-secondary'}>{`Vaults Found: ${searchResult.vaults}`}</p>
						<p className={'text-xs text-typo-secondary'}>{`Strategies Found: ${searchResult.strategies}`}</p>
					</div>
				</div>
				<div>
					<Card isNarrow>
						<label className={'flex flex-row justify-between p-2 space-x-6 w-full cursor-pointer md:p-0 md:w-max'}>
							<p className={'text-typo-primary'}>{'Only vaults with warnings'}</p>
							<Switch isEnabled={isOnlyWarning} set_isEnabled={set_isOnlyWarning} />
						</label>
					</Card>
				</div>
			</div>
			<List.Animated className={'flex flex-col space-y-4 w-full'}>
				{filteredVaults.map((vault): ReactElement => (
					<div key={vault.address}>
						<VaultBox vault={vault} />
					</div>
				))}
			</List.Animated>
		</div>
	);
}

export default Index;
