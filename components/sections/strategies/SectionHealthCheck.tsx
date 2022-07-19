import	React, {ReactElement}					from	'react';
import	{TStrategy}								from	'contexts/useWatch.d';
import	{DescriptionList, AddressWithActions} 	from	'@yearn-finance/web-lib/components';

type	TSectionHealthCheck = {currentStrategy: TStrategy | undefined};

const	SectionHealthCheck = React.memo(
	function SectionHealthCheck({currentStrategy}: TSectionHealthCheck): ReactElement {
		function	renderShouldDoHealthcheck(): ReactElement {
			if (currentStrategy?.details?.doHealthCheck) {
				return (<b className={'uppercase text-accent-500'}>{'ENABLED'}</b>);
			}
			return (<b className={'uppercase text-red-900'}>{'DISABLED'}</b>);
		}

		return (
			<section
				aria-label={'healthcheck-of-strategy'}
				className={'flex w-full flex-col'}>
				<DescriptionList
					options={[
						{
							title: 'Health Check Address',
							details: currentStrategy?.details?.doHealthCheck ? (
								<AddressWithActions address={currentStrategy?.details?.healthCheck} />
							) : 'Not set'
						},
						{title: 'Do Next Health Check', details: renderShouldDoHealthcheck()}
					]} />
			</section>
		);
	}
);

export default SectionHealthCheck;