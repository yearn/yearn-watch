import React, {MouseEvent, ReactElement, memo, useEffect, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {AddressWithActions, Button, Card} from '@yearn-finance/web-lib/components';
import {AlertWarning, Chevron} from '@yearn-finance/web-lib/icons';
import {TStrategy, TVault} from 'contexts/useWatch.d';
import StrategyBox from 'components/sections/vaults/StrategyBox';
import ModalWarning from 'components/ModalWarning';

type 		TVaultBox = {vault: TVault, isOnlyInQueue?: boolean}

const VaultBox = memo(function VaultBox({vault, isOnlyInQueue = false}: TVaultBox): ReactElement {
	const		[isOpen, set_isOpen] = useState(false);
	const		[strategies, set_strategies] = useState<TStrategy[]>([]);

	useEffect((): void => {
		set_strategies(vault.strategies);
	}, [vault.strategies, isOnlyInQueue]);

	function	renderSummaryStart(): ReactElement {
		return (
			<div className={'flex-row-start w-full justify-between md:w-max'}>
				<div className={'flex-row-start'}>
					{vault.icon ? <Image
						alt={`token ${vault.name}`}
						decoding={'async'}
						width={40}
						height={40}
						src={vault.icon}
						quality={70}
						className={'h-10 w-10'} /> : <div className={'h-10 min-h-[40px] w-10 min-w-[40px] rounded-full bg-neutral-200'} />}
					<div className={'ml-2 md:ml-6'}>
						<b>{vault.name}</b>
						<p className={'text-xs text-neutral-500'}>
							{`v${vault.version}`}
						</p>
						<p className={'text-xs text-neutral-500'}>
							{(strategies).length > 1 ? `${(strategies).length} strats` : `${(strategies).length} strat`}
						</p>
					</div>
				</div>
				<AddressWithActions
					address={vault.address}
					truncate={3}
					wrapperClassName={'flex md:hidden'}
					className={'font-mono text-sm leading-6 text-neutral-500'} />
			</div>
		);
	}
	function	renderSummaryEnd(): ReactElement {
		return (
			<div className={'flex w-full flex-row items-center justify-start md:justify-end'}>
				{(vault.alerts || []).length > 0 ? (
					<>
						<div
							onClick={(e: MouseEvent<HTMLDivElement>): void => {
								e.stopPropagation();
								set_isOpen(true);
							}}
							className={'rounded-default flex-row-center mr-2 h-8 w-32 cursor-pointer border border-yellow-900 bg-yellow-300 p-1 text-yellow-900 transition-colors hover:bg-yellow-200 md:mr-5'}>
							<AlertWarning className={'h-4 w-4 md:h-5 md:w-5'} />
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
					wrapperClassName={'hidden md:flex'}
					className={'font-mono text-sm text-neutral-500'} />
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
			<Card padding={'none'} className={'rounded-default h-full w-full justify-between bg-neutral-0 text-justify transition-colors'}>
				<div className={'rounded-default flex w-full cursor-default flex-col items-start justify-between p-6 md:flex-row md:items-center'}>
					<div className={'w-inherit'}>
						{renderSummaryStart()}
					</div>
					<div className={'mt-4 flex w-full flex-row items-center md:mt-0'}>
						{renderSummaryEnd()}
						<div className={'ml-auto'}>
							<Chevron className={'h-6 w-6 text-accent-500/0'} />
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
					.sort((a, b): number => (a?.details?.withdrawalQueuePosition || 0) - (b?.details?.withdrawalQueuePosition || 0))
					.map((strategy, index: number): ReactElement => (
						<StrategyBox
							key={index}
							strategy={strategy}
							decimals={vault.decimals}
							vaultAddress={vault.address} />
					))
			}
		</Card.Detail>
	);
});

export default VaultBox;