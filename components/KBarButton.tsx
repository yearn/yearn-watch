import	React, {ReactElement}	from 'react';
import	{Search}				from '@yearn-finance/web-lib/icons';
import	{useKBar}				from 'kbar';

function	KBarButton(): ReactElement {
	const	{query} = useKBar();
	return (
		<div className={'rounded-default transition-color bg-neutral-300/70 hover:bg-neutral-300'}>
			<label
				onClick={query.toggle}
				className={'flex flex-row items-center p-2 w-full h-8 transition-colors cursor-pointer rounded-default text-neutral-500 focus-within:border-accent-500'}>
				<span className={'sr-only'}>{'search with kbar'}</span>
				<Search className={'mr-1 w-3 min-w-[16px] h-3 text-neutral-500/60'} />
				<div className={'flex items-center h-10 text-sm yearn--searchBox-input text-neutral-500/60'}>
					{'Search'}
				</div>
				<div className={'flex flex-row pr-1 space-x-2'}>
					<div className={'text-sm opacity-60'}>
						{'⌘'}
					</div>
					<div className={'text-sm opacity-60'}>
						{'K'}
					</div>

				</div>
			</label>
		</div>
	);
}

export default KBarButton;
