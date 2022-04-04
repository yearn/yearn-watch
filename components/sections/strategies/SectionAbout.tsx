import	React, {ReactElement}	from	'react';
import	{TVault, TStrategy}		from	'contexts/useWatch.d';
import	{AddressWithActions} 	from	'@majorfi/web-lib/components';
import	{parseMarkdown} 		from	'@majorfi/web-lib/utils';

type	TSectionAbout = {currentVault: TVault, currentStrategy: TStrategy | undefined};
const	SectionAbout = React.memo(function SectionAbout({currentVault, currentStrategy}: TSectionAbout): ReactElement {
	return (
		<section aria-label={'about-the-strategy'}  className={'col-span-1'}>
			<div className={'flex flex-col'}>
				<h4 className={'mb-4'}>{'Vault'}</h4>
				<div className={'mb-8'}>
					<b className={'block mb-2 text-typo-primary'}>{currentVault.name}</b>
					<AddressWithActions
						address={currentVault.address}
						explorer={currentVault.explorer}
						truncate={0}
						className={'font-mono text-sm text-typo-secondary-variant'} />
				</div>

				<div className={'mb-8'}>
					<b className={'text-typo-primary'}>{'Description'}</b>
					<div className={'flex flex-row items-center mt-4'}>
						<p
							className={'text-typo-secondary-variant'}
							dangerouslySetInnerHTML={{__html: parseMarkdown((currentStrategy?.description || '').replace(/{{token}}/g, currentVault.symbol) || '')}} />
					</div>
				</div>
				
			</div>
		</section>
	);
});

export default SectionAbout;