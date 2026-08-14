import clsx from 'clsx';
import type { MouseEvent, ReactNode } from 'react';

import { useMenuClose } from '#components/menu/menu_context';

export interface MenuItemProps {
	icon?: string;
	onClick: (event: MouseEvent<HTMLButtonElement>) => void;
	danger?: boolean;
	disabled?: boolean;
	children: ReactNode;
}

/**
 * A row inside a `Menu` or `ContextMenu`. Must be a direct child of one of
 * those (or of a `<>` fragment passed as their `children`/`items`): arrow
 * key navigation and close-on-select both rely on `role="menuitem"` being a
 * direct descendant. Wrapping items in another element (e.g. a `<div>` for
 * a labeled section) will render fine but breaks both.
 *
 * Works standalone outside a `Menu`/`ContextMenu` too (e.g. in isolation in
 * Storybook): `onClick` still fires, it just won't auto-close anything.
 */
export function MenuItem({
	icon,
	onClick,
	danger = false,
	disabled = false,
	children,
}: Readonly<MenuItemProps>) {
	const closeMenu = useMenuClose();

	return (
		<button
			type="button"
			role="menuitem"
			tabIndex={-1}
			onClick={(event) => {
				event.stopPropagation();
				onClick(event);
				closeMenu?.();
			}}
			disabled={disabled}
			className={clsx(
				'flex w-full cursor-pointer items-center gap-2 whitespace-nowrap px-4 py-2 text-left text-sm transition-colors',
				'hover:enabled:bg-gray-100 dark:hover:enabled:bg-gray-700',
				'focus-visible:bg-gray-100 focus-visible:outline-none dark:focus-visible:bg-gray-700',
				'disabled:cursor-not-allowed disabled:opacity-50',
				danger
					? 'text-red-600 dark:text-red-400'
					: 'text-gray-700 dark:text-gray-300'
			)}
		>
			{icon && <div className={clsx(icon, 'h-4 w-4 flex-shrink-0')} />}
			{children}
		</button>
	);
}
