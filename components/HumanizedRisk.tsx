import	React, {ReactElement}	from	'react';

export function	HumanizeRisk({risk}: {risk: number}): ReactElement {
	if (risk === 0)
		return <p className={'text-base'}>{'None'}</p>;
	if (risk === 1)
		return <b className={'text-base'}>{'Low'}</b>;
	if (risk === 2)
		return <b className={'text-base text-alert-warning-primary'}>{'Medium'}</b>;
	if (risk === 3)
		return <b className={'text-base text-alert-error-primary'}>{'Severe'}</b>;
	if (risk === 4)
		return <b className={'text-base text-alert-error-primary'}>{'High'}</b>;
	return <b className={'text-base text-alert-critical-primary'}>{'Critical'}</b>;
}
