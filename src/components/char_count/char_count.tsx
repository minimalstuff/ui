const CHARACTER_COUNT_STYLES =
	'text-xs text-gray-500 dark:text-gray-400 mt-1 text-right';

type BoundStatus = 'ok' | 'atLimit' | 'overLimit';

function getBoundStatusClass(status: BoundStatus): string {
	if (status === 'overLimit') return 'text-red-600 dark:text-red-400';
	if (status === 'atLimit') return 'text-amber-600 dark:text-amber-400';
	return '';
}

interface CharacterCountProps {
	current: number;
	min?: number;
	max?: number;
	showMin?: boolean;
	showMax?: boolean;
}

export function CharacterCount({
	current,
	min,
	max,
	showMin,
	showMax,
}: CharacterCountProps) {
	const showLabels = showMin === true || showMax === true;

	const minStatus: BoundStatus =
		min !== undefined && current <= min ? 'atLimit' : 'ok';
	const maxStatus: BoundStatus =
		max !== undefined && current > max
			? 'overLimit'
			: max !== undefined && current >= max
				? 'atLimit'
				: 'ok';

	const minText = showLabels
		? `${current}/${min} min`
		: `${current} (min ${min})`;
	const maxText = showLabels ? `${current}/${max} max` : `${current}/${max}`;

	return (
		<div className={CHARACTER_COUNT_STYLES}>
			{showMin && min !== undefined && (
				<span className={getBoundStatusClass(minStatus)}>{minText}</span>
			)}
			{showMin && showMax && ' · '}
			{showMax && max !== undefined && (
				<span className={getBoundStatusClass(maxStatus)}>{maxText}</span>
			)}
			{!showMin && !showMax && max !== undefined && (
				<span className={getBoundStatusClass(maxStatus)}>{maxText}</span>
			)}
			{!showMin && !showMax && min !== undefined && max === undefined && (
				<span className={getBoundStatusClass(minStatus)}>{minText}</span>
			)}
		</div>
	);
}
