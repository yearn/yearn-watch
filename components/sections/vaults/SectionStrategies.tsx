import React, {ReactElement, memo, useEffect, useState} from 'react';
import {TStrategy, TVault} from 'contexts/useWatch.d';
import {useSettings} from 'contexts/useSettings';
import StrategyBox from 'components/sections/vaults/StrategyBox';

type	TSectionStrategies = {currentVault: TVault};
const	SectionStrategies = memo(function SectionStrategies({currentVault}: TSectionStrategies): ReactElement {
	const	{shouldDisplayStratsInQueue} = useSettings();
	const	[strategies, set_strategies] = useState<TStrategy[]>([]);

	useEffect((): void => {
		set_strategies(currentVault.strategies.filter((strat): boolean => shouldDisplayStratsInQueue ? strat?.details?.withdrawalQueuePosition !== 21 : true));
	}, [currentVault.strategies, shouldDisplayStratsInQueue]);

	return (
		<section
			aria-label={'vault-strategies'}
			className={'flex flex-col'}>
			{
				strategies
					.sort((a, b): number => (a?.details?.withdrawalQueuePosition || 0) - (b?.details?.withdrawalQueuePosition || 0))
					.map((strategy, index: number): ReactElement => (
						<StrategyBox
							key={index}
							strategy={strategy}
							decimals={currentVault.decimals}
							vaultAddress={currentVault.address} />
					))
			}
		</section>
	);
});

export default SectionStrategies;