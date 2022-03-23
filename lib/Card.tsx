import React, {ReactElement} from 'react';

export type TCardProps = {
	className?: string;
	backgroundColor?: string;
	isNarrow?: boolean;
	hasNoPadding?: boolean;
	onClick?: React.MouseEventHandler;
	children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<'section'>;

export default function Card({
	children,
	onClick,
	isNarrow,
	hasNoPadding,
	backgroundColor = 'bg-surface',
	className,
	...props
}: TCardProps): ReactElement {
	return (
		<section
			className={`${className ?? ''} ${backgroundColor} shadow-none rounded-lg ${hasNoPadding ? 'p-0' : isNarrow ? 'p-4' : 'p-6'} transition-all ${onClick ? 'cursor-pointer hover:bg-surface-variant shadow-lg' : ''}`}
			{...props}>
			{children}
		</section>
	);
}
