import	{ethers}		from	'ethers';
import	{Provider}		from	'ethcall';
import	toast			from	'react-hot-toast';
import	dayjs			from	'dayjs';
import	relativeTime	from	'dayjs/plugin/relativeTime';
import	duration		from	'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export type	TAddress = '/^0x([0-9a-f][0-9a-f])*$/I' //cf: https://github.com/ethers-io/ethers.js/discussions/1429

/* 🔵 - Yearn Finance ******************************************************
** Bunch of function used to format the addresses and work with them to
** always be sure they are correct. An address should not be a string, it
** should be a specific type address, which does not exists, so any address
** should always be called by toAddress(0x...).
**************************************************************************/
export function toAddress(address: string | undefined): TAddress {
	if (!address) {
		return ethers.constants.AddressZero as TAddress;
	}
	if (address === 'GENESIS') {
		return ethers.constants.AddressZero as TAddress;
	}
	try {
		return ethers.utils.getAddress(address) as TAddress;
	} catch (error) {
		return ethers.constants.AddressZero as TAddress;
	}
}

export function toENS(address: string | undefined, format?: boolean, size?: number): string {
	if (!address) {
		return address || '';
	}
	const	_address = toAddress(address);
	const	knownENS = process.env.KNOWN_ENS as unknown as {[key: string]: string};
	if (knownENS[_address]) {
		return knownENS[_address];
	}
	if (format) {
		return (truncateHex(_address, size || 4));
	}
	return address;
}

export function isZeroAddress(address: string | undefined): boolean {
	return toAddress(address) === ethers.constants.AddressZero as TAddress;
}

export function truncateHex(address: string | undefined, size: number): string {
	if (address !== undefined) {
		return `${address.slice(0, size)}...${address.slice(-size)}`;
	}
	return '0x000...0000';
}

/* 🔵 - Yearn Finance ******************************************************
** Yearn Meta uses some markdown for some rich content. Instead of using
** a md parser and add some heavy dependencies, just use regex to replace
** the strings to some class and inject that to the code.
**************************************************************************/
export function	parseMarkdown(markdownText: string): string {
	const htmlText = markdownText
		.replace(/\[(.*?)\]\((.*?)\)/gim, "<a class='link' target='_blank' href='$2'>$1</a>")
		.replace(/~~(.*?)~~/gim, "<span class='text-primary'>$1</span>")
		.replace(/\*\*(.*?)\*\*/gim, "<span class='font-bold'>$1</span>")
		;

	return htmlText.trim();
}

/* 🔵 - Yearn Finance ******************************************************
** We use the clipboard API in order to copy some data to the user's
** clipboard.
** A toast is displayed to inform the user that the address has been
** copied.
**************************************************************************/
export function	copyToClipboard(value: string, toastMessage = 'Copied to clipboard!'): void {
	navigator.clipboard.writeText(value);
	toast.success(toastMessage);
}

/* 🔵 - Yearn Finance ******************************************************
** Bunch of function using the power of the browsers and standard functions
** to correctly format numbers, currency and date
**************************************************************************/
export function	formatBigNumberAsAmount(
	bnAmount = ethers.BigNumber.from(0),
	decimals = 18,
	decimalsToDisplay = 2,
	symbol = ''
): string {
	let		locale = 'fr-FR';
	if (typeof(navigator) !== 'undefined')
		locale = navigator.language || 'fr-FR';
	
	let	symbolWithPrefix = symbol;
	if (symbol.length > 0 && symbol !== '%') {
		symbolWithPrefix = ` ${symbol}`;
	}

	if (bnAmount.isZero()) {
		return (`0${symbolWithPrefix}`);
	} else if (bnAmount.eq(ethers.constants.MaxUint256)) {
		return (`∞${symbolWithPrefix}`);
	}

	const	formatedAmount = ethers.utils.formatUnits(bnAmount, decimals);
	return (`${
		new Intl.NumberFormat([locale, 'en-US'], {
			minimumFractionDigits: 0,
			maximumFractionDigits: decimalsToDisplay
		}).format(Number(formatedAmount))
	}${symbolWithPrefix}`);
}

export function	formatAmount(amount: number, decimals = 2): string {
	let		locale = 'fr-FR';
	if (typeof(navigator) !== 'undefined')
		locale = navigator.language || 'fr-FR';
	return (new Intl.NumberFormat([locale, 'en-US'], {minimumFractionDigits: 0, maximumFractionDigits: decimals}).format(amount));
}

export function	formatCurrency(amount: number, decimals = 2): string {
	let		locale = 'fr-FR';
	if (typeof(navigator) !== 'undefined')
		locale = navigator.language || 'fr-FR';
	return (new Intl.NumberFormat([locale, 'en-US'], {
		style: 'currency',
		currency: 'USD',
		currencyDisplay: 'symbol',
		minimumFractionDigits: 0,
		maximumFractionDigits: decimals
	}).format(amount));
}

export function	formatDate(value: number, withDate = true): string {
	if (withDate)
		return (new Intl.DateTimeFormat('fr', {dateStyle: 'short', timeStyle: 'short', hourCycle: 'h24'}).format(value));
	return (new Intl.DateTimeFormat('fr', {dateStyle: 'short', hourCycle: 'h24'}).format(value));
}

export function	formatSince(value: number): string {
	return dayjs(value).from(dayjs());
}

export function	formatDuration(value: number): string {
	return dayjs.duration(value, 'milliseconds').humanize();
}


/* 🔵 - Yearn Finance ******************************************************
** Create a multicall provider that can be used to call multiple functions
** at the same time.
** Some specific rules are added in order to support test networks.
**************************************************************************/
export async function newEthCallProvider(provider: ethers.providers.Provider): Promise<Provider> {
	const	ethcallProvider = new Provider();
	if (process.env.IS_TEST) {
		await	ethcallProvider.init(new ethers.providers.JsonRpcProvider('http://localhost:8545'));
		if (Number(process.env.TESTED_NETWORK) === 250) {
			ethcallProvider.multicall = {address: '0xc04d660976c923ddba750341fe5923e47900cf24', block: 0};
			ethcallProvider.multicall2 = {address: '0x470ADB45f5a9ac3550bcFFaD9D990Bf7e2e941c9', block: 0};
		} else {
			ethcallProvider.multicall = {address: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441', block: 0};
			ethcallProvider.multicall2 = {address: '0x5ba1e12693dc8f9c48aad8770482f4739beed696', block: 0};
		}

		return ethcallProvider;
	}
	await	ethcallProvider.init(provider as ethers.providers.BaseProvider);
	return	ethcallProvider;
}