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
			return (<Chevron className={'h-4 w-4 cursor-not-allowed opacity-50'} />);
		return (
			<Chevron
				className={'h-4 w-4 cursor-pointer'}
				onClick={previousPage} />
		);
	}

	function	renderNextChevron(): ReactElement {
		if (!canNextPage) 
			return (<Chevron className={'h-4 w-4 rotate-180 cursor-not-allowed opacity-50'} />);
		return (
			<Chevron
				className={'h-4 w-4 rotate-180 cursor-pointer'}
				onClick={nextPage} />
		);
	}
	return (
		<>
			{canPreviousPage || canNextPage ? (
				<div className={'flex flex-row items-center justify-end space-x-2 p-4'}>
					{renderPreviousChevron()}
					<p className={'select-none text-sm tabular-nums'}>
						{`${Math.ceil(pageIndex / amountToDisplay) + 1}/${Math.ceil(pageLen / amountToDisplay)}`}
					</p>
					{renderNextChevron()}
				</div>
			) : null}
		</>
	);
}

export {PageController};