import {TStrategy, TVault} from 'contexts/useWatch.d';

/* 🔵 - Yearn Finance ******************************************************
** When using the search field, one of the things we will check is if from
** the searched term, can we find a vault matching an element of this
** specific vault.
** This search will be performed on the vault, but also on all of it's
** strategies.
** Returns true if there is a match or if the search is empty.
**************************************************************************/
export function	deepFindVaultBySearch(vault: TVault, term: string): boolean {
	if (term.length === 0)
		return true;
	let	shouldSearchWithStrategies = false;
	let	shouldSearchWithTokens = false;
	term = term.toLowerCase().trim();
	if (term.startsWith('strategies:') || term.startsWith('strats:') || term.startsWith('strat:') || term.startsWith('strategy:')) {
		shouldSearchWithStrategies = true;
		term = term.substring(term.indexOf(':') + 1);
	} else if (term.startsWith('token:') || term.startsWith('tokebs:')) {
		shouldSearchWithTokens = true;
		term = term.substring(term.indexOf(':') + 1);
	}
	term = term.trim();

	const	shouldSearchWithVaults = !shouldSearchWithStrategies && !shouldSearchWithTokens;
	return (
		(shouldSearchWithVaults && (vault?.name || '').toLowerCase().includes(term)) ||
		(shouldSearchWithVaults && (vault?.address || '').toLowerCase().includes(term)) ||
		(shouldSearchWithVaults && (vault?.symbol || '').toLowerCase().includes(term)) ||
		(shouldSearchWithTokens && (vault?.token?.name || '').toLowerCase().includes(term)) ||
		(shouldSearchWithTokens && ((vault?.token?.address || '')).toLowerCase().includes(term)) ||
		(shouldSearchWithStrategies && (vault?.strategies || []).some((strategy): boolean => {
			return (
				(strategy?.name || '').toLowerCase().includes(term)
				|| (strategy?.address || '').toLowerCase().includes(term)
			);
		}))
	);
}

/* 🔵 - Yearn Finance ******************************************************
** When using the search field, one of the things we will check is if from
** the searched term, can we find a vault matching an element of this
** specific vault.
** Returns true if there is a match or if the search is empty.
**************************************************************************/
export function	findVaultBySearch(vault: TVault, term: string): boolean {
	if (term.length === 0)
		return true;
	return (
		(vault?.name || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.address || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.symbol || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.token?.name || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.token?.address || '').toLowerCase().includes(term.toLowerCase())
	);
}

/* 🔵 - Yearn Finance ******************************************************
** When using the search field, one of the things we will check is if from
** the searched term, can we find a strategy matching an element of this
** specific strategy.
** Returns true if there is a match or if the search is empty.
**************************************************************************/
export function	findStrategyBySearch(strategy: TStrategy, term: string): boolean {
	if (term.length === 0)
		return true;
	return (
		(strategy?.name || '').toLowerCase().includes(term.toLowerCase())
		|| (strategy?.address || '').toLowerCase().includes(term.toLowerCase())
		|| (strategy.vault?.name || '').toLowerCase().includes(term.toLowerCase())
		|| (strategy.vault?.address || '').toLowerCase().includes(term.toLowerCase())
	);
}
