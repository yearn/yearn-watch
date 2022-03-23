
import	React, {ReactElement}	from	'react';
import	{Tab}					from	'@headlessui/react';
import	Card					from	'@lib/Card';

export type TCardTabsOption = {
	label: string;
	children?: ReactElement;
}
  
export type TCardTabsProps = {
	options: TCardTabsOption[];
}

export default function CardTabs({options}: TCardTabsProps): ReactElement {
	return (
		<div>
			<Tab.Group>
				<Tab.List as={Card} className={'flex flex-row w-full rounded-b-none'} hasNoPadding>
					{options.map((option): ReactElement => (
						<Tab
							key={option.label}
							as={'div'}
							className={({selected}): string => `flex w-full h-20 border-b-2 flex-center cursor-pointer ${selected ? 'border-primary text-primary font-bold' : 'border-disabled transition-colors cursor-pointer hover:border-typo-secondary text-typo-secondary'}`}>
							<p className={'text-lg text-center'}>{option.label}</p>
						</Tab>
					))}
				</Tab.List>
				<Tab.Panels as={Card} className={'grid grid-cols-2 gap-x-4 w-full rounded-t-none'}>
					{options.map((option): ReactElement => (
						<Tab.Panel key={option.label} as={React.Fragment}>
							{option.children}
						</Tab.Panel>
					))}
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
}