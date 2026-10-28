import type { MouseEvent } from 'react';

import { useMenuClose } from '#components/menu/menu_context';
import { MenuItemContent } from '#components/menu_item/menu_item_content';
import { MenuItemEnd } from '#components/menu_item/menu_item_end';
import type { MenuItemLinkProps } from '#components/menu_item/menu_item_props';
import {
	menuItemClasses,
	type MenuItemHoverClasses,
} from '#components/menu_item/menu_item_styles';

const EXTERNAL_TARGET = '_blank';
const EXTERNAL_REL = 'noopener noreferrer';

const HOVER_CLASSES: MenuItemHoverClasses = {
	default: 'hover:bg-gray-50 dark:hover:bg-gray-800/60',
	danger: 'hover:bg-red-50 dark:hover:bg-red-950/40',
};

// `:enabled` only ever matches form controls, so this branch guards its hover
// state with `aria-disabled` + `pointer-events-none` instead.
const STATE_CLASSES = [
	'no-underline',
	'aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
];

/**
 * The `<a>` half of `MenuItem`, for rows that navigate. A disabled link drops
 * its `href` and is marked `aria-disabled`, which keeps it out of the menu's
 * keyboard navigation just like a disabled button.
 */
export function MenuItemLink({
	icon,
	trailing,
	href,
	target,
	rel,
	danger = false,
	disabled = false,
	children,
	className,
	ref,
}: Readonly<MenuItemLinkProps>) {
	const closeMenu = useMenuClose();
	const isExternal = target === EXTERNAL_TARGET;

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		event.stopPropagation();
		closeMenu?.();
	};

	return (
		<a
			ref={ref}
			role="menuitem"
			tabIndex={-1}
			href={disabled ? undefined : href}
			target={target}
			rel={rel ?? (isExternal ? EXTERNAL_REL : undefined)}
			aria-disabled={disabled || undefined}
			onClick={handleClick}
			className={menuItemClasses(
				HOVER_CLASSES,
				STATE_CLASSES,
				danger,
				className
			)}
		>
			<MenuItemContent icon={icon} danger={danger}>
				{children}
			</MenuItemContent>
			<MenuItemEnd trailing={trailing} />
		</a>
	);
}
