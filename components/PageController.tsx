import	React, {ReactElement}		from	'react';
import	{Chevron}					from	'@yearn-finance/web-lib/icons';

type	TPageController = {
	pageIndex: number,
	pageLen: number,
	amountToDisplay: number,
	nextPage: () => void,
	previousPage: () => void,
}

function	PageController({pageIndex, pageLen, amountToDisplay, nextPage, previousPage}: TPageController): ReactElement {
	const	canPreviousPage = pageIndex > 1;
	const	canNextPage = Math.ceil(pageIndex / amountToDisplay) + 1 < Math.ceil(pageLen / amountToDisplay);

	function	renderPreviousChevron(): ReactElement {
		if (!canPreviousPage) 
			return (<Chevron className={'w-4 h-4 opacity-50 cursor-not-allowed'} />);
		return (
			<Chevron
				className={'w-4 h-4 cursor-pointer'}
				onClick={previousPage} />
		);
	}

	function	renderNextChevron(): ReactElement {
		if (!canNextPage) 
			return (<Chevron className={'w-4 h-4 opacity-50 rotate-180 cursor-not-allowed'} />);
		return (
			<Chevron
				className={'w-4 h-4 rotate-180 cursor-pointer'}
				onClick={nextPage} />
		);
	}
	return (
		<>
			{canPreviousPage || canNextPage ? (
				<div className={'flex flex-row justify-end items-center p-4 space-x-2'}>
					{renderPreviousChevron()}
					<p className={'text-sm tabular-nums select-none'}>
						{`${Math.ceil(pageIndex / amountToDisplay) + 1}/${Math.ceil(pageLen / amountToDisplay)}`}
					</p>
					{renderNextChevron()}
				</div>
			) : null}
		</>
	);
}

export {PageController};