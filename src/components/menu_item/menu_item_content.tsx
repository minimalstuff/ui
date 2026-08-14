import clsx from 'clsx';

import type { MenuItemBaseProps } from '#components/menu_item/menu_item_props';

/**
 * Leading part of a menu row: the optional icon, then the label. The icon is
 * decoration — the label already says what the row does.
 */
export const MenuItemContent = ({
	icon,
	children,
}: Readonly<Pick<MenuItemBaseProps, 'icon' | 'children'>>) => (
	<>
		{icon && (
			<div className={clsx(icon, 'h-4 w-4 flex-shrink-0')} aria-hidden="true" />
		)}
		{children}
	</>
);
