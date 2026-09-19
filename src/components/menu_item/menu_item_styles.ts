import clsx from 'clsx';

import { ACTIVE_ITEM_FOCUS_OUTLINE } from '#components/shared/focus_styles';

const BASE_CLASSES = [
	'flex w-full cursor-pointer items-center gap-2 whitespace-nowrap px-4 py-2 text-left text-sm transition-colors',
	'focus-visible:bg-gray-100 dark:focus-visible:bg-gray-700',
	ACTIVE_ITEM_FOCUS_OUTLINE,
];

export function menuItemClasses(
	stateClasses: readonly string[],
	danger: boolean,
	className?: string
): string {
	return clsx(
		BASE_CLASSES,
		stateClasses,
		danger
			? 'text-red-700 dark:text-red-300'
			: 'text-gray-700 dark:text-gray-300',
		className
	);
}
