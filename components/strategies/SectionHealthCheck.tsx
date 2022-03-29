import	React, {ReactElement}	from	'react';
import	{TVault, TStrategy}		from	'contexts/useWatch';
import	DescriptionList			from	'@lib/components/DescriptionList';
import	AddressWithActions		from	'@lib/components/AddressWithActions';

type	TSectionHealthCheck = {currentVault: TVault, currentStrategy: TStrategy | undefined};
const	SectionHealthCheck = React.memo(function SectionHealthCheck({currentVault, currentStrategy}: TSectionHealthCheck): ReactElement {
	function	renderShouldDoHealthcheck(): ReactElement {
		if (currentStrategy?.shouldDoHealthCheck) {
			return (<b className={'text-primary uppercase'}>{'ENABLED'}</b>);
		}
		return (<b className={'uppercase text-error-primary'}>{'DISABLED'}</b>);
	}

	return (
		<section aria-label={'healthcheck-of-strategy'} className={'flex flex-col col-span-1 w-full'}>
			<DescriptionList
				options={[
					{
						title: 'Health Check Address',
						details: currentStrategy?.shouldDoHealthCheck ? (
							<AddressWithActions address={currentStrategy?.addrHealthCheck} explorer={currentVault.explorer} />
						) : 'Not set'
					},
					{title: 'Do Next Health Check', details: renderShouldDoHealthcheck()}
				]} />
		</section>
	);
});

export default SectionHealthCheck;