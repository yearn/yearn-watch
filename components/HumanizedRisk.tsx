import React, {ReactElement} from 'react';

export function	HumanizeRisk({risk}: {risk: number}): ReactElement {
	if (risk === 0)
		return <p className={'text-base'}>{'None'}</p>;
	if (risk === 1)
		return <b className={'text-base'}>{'Low'}</b>;
	if (risk === 2)
		return <b className={'text-base text-yellow-900'}>{'Medium'}</b>;
	if (risk === 3)
		return <b className={'text-base text-pink-900'}>{'Severe'}</b>;
	if (risk === 4)
		return <b className={'text-base text-pink-900'}>{'High'}</b>;
	return <b className={'text-base text-red-900'}>{'Critical'}</b>;
}
