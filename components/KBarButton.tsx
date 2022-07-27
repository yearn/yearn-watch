import	React, {ReactElement}	from 'react';
import	{Search}				from '@yearn-finance/web-lib/icons';
import	{useKBar}				from 'kbar';

function	KBarButton(): ReactElement {
	const	{query} = useKBar();
	return (
		<div className={'rounded-default transition-color bg-neutral-300/70 hover:bg-neutral-300'}>
			<label
				onClick={query.toggle}
				className={'rounded-default flex h-8 w-full cursor-pointer flex-row items-center p-2 text-neutral-500 transition-colors focus-within:border-accent-500'}>
				<span className={'sr-only'}>{'search with kbar'}</span>
				<Search className={'mr-1 h-3 w-3 min-w-[16px] text-neutral-500/60'} />
				<div className={'yearn--searchBox-input flex h-10 items-center text-sm text-neutral-500/60'}>
					{'Search'}
				</div>
				<div className={'flex flex-row space-x-2 pr-1'}>
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
