import	React, {ReactElement}		from	'react';
import	{Card, Button}				from	'@yearn-finance/web-lib/components';
import	{useUI}						from	'@yearn-finance/web-lib/contexts';
import	useSettings					from	'contexts/useSettings';

function	SectionFormRpcURI(): ReactElement {
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
				(toast as any).success('RPC endpoints updated');
			}}>
			<Card className={`flex w-full flex-col space-y-4 transition-opacity ${shouldUseRemoteFetch ? 'pointer-events-none opacity-60' : 'opacity-100'}`}>
				<div className={'pb-6'}>
					<h4>{'RPC endpoints'}</h4>
				</div>
				<div className={'flex-col-start w-full md:flex-row md:items-center'}>
					<div className={'w-full pb-2 md:w-3/12 md:pb-0'}><label className={'test-sm'}>{'Ethereum RPC URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'component--input-wrapper'}>
							<input
								defaultValue={rpcURI?.[1] || ''}
								name={'1'}
								type={'url'}
								className={'component--input-base'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'flex-col-start w-full md:flex-row md:items-center'}>
					<div className={'w-full pb-2 md:w-3/12 md:pb-0'}><label className={'test-sm'}>{'Fantom RPC URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'component--input-wrapper'}>
							<input
								defaultValue={rpcURI?.[250] || ''}
								name={'250'}
								type={'url'}
								className={'component--input-base'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'flex-col-start w-full md:flex-row md:items-center'}>
					<div className={'w-full pb-2 md:w-3/12 md:pb-0'}><label className={'test-sm'}>{'Arbitrum RPC URI'}</label></div>
					<div className={'w-full md:w-9/12'}>
						<div
							className={'component--input-wrapper'}>
							<input
								defaultValue={rpcURI?.[42161] || ''}
								name={'42161'}
								type={'url'}
								className={'component--input-base'}
								placeholder={'Use default'} />
						</div>
					</div>
				</div>
				<div className={'flex w-full flex-row'}>
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

export default SectionFormRpcURI;