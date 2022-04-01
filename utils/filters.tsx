import {TVault, TStrategy}	from	'contexts/useWatch';

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
	return (
		(vault?.display_name || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.name || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.address || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.symbol || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.token?.name || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.token?.address || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.token?.display_name || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.strategies || []).some((strategy): boolean => {
			return (
				(strategy?.name || '').toLowerCase().includes(term.toLowerCase())
				|| (strategy?.address || '').toLowerCase().includes(term.toLowerCase())
				|| (strategy?.description || '').toLowerCase().includes(term.toLowerCase())
			);
		})
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
		(vault?.display_name || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.name || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.address || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.symbol || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.token?.name || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.token?.address || '').toLowerCase().includes(term.toLowerCase()) ||
		(vault?.token?.display_name || '').toLowerCase().includes(term.toLowerCase())
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
		(strategy?.name || '').toLowerCase().includes(term.toLowerCase()) ||
		(strategy?.address || '').toLowerCase().includes(term.toLowerCase()) || 
		(strategy?.description || '').toLowerCase().includes(term.toLowerCase()) || 
		(strategy.vault?.name || '').toLowerCase().includes(term.toLowerCase()) ||
		(strategy.vault?.address || '').toLowerCase().includes(term.toLowerCase())
	);
}
