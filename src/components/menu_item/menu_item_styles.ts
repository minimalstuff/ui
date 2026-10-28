import clsx from 'clsx';

import { ACTIVE_ITEM_FOCUS_OUTLINE } from '#components/shared/focus_styles';

type MenuItemVariant = 'default' | 'danger';

export type MenuItemHoverClasses = Readonly<Record<MenuItemVariant, string>>;

const BASE_CLASSES = [
	'flex w-full cursor-pointer items-center gap-2 whitespace-nowrap px-3 py-2 text-left text-sm transition-colors',
	ACTIVE_ITEM_FOCUS_OUTLINE,
];

const VARIANT_CLASSES: Readonly<Record<MenuItemVariant, string>> = {
	default:
		'text-gray-900 dark:text-gray-100 focus-visible:bg-blue-50 dark:focus-visible:bg-blue-900/40',
	danger:
		'text-red-700 dark:text-red-400 focus-visible:bg-red-50 dark:focus-visible:bg-red-950/40',
};

/**
 * Each element type guards its hover state differently, so it supplies the
 * hover literals per variant plus its own state classes (disabled, etc.).
 */
export function menuItemClasses(
	hoverClasses: MenuItemHoverClasses,
	stateClasses: readonly string[],
	danger: boolean,
	className?: string
): string {
	const variant: MenuItemVariant = danger ? 'danger' : 'default';

	return clsx(
		BASE_CLASSES,
		VARIANT_CLASSES[variant],
		hoverClasses[variant],
		stateClasses,
		className
	);
}
