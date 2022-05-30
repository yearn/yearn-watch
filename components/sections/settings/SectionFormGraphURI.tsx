import	React, {ReactElement}		from	'react';
import	{Card, Button}				from	'@yearn/web-lib/components';
import	{useUI}						from	'@yearn/web-lib/contexts';
import	useSettings					from	'contexts/useSettings';

function	SectionFormGraphURI(): ReactElement {
	const	{toast} = useUI();
	const	{shouldUseRemoteFetch, subGraphURI, updateSubGraphURI} = useSettings();

	return (
		<form
			name={'graph-form'}
			onSubmit={(e): void => {
				e.preventDefault();
				const	allForms = document.forms as ({[key: string|number]: any});
				const	form = allForms['graph-form'];
				const	formData = new FormData(form) as any;
				const	_subGraphURI = subGraphURI;
				for (const [key, value] of formData.entries()) {
					_subGraphURI[key] = value;
				}
				updateSubGraphURI(_subGraphURI);
				(toast as any).success('Subgraph endpoints updated');
			}}>
			<Card className={`flex flex-col space-y-4 w-full transition-opacity ${shouldUseRemoteFetch ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
				<div className={'pb-6'}>
					<h4>{'Subgraph endpoints'}</h4>
				</div>
				<div className={'w-full md:flex-row md:items-center flex-col-start'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Ethereum graph URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'component--input-wrapper'}>
							<input
								defaultValue={subGraphURI?.[1] || ''}
								name={'1'}
								type={'url'}
								className={'component--input-base'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'w-full md:flex-row md:items-center flex-col-start'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Fantom graph URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'component--input-wrapper'}>
							<input
								defaultValue={subGraphURI?.[250] || ''}
								name={'250'}
								type={'url'}
								className={'component--input-base'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'w-full md:flex-row md:items-center flex-col-start'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Arbitrum graph URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'component--input-wrapper'}>
							<input
								defaultValue={subGraphURI?.[42161] || ''}
								name={'42161'}
								type={'url'}
								className={'component--input-base'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'flex flex-row w-full'}>
					<Button
						variant={'outlined'}
						type={'submit'}
						className={'ml-0 min-w-[132px] md:ml-auto'}>
						{'Save'}
					</Button>
				</div>
			</Card>
		</form>
	);
}

export default SectionFormGraphURI;