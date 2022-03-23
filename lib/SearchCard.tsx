import React, {ReactElement} from 'react';
import Card from '@lib/Card';
import IconSearch from '@icons/IconSearch';

type 		TSearchBox = {searchTerm: string, set_searchTerm: (searchTerm: string) => void}
export default function	SearchBox({
	searchTerm,
	set_searchTerm
}: TSearchBox): ReactElement {
	return (
		<Card hasNoPadding>
			<label className={'flex flex-row items-center p-4 w-full h-14 text-typo-secondary rounded-lg border-2 border-surface focus-within:border-primary transition-colors'}>
				<div className={'pr-4'}>
					<IconSearch className={'w-6 h-6'} />
				</div>
				<input
					value={searchTerm}
					onChange={(e): void => set_searchTerm(e.target.value)}
					type={'text'}
					className={'w-full h-14 bg-transparent border-none focus:border-none outline-none focus:outline-none focus:ring-0'}
					placeholder={'Search'} />
			</label>
		</Card>
	);
}
