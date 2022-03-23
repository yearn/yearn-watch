import	React, {ReactElement} from 'react';
import	{Disclosure, Transition} from '@headlessui/react';
import	Card from '@lib/Card';
import	IconChevron from '@icons/IconChevron';

export type TSummary = {
	startChildren?: React.ReactNode;
	endChildren?: React.ReactNode;
	['aria-expanded']?: boolean;
} & React.ComponentPropsWithoutRef<'section'>;
function Summary({startChildren, endChildren, ...props}: TSummary, ref: any): ReactElement {

	return (
		<div className={'flex flex-row justify-between items-center p-6 w-full cursor-pointer'} {...props}>
			<div className={'flex flex-row items-start'}>
				{startChildren}
			</div>
			<div className={'flex flex-row items-center'}>
				{endChildren}
				<div>
					<IconChevron className={`w-6 h-6 text-primary transition-transform ${props['aria-expanded'] ? '-rotate-90' : '-rotate-180'}`} />
				</div>
			</div>
		</div>
	);
}

export type TDetails = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	summary?: TSummary | ReactElement | ((p: unknown) => ReactElement | TSummary) | any;
	backgroundColor?: string;
	children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<'section'>;

function Details({summary, backgroundColor = 'bg-background', children}: TDetails): ReactElement {
	return (
		<Disclosure>
			{({open}): ReactElement => (
				<Card
					hasNoPadding
					backgroundColor={backgroundColor}
					className={'overflow-hidden w-full cursor-pointer'}>
					<Disclosure.Button as={React.forwardRef(summary)} />
					<Transition
						as={React.Fragment}
						show={open}
						enter={'transition duration-100 ease-out origin-top'}
						enterFrom={'transform scale-y-0 opacity-0 origin-top'}
						enterTo={'transform scale-y-100 opacity-100 origin-top'}
						leave={'transition ease-out origin-top'}
						leaveFrom={'transform scale-y-100 opacity-100 origin-top'}
						leaveTo={'transform scale-y-0 opacity-0 origin-top'}>
						<Disclosure.Panel static className={`px-6 pb-6 w-full ${backgroundColor}`}>
							{children}
						</Disclosure.Panel>
					</Transition>
				</Card>
			)}
		</Disclosure>
	);
}


export default Object.assign(Details, {Summary});