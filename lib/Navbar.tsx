import React, {ReactElement} from 'react';
import Link from 'next/link';

export type TNavbarOption = {
	id: string;
	values: string | string[];
	label: string;
	icon: ReactElement;
}
  
export type TNavbarProps = {
	options: TNavbarOption[];
	logo: ReactElement;
	title?: string;
	selected: string;
	set_selected: (option: string) => void;
}

export default function Navbar({options, logo, title, selected, set_selected, ...props}: TNavbarProps): ReactElement {
	return (
		<aside className={'pt-9 w-40 min-w-[10rem]'} {...props}>
			<Link href={'/'}>
				<div className={'flex flex-row items-center cursor-pointer'}>
					<div className={title ? 'mr-4' : ''}>
						{React.cloneElement(logo)}
					</div>
					<h1 className={'text-xl font-bold text-primary lowercase'}>
						{title}
					</h1>
				</div>
			</Link>
			<nav className={'flex flex-col mt-12 space-y-4'}>
				{options.map((option): ReactElement => (
					<div
						key={option.id}
						className={'group flex flex-row items-center'}
						onClick={(): void => set_selected(option.id)}>
						<div className={`mr-4 transition-colors py-1 cursor-pointer ${option.values.includes(selected) ? 'text-primary' : 'text-typo-secondary group-hover:text-primary'}`}>
							{React.cloneElement(option.icon, {className: 'w-6 h-6'})}
						</div>
						<p className={`transition-colors py-1 cursor-pointer ${option.values.includes(selected) ? 'text-primary' : 'text-typo-secondary group-hover:text-primary'}`}>
							{option.label}
						</p>
					</div>
				))}
			</nav>
		</aside>
	);
}
