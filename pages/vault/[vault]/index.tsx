import	React, {ReactElement}	from	'react';
import	{useRouter}				from	'next/router';
import	useWatch				from	'contexts/useWatch';
import	{TVault}				from	'contexts/useWatch.d';
import	SectionAbout			from	'components/sections/vaults/SectionAbout';
import	SectionAllocations		from	'components/sections/vaults/SectionAllocations';
import	SectionStrategies		from	'components/sections/vaults/SectionStrategies';
import	{Card}					from	'@majorfi/web-lib/components';

function	Index(): ReactElement {
	const	{vaults} = useWatch();
	const	router = useRouter();
	const	[currentVault, set_currentVault] = React.useState<TVault | undefined>(undefined);

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the router query
	** is changed. It retrieves the data about the current vault.
	**************************************************************************/
	React.useEffect((): void => {
		set_currentVault(vaults.find((vault): boolean => vault.address === router.query.vault));
	}, [router.query.vault, vaults]);

	if (!currentVault) {
		return <div />;
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	function	renderDetailsTab(): ReactElement {
		if (!currentVault) {
			return <div />;
		}
		return (
			<>
				<SectionAbout currentVault={currentVault} />
				<SectionAllocations currentVault={currentVault} />
			</>
		);
	}
	return (
		<div className={'w-full'}>
			<Card.Tabs
				tabs={[
					{label: 'Details', children: renderDetailsTab()},
					{label: 'Strategies', children: <SectionStrategies currentVault={currentVault} />}
				]}
			/>
		</div>
	);
}

export default Index;
