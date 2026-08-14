import clsx from 'clsx';

const CHARACTER_COUNT_STYLES =
	'text-xs text-gray-500 dark:text-gray-400 mt-1 text-right';

type BoundStatus = 'ok' | 'atLimit' | 'overLimit';

function getBoundStatusClass(status: BoundStatus, unstyled: boolean): string {
	if (unstyled) return '';
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
	unstyled?: boolean;
	className?: string;
}

export function CharacterCount({
	current,
	min,
	max,
	showMin,
	showMax,
	unstyled = false,
	className,
}: Readonly<CharacterCountProps>) {
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
		<div className={clsx(!unstyled && CHARACTER_COUNT_STYLES, className)}>
			{showMin && min !== undefined && (
				<span className={getBoundStatusClass(minStatus, unstyled)}>
					{minText}
				</span>
			)}
			{showMin && showMax && ' · '}
			{showMax && max !== undefined && (
				<span className={getBoundStatusClass(maxStatus, unstyled)}>
					{maxText}
				</span>
			)}
			{!showMin && !showMax && max !== undefined && (
				<span className={getBoundStatusClass(maxStatus, unstyled)}>
					{maxText}
				</span>
			)}
			{!showMin && !showMax && min !== undefined && max === undefined && (
				<span className={getBoundStatusClass(minStatus, unstyled)}>
					{minText}
				</span>
			)}
		</div>
	);
}
