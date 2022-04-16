import	React, {ReactElement}	from	'react';
import	{TVault}				from	'contexts/useWatch.d';
import	StrategyBox				from	'components/sections/vaults/StrategyBox';

type	TSectionStrategies = {currentVault: TVault};
const	SectionStrategies = React.memo(function SectionStrategies({currentVault}: TSectionStrategies): ReactElement {
	return (
		<section
			aria-label={'vault-strategies'}
			className={'flex flex-col'}>
			{
				currentVault.strategies
					.sort((a, b): number => (a.index || 0) - (b.index || 0))
					.map((strategy, index: number): ReactElement => (
						<StrategyBox
							key={index}
							strategy={strategy}
							symbol={currentVault.symbol}
							decimals={currentVault.decimals}
							vaultAddress={currentVault.address}
							vaultExplorer={currentVault.explorer} />
					))
			}
		</section>
	);
});

export default SectionStrategies;