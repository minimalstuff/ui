const CHARACTER_COUNT_STYLES =
	'text-xs text-gray-500 dark:text-gray-400 mt-1 text-right';

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
	const atMin = min !== undefined && current <= min;
	const atMax = max !== undefined && current >= max;
	const overMax = max !== undefined && current > max;

	return (
		<div className={CHARACTER_COUNT_STYLES}>
			{showMin && min !== undefined && (
				<span className={atMin ? 'text-amber-600 dark:text-amber-400' : ''}>
					{current}/{min} min
				</span>
			)}
			{showMin && showMax && ' · '}
			{showMax && max !== undefined && (
				<span
					className={
						overMax
							? 'text-red-600 dark:text-red-400'
							: atMax
								? 'text-amber-600 dark:text-amber-400'
								: ''
					}
				>
					{current}/{max} max
				</span>
			)}
			{!showMin && !showMax && max !== undefined && (
				<span
					className={
						overMax
							? 'text-red-600 dark:text-red-400'
							: atMax
								? 'text-amber-600 dark:text-amber-400'
								: ''
					}
				>
					{current}/{max}
				</span>
			)}
			{!showMin && !showMax && min !== undefined && max === undefined && (
				<span className={atMin ? 'text-amber-600 dark:text-amber-400' : ''}>
					{current} (min {min})
				</span>
			)}
		</div>
	);
}
