import	React, {ReactElement}		from	'react';
import	{ethers}					from	'ethers';
import	{Web3ReactProvider}			from	'@web3-react/core';
import	{BalancesContextApp}		from	'@lib/contexts/useBalances';
import	{UIContextApp}				from	'@lib/contexts/useUI';
import	{PricesContextApp}			from	'@lib/contexts/usePrices';
import	{LocalizationContextApp}	from 	'@lib/contexts/useLocalization';
import	{Web3ContextApp}			from	'@lib/contexts/useWeb3';

const getLibrary = (provider: ethers.providers.ExternalProvider): ethers.providers.Web3Provider => {
	return new ethers.providers.Web3Provider(provider, 'any');
};

function	WithYearn({children}: {children: ReactElement}): ReactElement {
	return (
		<UIContextApp>
			<Web3ReactProvider getLibrary={getLibrary}>
				<Web3ContextApp>
					<BalancesContextApp>
						<PricesContextApp>
							<LocalizationContextApp>
								{children}
							</LocalizationContextApp>
						</PricesContextApp>
					</BalancesContextApp>
				</Web3ContextApp>
			</Web3ReactProvider>
		</UIContextApp>
	);
}

export default WithYearn;
