import	React, {ReactElement}						from	'react';
import	* as utils									from	'utils';
import	IconLinkOut									from	'@icons/IconLinkOut';
import	IconCopy									from	'@icons/IconCopy';

export type	TAddressWithActions = {
	address: utils.TAddress,
	explorer: string,
	truncate?: number,
	className?: string
};
function	AddressWithActions({
	address,
	explorer = 'https://etherscan.io',
	truncate = 5,
	className = 'font-mono font-bold text-left text-typo-primary'
}: TAddressWithActions): ReactElement {
	return (
		<span className={'flex flex-row items-center'}>
			<p className={className}>{utils.toENS(address, truncate > 0, truncate)}</p>
			<div
				onClick={(): void => utils.copyToClipboard(address)}
				className={'px-4 cursor-copy'}>
				<IconCopy className={'w-4 h-4 text-primary hover:text-primary-variant transition-colors'} />
			</div>
			<a
				href={`${explorer}/address/${address}`}
				target={'_blank'}
				rel={'noreferrer'}
				className={'cursor-alias'}>
				<IconLinkOut className={'w-4 h-4 text-primary hover:text-primary-variant transition-colors'} />
			</a>
		</span>
	);
}

export default AddressWithActions;