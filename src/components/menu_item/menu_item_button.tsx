import type { MouseEvent } from 'react';

import { useMenuClose } from '#components/menu/menu_context';
import { MenuItemContent } from '#components/menu_item/menu_item_content';
import { MenuItemEnd } from '#components/menu_item/menu_item_end';
import type { MenuItemButtonProps } from '#components/menu_item/menu_item_props';
import {
	menuItemClasses,
	type MenuItemHoverClasses,
} from '#components/menu_item/menu_item_styles';

const HOVER_CLASSES: MenuItemHoverClasses = {
	default: 'hover:enabled:bg-gray-50 dark:hover:enabled:bg-gray-800/60',
	danger: 'hover:enabled:bg-red-50 dark:hover:enabled:bg-red-950/40',
};

const STATE_CLASSES = ['disabled:cursor-not-allowed disabled:opacity-50'];

/**
 * The `<button>` half of `MenuItem`, for rows that run an action rather than
 * navigate. Selecting one closes the enclosing menu, if there is one.
 */
export function MenuItemButton({
	icon,
	trailing,
	onClick,
	selected,
	danger = false,
	disabled = false,
	children,
	className,
	ref,
}: Readonly<MenuItemButtonProps>) {
	const closeMenu = useMenuClose();
	const isOption = selected !== undefined;

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		onClick(event);
		closeMenu?.();
	};

	return (
		<button
			ref={ref}
			type="button"
			role={isOption ? 'menuitemradio' : 'menuitem'}
			aria-checked={selected}
			tabIndex={-1}
			onClick={handleClick}
			disabled={disabled}
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
			<MenuItemEnd trailing={trailing} selected={selected} />
		</button>
	);
}
