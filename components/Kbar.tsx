import	React, {ReactElement}		from	'react';
import {
	ActionId,
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarSearch,
	KBarResults,
	useMatches,
	ActionImpl
} from 'kbar';

const searchStyle = {
	padding: '12px 16px',
	fontSize: '16px',
	width: '100%',
	boxSizing: 'border-box' as React.CSSProperties['boxSizing'],
	outline: 'none',
	border: 'none',
	background: 'rgb(var(--color-surface))',
	color: 'var(--foreground)'
};
  
const animatorStyle = {
	maxWidth: '600px',
	width: '100%',
	border: '1px solid rgb(var(--color-background-variant))',
	background: 'rgb(var(--color-surface))',
	color: 'var(--foreground)',
	borderRadius: '8px',
	overflow: 'hidden',
	boxShadow: 'var(--shadow)'
};
  
const groupNameStyle = {
	padding: '8px 16px',
	fontSize: '10px',
	textTransform: 'uppercase' as const,
	opacity: 0.5
};

// eslint-disable-next-line react/display-name
const ResultItem = React.forwardRef((
	{action, active, currentRootActionId}:
	{action: ActionImpl; active: boolean; currentRootActionId: ActionId;},
	ref: React.Ref<HTMLDivElement>
): ReactElement => {
	const ancestors = React.useMemo((): unknown => {
		if (!currentRootActionId) return action.ancestors;
		const index = action.ancestors.findIndex((ancestor: any): any => ancestor.id === currentRootActionId);
		return action.ancestors.slice(index + 1);
	}, [action.ancestors, currentRootActionId]);
	
	return (
		<div
			ref={ref}
			className={`py-3 px-4 ${active ? 'bg-surface-variant border-background-variant' : 'bg-transparent border-transparent'} transition-colors hover:bg-surface-variant border-l-2 flex items-center justify-between cursor-pointer`}>
			<div className={'flex gap-4 items-center text-sm'}>
				{action.icon && action.icon}
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<div>
						{(ancestors as unknown[]).length > 0 && (ancestors as unknown[]).map((ancestor: any): ReactElement => (
							<React.Fragment key={ancestor.id}>
								<span style={{opacity: 0.5, marginRight: 8}}>
									{ancestor.name}
								</span>
								<span style={{marginRight: 8}}>
									&rsaquo;
								</span>
							</React.Fragment>
						))}
						<span className={'text-base text-typo-primary'}>{action.name}</span>
					</div>
					{action.subtitle && (
						<span className={'text-xs text-typo-secondary'}>
							{action.subtitle}
						</span>
					)}
				</div>
			</div>
			{action.shortcut?.length ? (
				<div
					aria-hidden
					style={{display: 'grid', gridAutoFlow: 'column', gap: '4px'}}
				>
					{action.shortcut.map((sc: any): ReactElement => (
						<kbd
							key={sc}
							className={'flex justify-center items-center p-1 w-6 h-6 text-sm text-center rounded-[4px] bg-dark/20'}>
							{sc}
						</kbd>
					))}
				</div>
			) : null}
		</div>
	);
}
);
  

function RenderResults(): ReactElement {
	const {results, rootActionId} = useMatches();
  
	return (
		<KBarResults
			items={results}
			onRender={({item, active}): ReactElement =>
				typeof item === 'string' ? (
					<div style={groupNameStyle}>{item}</div>
				) : (
					<ResultItem
						action={item}
						active={active}
						currentRootActionId={rootActionId as string}
					/>
				)
			}
		/>
	);
}

function	KBar(): ReactElement {
	return (
		<KBarPortal>
			<KBarPositioner className={'overflow-y-auto fixed inset-0 z-[9999]'}>
				<div className={'fixed inset-0 z-10 transition-opacity bg-[#000000]/50'} />
				<KBarAnimator style={animatorStyle} className={'z-50'}>
					<KBarSearch style={searchStyle} />
					<RenderResults />
				</KBarAnimator>
			</KBarPositioner>
		</KBarPortal>
	);
}

export default KBar;
