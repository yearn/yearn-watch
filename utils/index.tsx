export function getTvlImpact(tvl: number): number {
	if (tvl === 0)
		return 0;
	if (tvl < 1_000_000)
		return 1;
	if (tvl < 10_000_000)
		return 2;
	if (tvl < 50_000_000)
		return 3;
	if (tvl < 100_000_000)
		return 4;
	return 5;
}

export function getLongevityScore(days: number): number {
	/*
        5: Worst Score, new code, did not go to ape tax before
        4: Code has been live less than a month
        3: 1 to <4 months live
        2: 4+ months live
        1: Best score, Has had a 8+ months live in prod with no critical issues found and No changes in code base
    */
	if (days < 7) {
		return 5;
	}
	if (days <= 30) {
		return 4;
	}
	if (days < 120) {
		return 3;
	}
	if (days <= 240) {
		return 2;
	}
	return 1;
}

type TGenericListItem = {[x: string]: string[]};
export function getExcludeIncludeUrlParams(item: TGenericListItem): string {
	console.log(item);
	const include = ([...item?.include || [], ...item?.nameLike || []]).join('&include='); //Not existing rn
	const exclude = (item?.exclude || []).join('&exclude=');
	if (exclude.length === 0 && include.length === 0)
		return ('');
	if (exclude.length === 0)
		return (`?include=${include}`);
	if (include.length === 0)
		return (`?exclude=${exclude}`);
	return (`?include=${include}&exclude=${exclude}`);
}

export function median(values: number[]): number {
	if (values.length === 0)
		return 0;
  
	values.sort((a, b): number => a - b);
  
	const half = Math.floor(values.length / 2);
	if (values.length % 2)
		return values[half];
	return (values[half - 1] + values[half]) / 2.0;
}

export function getImpactScoreColor(score: number): string {
	const colors = ['#19c519', '#f5f514', '#ff6262'];
	return (colors[score]);
}

export function getImpactScore(impact: number, likelihood: number): number {
	const scores = [
		[1, 1, 2, 2, 2],
		[0, 1, 1, 2, 2],
		[0, 0, 1, 1, 2],
		[0, 0, 0, 1, 1],
		[0, 0, 0, 0, 1]
	];
	if (impact === 0)
		impact = 1;
	const impactIndex = scores.length - impact;
	const likelihoodIndex = likelihood - 1;
	const score = scores[impactIndex][likelihoodIndex];
	return (score);
}