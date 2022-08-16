import	React							from	'react';
import	Image							from	'next/image';
import	{useRouter}						from	'next/router';
import	{Action, createAction,
	useRegisterActions}					from	'kbar';
import	useWatch						from	'contexts/useWatch';

function	KBarWrapper(): React.ReactElement {
	const	[actions, set_actions] = React.useState<Action[]>([]);
	const	{vaults} = useWatch();
	const	router = useRouter();

	React.useEffect((): void => {
		const	_actions = [];
		for (const vault of vaults) {
			const	vaultAction = createAction({
				name: `${vault.name} v${vault.version}`,
				keywords: `${vault.name} ${vault.symbol} ${vault.address}`,
				section: 'Vaults',
				perform: async (): Promise<boolean> => router.push(`/vault/${vault.address}`),
				icon: (vault.icon ? 
					<Image
						src={vault.icon}
						alt={vault.name}
						decoding={'async'}
						quality={70}
						width={36}
						height={36}
						className={'h-9 w-9'}/> : <div className={'h-9 min-h-[40px] w-9 min-w-[36px] rounded-full bg-neutral-200'} />
				),
				subtitle: `${vault.address}`
			});

			_actions.push(vaultAction);
			for (const strategy of vault.strategies) {
				const	strategyAction = createAction({
					parent: vaultAction.id,
					section: 'Strategies',
					name: strategy.name,
					keywords: `${strategy.name} ${strategy.address}`,
					perform: async (): Promise<boolean> => router.push(`/vault/${vault.address}/${strategy.address}`),
					icon: (vault.icon ? 
						<Image
							src={vault.icon}
							alt={vault.name}
							decoding={'async'}
							quality={70}
							width={36}
							height={36}
							className={'h-9 w-9'}/> : <div className={'h-9 min-h-[40px] w-9 min-w-[36px] rounded-full bg-neutral-200'} />
					),
					subtitle: `${strategy.address}`
				});
				_actions.push(strategyAction);
			}
		}
		set_actions(_actions);
	}, [vaults]); // eslint-disable-line react-hooks/exhaustive-deps
	useRegisterActions(actions, [actions]);

	return <span />;
}

export default KBarWrapper;