import	React, {ReactElement} 	from	'react';
import	{TRiskGroup}			from	'contexts/useWatch.d';

/* 🔵 - Yearn Finance **********************************************************
** This will render the Matrix chart, used to quickly identify the risk for
** each strategy.
******************************************************************************/
function	SectionMatrix({groups}: {groups: TRiskGroup[]}): ReactElement {
	const	[labelPerPosition, set_labelPerPosition] = React.useState([
		[[], [], [], [], []],
		[[], [], [], [], []],
		[[], [], [], [], []],
		[[], [], [], [], []],
		[[], [], [], [], []]
	]);

	React.useEffect((): void => {
		const	_labelPerPosition = [
			[[], [], [], [], []],
			[[], [], [], [], []],
			[[], [], [], [], []],
			[[], [], [], [], []],
			[[], [], [], [], []]
		];
		for (const _group of groups) {
			const likelihoodIndex = _group.medianScore - 1;
			let	impact = _group.tvlImpact;
			if (impact === 0)
				impact = 1;
			const impactIndex = 5 - impact;

			_labelPerPosition[impactIndex][likelihoodIndex].push(_group.label as never);
		}

		set_labelPerPosition(_labelPerPosition);
	}, [groups]);

	return (
		<section
			aria-label={'Matix chart'}
			className={'flex flex-row pl-0'}>
			<div className={'grid w-full grid-cols-10 gap-0.5'}>
				<div className={'col-span-2 h-full space-y-1 p-2 text-sm text-neutral-500 opacity-50'}>{'Rare'}</div>
				<div className={'col-span-2 h-full space-y-1 p-2 text-sm text-neutral-500 opacity-50'}>{'Unlikely'}</div>
				<div className={'col-span-2 h-full space-y-1 p-2 text-sm text-neutral-500 opacity-50'}>{'Even chance'}</div>
				<div className={'col-span-2 h-full space-y-1 p-2 text-sm text-neutral-500 opacity-50'}>{'Likely'}</div>
				<div className={'col-span-2 h-full space-y-1 p-2 text-sm text-neutral-500 opacity-50'}>{'Almost certain'}</div>
				
				<div className={'relative col-span-2 min-h-[62px] space-y-1 rounded-tl-lg bg-[#f5f514] p-2 text-sm'}>
					<div className={'flex h-full items-center justify-center text-center text-sm'}>
						<p className={'absolute -left-6 -rotate-180 text-neutral-500 opacity-50'} style={{writingMode: 'vertical-rl'}}>{'Critical'}</p>
					</div>
					{labelPerPosition[0][0].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#f5f514] p-2 text-sm'}>
					{labelPerPosition[0][1].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#ff6262] p-2 text-sm'}>
					{labelPerPosition[0][2].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#ff6262] p-2 text-sm'}>
					{labelPerPosition[0][3].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 rounded-tr-lg bg-[#ff6262] p-2 text-sm'}>
					{labelPerPosition[0][4].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				
				<div className={'relative col-span-2 min-h-[62px] space-y-1 bg-[#19c519] p-2 text-sm'}>
					<div className={'flex h-full items-center justify-center text-center text-sm'}>
						<p className={'absolute -left-6 -rotate-180 text-neutral-500 opacity-50'} style={{writingMode: 'vertical-rl'}}>{'High'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'High'}</p>
					</div>
					{labelPerPosition[1][0].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#f5f514] p-2 text-sm'}>
					{labelPerPosition[1][1].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#f5f514] p-2 text-sm'}>
					{labelPerPosition[1][2].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#ff6262] p-2 text-sm'}>
					{labelPerPosition[1][3].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#ff6262] p-2 text-sm'}>
					{labelPerPosition[1][4].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				
				<div className={'relative col-span-2 min-h-[62px] space-y-1 bg-[#19c519] p-2 text-sm'}>
					<div className={'flex h-full items-center justify-center text-center text-sm'}>
						<p className={'absolute -left-6 -rotate-180 text-neutral-500 opacity-50'} style={{writingMode: 'vertical-rl'}}>{'Severe'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'Severe'}</p>
					</div>
					{labelPerPosition[2][0].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#19c519] p-2 text-sm'}>
					{labelPerPosition[2][1].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#f5f514] p-2 text-sm'}>
					{labelPerPosition[2][2].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#f5f514] p-2 text-sm'}>
					{labelPerPosition[2][3].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#ff6262] p-2 text-sm'}>
					{labelPerPosition[2][4].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>

				<div className={'relative col-span-2 min-h-[62px] space-y-1 bg-[#19c519] p-2 text-sm'}>
					<div className={'flex h-full items-center justify-center text-center text-sm'}>
						<p className={'absolute -left-6 -rotate-180 text-neutral-500 opacity-50'} style={{writingMode: 'vertical-rl'}}>{'Medium'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'Medium'}</p>
					</div>
					{labelPerPosition[3][0].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#19c519] p-2 text-sm'}>
					{labelPerPosition[3][1].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#19c519] p-2 text-sm'}>
					{labelPerPosition[3][2].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#f5f514] p-2 text-sm'}>
					{labelPerPosition[3][3].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#f5f514] p-2 text-sm'}>
					{labelPerPosition[3][4].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>

				<div className={'relative col-span-2 min-h-[62px] space-y-1 rounded-bl-lg bg-[#19c519] p-2 text-sm'}>
					<div className={'flex h-full items-center justify-center text-center text-sm'}>
						<p className={'absolute -left-6 -rotate-180 text-neutral-500 opacity-50'} style={{writingMode: 'vertical-rl'}}>{'Low'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'Low'}</p>
					</div>
					{labelPerPosition[4][0].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#19c519] p-2 text-sm'}>
					{labelPerPosition[4][1].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#19c519] p-2 text-sm'}>
					{labelPerPosition[4][2].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 bg-[#19c519] p-2 text-sm'}>
					{labelPerPosition[4][3].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 space-y-1 rounded-br-lg bg-[#f5f514] p-2 text-sm'}>
					{labelPerPosition[4][4].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
			</div>
		</section>
	);
}

export default SectionMatrix;