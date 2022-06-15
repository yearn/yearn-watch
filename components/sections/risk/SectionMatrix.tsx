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
			<div className={'grid grid-cols-10 gap-0.5 w-full'}>
				<div className={'col-span-2 p-2 space-y-1 h-full text-sm opacity-50 text-neutral-500'}>{'Rare'}</div>
				<div className={'col-span-2 p-2 space-y-1 h-full text-sm opacity-50 text-neutral-500'}>{'Unlikely'}</div>
				<div className={'col-span-2 p-2 space-y-1 h-full text-sm opacity-50 text-neutral-500'}>{'Even chance'}</div>
				<div className={'col-span-2 p-2 space-y-1 h-full text-sm opacity-50 text-neutral-500'}>{'Likely'}</div>
				<div className={'col-span-2 p-2 space-y-1 h-full text-sm opacity-50 text-neutral-500'}>{'Almost certain'}</div>
				
				<div className={'relative col-span-2 p-2 space-y-1 min-h-[62px] text-sm bg-[#f5f514] rounded-tl-lg'}>
					<div className={'flex justify-center items-center h-full text-sm text-center'}>
						<p className={'absolute -left-6 opacity-50 -rotate-180 text-neutral-500'} style={{writingMode: 'vertical-rl'}}>{'Critical'}</p>
					</div>
					{labelPerPosition[0][0].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>
					{labelPerPosition[0][1].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262]'}>
					{labelPerPosition[0][2].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262]'}>
					{labelPerPosition[0][3].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262] rounded-tr-lg'}>
					{labelPerPosition[0][4].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				
				<div className={'relative col-span-2 p-2 space-y-1 min-h-[62px] text-sm bg-[#19c519]'}>
					<div className={'flex justify-center items-center h-full text-sm text-center'}>
						<p className={'absolute -left-6 opacity-50 -rotate-180 text-neutral-500'} style={{writingMode: 'vertical-rl'}}>{'High'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'High'}</p>
					</div>
					{labelPerPosition[1][0].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>
					{labelPerPosition[1][1].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>
					{labelPerPosition[1][2].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262]'}>
					{labelPerPosition[1][3].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262]'}>
					{labelPerPosition[1][4].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				
				<div className={'relative col-span-2 p-2 space-y-1 min-h-[62px] text-sm bg-[#19c519]'}>
					<div className={'flex justify-center items-center h-full text-sm text-center'}>
						<p className={'absolute -left-6 opacity-50 -rotate-180 text-neutral-500'} style={{writingMode: 'vertical-rl'}}>{'Severe'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'Severe'}</p>
					</div>
					{labelPerPosition[2][0].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>
					{labelPerPosition[2][1].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>
					{labelPerPosition[2][2].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>
					{labelPerPosition[2][3].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#ff6262]'}>
					{labelPerPosition[2][4].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>

				<div className={'relative col-span-2 p-2 space-y-1 min-h-[62px] text-sm bg-[#19c519]'}>
					<div className={'flex justify-center items-center h-full text-sm text-center'}>
						<p className={'absolute -left-6 opacity-50 -rotate-180 text-neutral-500'} style={{writingMode: 'vertical-rl'}}>{'Medium'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'Medium'}</p>
					</div>
					{labelPerPosition[3][0].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>
					{labelPerPosition[3][1].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>
					{labelPerPosition[3][2].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>
					{labelPerPosition[3][3].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514]'}>
					{labelPerPosition[3][4].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>

				<div className={'relative col-span-2 p-2 space-y-1 min-h-[62px] text-sm bg-[#19c519] rounded-bl-lg'}>
					<div className={'flex justify-center items-center h-full text-sm text-center'}>
						<p className={'absolute -left-6 opacity-50 -rotate-180 text-neutral-500'} style={{writingMode: 'vertical-rl'}}>{'Low'}</p>
						<p className={'invisible -rotate-180'} style={{writingMode: 'vertical-rl'}}>{'Low'}</p>
					</div>
					{labelPerPosition[4][0].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>
					{labelPerPosition[4][1].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>
					{labelPerPosition[4][2].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#19c519]'}>
					{labelPerPosition[4][3].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
				<div className={'col-span-2 p-2 space-y-1 text-sm bg-[#f5f514] rounded-br-lg'}>
					{labelPerPosition[4][4].map((e): ReactElement => <p key={e} className={'text-[#000000]'}>{e}</p>)}
				</div>
			</div>
		</section>
	);
}

export default SectionMatrix;