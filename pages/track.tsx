import React, {ReactElement, useEffect, useState}  from 'react';
import {Card, SearchBox, Switch}  from '@yearn-finance/web-lib/components';
import {format} from '@yearn-finance/web-lib/utils';
import {useWatch} from 'contexts/useWatch';
import {TRowHead, TStrategy} from 'contexts/useWatch.d';
import {deepFindVaultBySearch} from 'utils/filters';
import SectionTrackList from 'components/sections/track/SectionTrackList';
import {TableHead, TableHeadCell} from 'components/TableHeadCell';

/* 🔵 - Yearn Finance **********************************************************
** This will render the head of the fake table we have, with the sortable
** elements. This component asks for sortBy and set_sortBy in order to handle
** the chevron displays and to set the sort based on the user's choice.
******************************************************************************/
function	RowHead({sortBy, set_sortBy}: TRowHead): ReactElement {
	return (
		<TableHead sortBy={sortBy} set_sortBy={set_sortBy}>
			<TableHeadCell
				className={'cell-start min-w-32 col-span-8'}
				label={'Strategy'}
				sortId={'name'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-4'}
				label={'Total Value Locked'}
				sortId={'tvl'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-4'}
				label={'Debt Outstanding'} />
			<TableHeadCell
				className={'cell-end min-w-36 col-span-3'}
				label={'KeepCRV'} />
		</TableHead>
	);
}

/* 🔵 - Yearn Finance **********************************************************
** Main render of the Track page
******************************************************************************/
function	Track(): ReactElement {
	const	{vaults} = useWatch();
	const	[filteredStrategies, set_filteredStrategies] = useState([] as TStrategy[]);
	const	[searchTerm, set_searchTerm] = useState('');
	const	[isOnlyWithTvl, set_isOnlyWithTvl] = useState(true);
	const	[sortBy, set_sortBy] = useState('risk');

	/* 🔵 - Yearn Finance ******************************************************
	** This effect is triggered every time the vault list or the search term is
	** changed. It filters the vault list based on the search term. This action
	** takes into account the strategies too.
	** Displayed strategies will be the one matching one of the following
	** conditions:
	** - Track is false
	** - TVL is not 0 (can be forced with the isOnlyWithTVL variable)
	**************************************************************************/
	useEffect((): void => {
		const	_vaults = vaults;
		const	_filteredStrategies = [];
		let		_filteredVaults = [..._vaults];

		_filteredVaults = _filteredVaults.filter((vault): boolean => deepFindVaultBySearch(vault, searchTerm));

		for (const vault of _filteredVaults) {
			for (const strategy of vault.strategies) {
				const	keepCRV = strategy?.details?.keepCRV;

				if (keepCRV === 0 || (format.BN(strategy?.details?.totalDebt).isZero() && isOnlyWithTvl))
					continue;
				_filteredStrategies.push(strategy);
			}
		}
		set_filteredStrategies(_filteredStrategies);
	}, [vaults, searchTerm, isOnlyWithTvl]);

	/* 🔵 - Yearn Finance ******************************************************
	** Main render of the page.
	**************************************************************************/
	return (
		<div className={'flex-col-full'}>
			<div className={'mb-5 flex flex-col-reverse space-x-0 md:flex-row md:space-x-4'}>
				<div className={'mt-2 flex w-full flex-col space-y-2 md:mt-0'}>
					<SearchBox
						searchTerm={searchTerm}
						onChange={set_searchTerm} />
					<div className={'flex-row-center'}>
						<p className={'text-xs text-neutral-500'}>{`Strategies Found: ${filteredStrategies.length}`}</p>
					</div>
				</div>
				<div>
					<Card padding={'narrow'}>
						<label className={'component--switchCard-wrapper'}>
							<p>{'Hide vaults with no TVL'}</p>
							<Switch isEnabled={isOnlyWithTvl} onSwitch={set_isOnlyWithTvl} />
						</label>
					</Card>
				</div>
			</div>

			<div className={'flex h-full overflow-x-scroll pb-0 scrollbar-none'}>
				<div className={'flex h-full w-[965px] flex-col md:w-full'}>
					<RowHead sortBy={sortBy} set_sortBy={set_sortBy} />
					<SectionTrackList sortBy={sortBy} strategies={filteredStrategies} />
				</div>
			</div>
		</div>
	);
}

export default Track;
