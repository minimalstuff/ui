import clsx from 'clsx';

import { ACTIVE_ITEM_FOCUS_OUTLINE } from '#components/shared/focus_styles';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';

type MenuItemVariant = 'default' | 'danger';

export type MenuItemHoverClasses = Readonly<Record<MenuItemVariant, string>>;

const LAYOUT_CLASSES =
	'flex w-full cursor-pointer items-center whitespace-nowrap text-left';

const VISUAL_CLASSES = 'gap-2 px-3 py-2 text-sm transition-colors';

const VARIANT_CLASSES: Readonly<Record<MenuItemVariant, string>> = {
	default:
		'text-gray-900 dark:text-gray-100 focus-visible:bg-blue-50 dark:focus-visible:bg-blue-900/40',
	danger:
		'text-red-700 dark:text-red-400 focus-visible:bg-red-50 dark:focus-visible:bg-red-950/40',
};

type MenuItemClassesOptions = Readonly<{
	hoverClasses: MenuItemHoverClasses;
	stateClasses: readonly string[];
	danger: boolean;
	unstyled: boolean;
	radius?: Radius;
	className?: string;
}>;

/**
 * Each element type guards its hover state differently, so it supplies the
 * hover literals per variant plus its own state classes (disabled, etc.).
 * `unstyled` keeps the layout and the state classes, and drops everything
 * else, including the focus outline: the browser's native focus ring applies.
 */
export function menuItemClasses({
	hoverClasses,
	stateClasses,
	danger,
	unstyled,
	radius,
	className,
}: MenuItemClassesOptions): string {
	const variant: MenuItemVariant = danger ? 'danger' : 'default';

	return clsx(
		LAYOUT_CLASSES,
		!unstyled && [
			ACTIVE_ITEM_FOCUS_OUTLINE,
			VISUAL_CLASSES,
			VARIANT_CLASSES[variant],
			hoverClasses[variant],
			radius && RADIUS_CLASSES[radius],
		],
		stateClasses,
		className
	);
}
