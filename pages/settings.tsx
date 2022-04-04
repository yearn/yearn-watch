import	React, {ReactElement}		from	'react';
import	{Card, Button, Switch}		from	'@majorfi/web-lib/components';
import	{useUI}						from	'@majorfi/web-lib/contexts';
import	useSettings					from	'contexts/useSettings';

function	FormGraphURI(): ReactElement {
	const	{toast} = useUI();
	const	{
		shouldUseRemoteFetch,
		subGraphURI,
		updateSubGraphURI
	} = useSettings();

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
				toast.success('Subgraph endpoints updated');
			}}>
			<Card className={`flex flex-col space-y-4 w-full text-typo-primary transition-opacity ${shouldUseRemoteFetch ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
				<div className={'pb-6'}>
					<h4>{'Subgraph endpoints'}</h4>
				</div>
				<div className={'flex flex-col items-start w-full md:flex-row md:items-center'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Ethereum graph URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'flex overflow-hidden flex-row items-center p-2 w-full h-10 rounded-lg border-2 transition-colors border-surface focus-within:border-primary text-typo-primary bg-background'}>
							<input
								defaultValue={subGraphURI?.[1] || ''}
								name={'1'}
								type={'url'}
								className={'p-0 w-full h-10 bg-transparent border-none focus:border-none outline-none focus:outline-none focus:ring-0'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'flex flex-col items-start w-full md:flex-row md:items-center'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Fantom graph URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'flex overflow-hidden flex-row items-center p-2 w-full h-10 rounded-lg border-2 transition-colors border-surface focus-within:border-primary text-typo-primary bg-background'}>
							<input
								defaultValue={subGraphURI?.[250] || ''}
								name={'250'}
								type={'url'}
								className={'p-0 w-full h-10 bg-transparent border-none focus:border-none outline-none focus:outline-none focus:ring-0'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'flex flex-col items-start w-full md:flex-row md:items-center'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Arbitrum graph URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'flex overflow-hidden flex-row items-center p-2 w-full h-10 rounded-lg border-2 transition-colors border-surface focus-within:border-primary text-typo-primary bg-background focus-within:bg-background'}>
							<input
								defaultValue={subGraphURI?.[42161] || ''}
								name={'42161'}
								type={'url'}
								className={'p-0 w-full h-10 bg-transparent border-none focus:border-none outline-none focus:outline-none focus:ring-0'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'flex flex-row w-full'}>
					<Button
						variant={'outline'}
						type={'submit'}
						className={'ml-0 min-w-[132px] md:ml-auto'}>
						{'Save'}
					</Button>
				</div>
			</Card>
		</form>
	);
}

function	FormRPCURI(): ReactElement {
	const	{toast} = useUI();
	const	{
		shouldUseRemoteFetch,
		rpcURI,
		updateRPCURI
	} = useSettings();

	return (
		<form
			name={'rpc-form'}
			onSubmit={(e): void => {
				e.preventDefault();
				const	allForms = document.forms as ({[key: string|number]: any});
				const	form = allForms['rpc-form'];
				const	formData = new FormData(form) as any;
				const	_rpcURI = rpcURI;
				for (const [key, value] of formData.entries()) {
					_rpcURI[key] = value;
				}
				updateRPCURI(_rpcURI);
				toast.success('RPC endpoints updated');
			}}>
			<Card className={`flex flex-col space-y-4 w-full text-typo-primary transition-opacity ${shouldUseRemoteFetch ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
				<div className={'pb-6'}>
					<h4>{'RPC endpoints'}</h4>
				</div>
				<div className={'flex flex-col items-start w-full md:flex-row md:items-center'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Ethereum RPC URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'flex overflow-hidden flex-row items-center p-2 w-full h-10 rounded-lg border-2 transition-colors border-surface focus-within:border-primary text-typo-primary bg-background'}>
							<input
								defaultValue={rpcURI?.[1] || ''}
								name={'1'}
								type={'url'}
								className={'p-0 w-full h-10 bg-transparent border-none focus:border-none outline-none focus:outline-none focus:ring-0'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'flex flex-col items-start w-full md:flex-row md:items-center'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Fantom RPC URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'flex overflow-hidden flex-row items-center p-2 w-full h-10 rounded-lg border-2 transition-colors border-surface focus-within:border-primary text-typo-primary bg-background'}>
							<input
								defaultValue={rpcURI?.[250] || ''}
								name={'250'}
								type={'url'}
								className={'p-0 w-full h-10 bg-transparent border-none focus:border-none outline-none focus:outline-none focus:ring-0'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'flex flex-col items-start w-full md:flex-row md:items-center'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Arbitrum RPC URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'flex overflow-hidden flex-row items-center p-2 w-full h-10 rounded-lg border-2 transition-colors border-surface focus-within:border-primary text-typo-primary bg-background'}>
							<input
								defaultValue={rpcURI?.[42161] || ''}
								name={'42161'}
								type={'url'}
								className={'p-0 w-full h-10 bg-transparent border-none focus:border-none outline-none focus:outline-none focus:ring-0'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'flex flex-row w-full'}>
					<Button
						variant={'outline'}
						type={'submit'}
						className={'ml-0 min-w-[132px] md:ml-auto'}>
						{'Save'}
					</Button>
				</div>
			</Card>
		</form>
	);
}


function	Index(): ReactElement {
	const {
		shouldUseRemoteFetch,
		switchShouldUseRemoteFetch
	} = useSettings();

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex flex-col space-y-4 w-full h-full'}>
			<Card className={'flex flex-col space-y-4 w-full text-typo-primary'}>
				<div className={'pb-6'}>
					<h4>{'Fetching method'}</h4>
				</div>
				<div className={'flex flex-row w-full'}>
					<div className={'pb-2 w-full md:pb-0 md:w-3/12'}><label className={'test-sm'}>{'Should use remote fetcher'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<Switch
							isEnabled={shouldUseRemoteFetch}
							set_isEnabled={(): void => switchShouldUseRemoteFetch()} />
					</div>
				</div>
			</Card>

			<FormGraphURI />
			<FormRPCURI />
		</div>
	);
}

export default Index;
