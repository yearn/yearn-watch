import	React, {MouseEvent, ReactElement}	from	'react';
import	Link								from	'next/link';
import	Image								from	'next/image';
import	{Card, AddressWithActions, Button}	from	'@yearn-finance/web-lib/components';
import	{AlertWarning, Chevron}				from	'@yearn-finance/web-lib/icons';
import	{TStrategy, TVault}					from	'contexts/useWatch.d';
import	StrategyBox							from	'components/sections/vaults/StrategyBox';
import	ModalWarning						from	'components/ModalWarning';

type 		TVaultBox = {vault: TVault, isOnlyInQueue?: boolean}

const VaultBox = React.memo(function VaultBox({vault, isOnlyInQueue = false}: TVaultBox): ReactElement {
	const		[isOpen, set_isOpen] = React.useState(false);
	const		[strategies, set_strategies] = React.useState<TStrategy[]>([]);

	React.useEffect((): void => {
		set_strategies(vault.strategies.filter((strat): boolean => isOnlyInQueue ? strat.index !== 21 : true));
	}, [vault.strategies, isOnlyInQueue]);

	function	renderSummaryStart(): ReactElement {
		return (
			<div className={'justify-between w-full md:w-max flex-row-start'}>
				<div className={'flex-row-start'}>
					{vault.icon ? <Image
						alt={`token ${vault.name}`}
						decoding={'async'}
						width={40}
						height={40}
						src={vault.icon}
						quality={70}
						className={'w-10 h-10'} /> : <div className={'w-10 min-w-[40px] h-10 min-h-[40px] rounded-full bg-background'} />}
					<div className={'ml-2 md:ml-6'}>
						<b>{vault.display_name || vault.name}</b>
						<p className={'text-xs text-typo-secondary'}>
							{`v${vault.version}`}
						</p>
						<p className={'text-xs text-typo-secondary'}>
							{(strategies).length > 1 ? `${(strategies).length} strats` : `${(strategies).length} strat`}
						</p>
					</div>
				</div>
				<AddressWithActions
					address={vault.address}
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
							className={'p-1 mr-2 w-32 h-8 rounded-lg border transition-colors cursor-pointer md:mr-5 flex-row-center text-alert-warning-primary bg-alert-warning-secondary hover:bg-alert-warning-secondary-variant border-alert-warning-primary'}>
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
				<div className={'contents'} onClick={(e: MouseEvent): void => e.stopPropagation()}>
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

	if (strategies.length === 0) {
		return (
			<Card padding={'none'} className={'justify-between w-full h-full text-justify rounded-lg transition-colors bg-surface'}>
				<div className={'flex flex-col justify-between items-start p-6 w-full rounded-lg cursor-default md:flex-row md:items-center'}>
					<div className={'w-inherit'}>
						{renderSummaryStart()}
					</div>
					<div className={'flex flex-row items-center mt-4 w-full md:mt-0'}>
						{renderSummaryEnd()}
						<div className={'ml-auto'}>
							<Chevron className={'w-6 h-6 text-primary/0'} />
						</div>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<Card.Detail
			summary={(p: unknown[]): ReactElement => (
				<Card.Detail.Summary
					startChildren={renderSummaryStart()}
					endChildren={renderSummaryEnd()}
					{...p} />
			)}>
			{
				strategies
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

export default VaultBox;