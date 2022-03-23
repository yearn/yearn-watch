import	React, {ReactElement} from 'react';
import	Card from '@lib/Card';

export type TCardProps = {
	onClick?: React.MouseEventHandler;
	label: string;
	value: string;
} & React.ComponentPropsWithoutRef<'div'>;

export default function StatisticCard({label, value, ...props}: TCardProps): ReactElement {
	return (
		<Card className={'flex flex-col'} isNarrow {...props}>
			<div className={'mb-2 text-sm text-typo-secondary'}>
				{label}
			</div>
			<div className={'text-xl font-bold tabular-nums text-typo-primary'}>
				{value}
			</div>
		</Card>
	);
}
