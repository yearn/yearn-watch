import	React, {ReactElement}		from	'react';
import	{useRouter}					from	'next/router';
import	useWatch					from	'contexts/useWatch';
import	{TVault, TStrategy}			from	'contexts/useWatch.d';
import	SectionStats				from	'components/sections/strategies/SectionStats';
import	SectionAbout				from	'components/sections/strategies/SectionAbout';
import	SectionHealthCheck			from	'components/sections/strategies/SectionHealthCheck';
import	SectionReports				from	'components/sections/strategies/SectionReports';
import	{Card}						from	'@yearn/web-lib/components';
import	* as utils					from	'@yearn/web-lib/utils';

function	Index(): ReactElement {
	const	{vaults} = useWatch();
	const	router = useRouter();
	const	[currentVault, set_currentVault] = React.useState<TVault | undefined>(undefined);
	const	[currentStrategy, set_currentStrategy] = React.useState<TStrategy | undefined>(undefined);

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the router query
	** is changed. It retrieves the data about the current vault.
	**************************************************************************/
	React.useEffect((): void => {
		if (router?.query?.vault && router?.query?.strategy) {
			const	_currentVault = vaults.find((vault): boolean => utils.toAddress(vault.address) === utils.toAddress(router.query.vault as string));
			set_currentVault(_currentVault);
			set_currentStrategy(_currentVault?.strategies.find((strategy): boolean => utils.toAddress(strategy.address) === utils.toAddress(router.query.strategy as string)));
		}
	}, [router.query.vault, router.query.strategy, vaults]);

	if (!currentVault) {
		return <div />;
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	function	renderDetailsTab(): ReactElement {
		if (!currentVault)
			return <div />;
		return (
			<div className={'grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2 md:gap-y-0'}>
				<SectionStats currentVault={currentVault} currentStrategy={currentStrategy} />
				<SectionAbout currentVault={currentVault} currentStrategy={currentStrategy} />
			</div>
		);
	}
	function	renderSectionReport(): ReactElement {
		if (!currentVault)
			return <div />;
		return (
			<div>
				<SectionReports currentVault={currentVault} currentStrategy={currentStrategy} />
			</div>
		);
	}
	function	renderSectionHealthcheck(): ReactElement {
		if (!currentVault)
			return <div />;
		return (
			<div>
				<SectionHealthCheck currentVault={currentVault} currentStrategy={currentStrategy} />
			</div>
		);
	}

	return (
		<div className={'w-full'}>
			<Card.Tabs
				tabs={[
					{label: 'Details', children: renderDetailsTab()},
					{label: 'Reports', children: renderSectionReport()},
					{label: 'Health Check', children: renderSectionHealthcheck()}
				]}
			/>
		</div>
	);
}

export default Index;
