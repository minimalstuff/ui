import type { MouseEvent } from 'react';

import { useMenuClose } from '#components/menu/menu_context';
import { MenuItemEnd } from '#components/menu_item/menu_item_end';
import { menuItemClasses } from '#components/menu_item/menu_item_styles';
import { MenuItemContent } from '#components/menu_item/menu_item_content';
import type { MenuItemLinkProps } from '#components/menu_item/menu_item_props';

const EXTERNAL_TARGET = '_blank';
const EXTERNAL_REL = 'noopener noreferrer';

// `:enabled` only ever matches form controls, so this branch guards its hover
// state with `aria-disabled` + `pointer-events-none` instead.
const STATE_CLASSES = [
	'no-underline hover:bg-gray-100 dark:hover:bg-gray-700',
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
			className={menuItemClasses(STATE_CLASSES, danger, className)}
		>
			<MenuItemContent icon={icon}>{children}</MenuItemContent>
			<MenuItemEnd trailing={trailing} />
		</a>
	);
}
