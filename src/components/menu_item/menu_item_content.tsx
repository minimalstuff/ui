import clsx from 'clsx';

import type { MenuItemBaseProps } from '#components/menu_item/menu_item_props';

/**
 * Leading part of a menu row: the optional icon, then the label. The icon is
 * decoration — the label already says what the row does.
 */
export const MenuItemContent = ({
	icon,
	danger = false,
	unstyled = false,
	children,
}: Readonly<
	Pick<MenuItemBaseProps, 'icon' | 'danger' | 'unstyled' | 'children'>
>) => (
	<>
		{icon && (
			<span
				className={clsx(
					icon,
					'h-4 w-4 flex-shrink-0',
					!danger && !unstyled && 'text-gray-500 dark:text-gray-400'
				)}
				aria-hidden="true"
			/>
		)}
		{children}
	</>
);
