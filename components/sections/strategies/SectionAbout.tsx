import React, {ReactElement, memo} from 'react';
import {TStrategy, TVault} from 'contexts/useWatch.d';
import {AddressWithActions}  from '@yearn-finance/web-lib/components';
import {parseMarkdown}  from '@yearn-finance/web-lib/utils';

type	TSectionAbout = {currentVault: TVault, currentStrategy: TStrategy | undefined};
const	SectionAbout = memo(function SectionAbout({currentVault, currentStrategy}: TSectionAbout): ReactElement {
	return (
		<section
			aria-label={'about-the-strategy'}
			className={'col-span-1'}>
			<div className={'flex flex-col'}>
				<h4 className={'mb-4'}>{'Vault'}</h4>
				<div className={'mb-8'}>
					<b className={'mb-2 block'}>{currentVault.name}</b>
					<AddressWithActions
						address={currentVault.address}
						truncate={0}
						className={'break-all font-mono text-sm text-neutral-500'} />
				</div>

				<div className={'mb-8'}>
					<b>{'Description'}</b>
					<div className={'flex-row-center mt-4'}>
						<p
							className={'text-neutral-500'}
							dangerouslySetInnerHTML={{__html: parseMarkdown((currentStrategy?.description || '').replace(/{{token}}/g, currentVault.symbol) || '')}} />
					</div>
				</div>
				
			</div>
		</section>
	);
});

export default SectionAbout;