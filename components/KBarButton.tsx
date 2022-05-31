import	React, {ReactElement}	from 'react';
import	{Search}				from '@yearn/web-lib/icons';
import	{useKBar}				from 'kbar';

function	KBarButton(): ReactElement {
	const	{query} = useKBar();
	return (
		<div className={'rounded-lg transition-color bg-background-variant/70 hover:bg-background-variant'}>
			<label
				onClick={query.toggle}
				className={'flex flex-row items-center p-2 w-full h-8 rounded-lg transition-colors cursor-pointer text-typo-secondary focus-within:border-primary'}>
				<span className={'sr-only'}>{'search with kbar'}</span>
				<Search className={'mr-1 w-3 min-w-[16px] h-3 text-typo-secondary/60'} />
				<div className={'flex items-center h-10 text-sm yearn--searchBox-input text-typo-secondary/60'}>
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
