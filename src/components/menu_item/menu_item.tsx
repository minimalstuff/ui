import clsx from 'clsx';
import type {
	HTMLAttributeAnchorTarget,
	MouseEvent,
	ReactNode,
	Ref,
} from 'react';

import { useMenuClose } from '#components/menu/menu_context';

const EXTERNAL_TARGET = '_blank';
const EXTERNAL_REL = 'noopener noreferrer';

type MenuItemBaseProps = {
	icon?: string;
	/**
	 * Content pinned to the end of the row, dimmed by default — a `Kbd`, the
	 * current value of a setting. Keep it inert: the whole row is already the
	 * control, so anything focusable or separately clickable in here breaks
	 * both the menu's keyboard navigation and its `menuitem` semantics.
	 *
	 * It sits inside the row, so it is part of what the row announces:
	 * "Theme, Dark" for a value, "Shortcuts, Command K" for a shortcut. That
	 * is usually what you want; pass already-hidden content if it is not.
	 */
	trailing?: ReactNode;
	danger?: boolean;
	disabled?: boolean;
	children: ReactNode;
	className?: string;
};

export type MenuItemButtonProps = MenuItemBaseProps & {
	onClick: (event: MouseEvent<HTMLButtonElement>) => void;
	/**
	 * Turns the item into one option of a choice: it reports as
	 * `menuitemradio`, carries `aria-checked`, and shows a check mark when
	 * true. Leave it out for plain actions — an unset `selected` is not the
	 * same as `false`, which reads as "an option, currently not the one".
	 */
	selected?: boolean;
	href?: never;
	target?: never;
	rel?: never;
	ref?: Ref<HTMLButtonElement>;
};

export type MenuItemLinkProps = MenuItemBaseProps & {
	href: string;
	target?: HTMLAttributeAnchorTarget;
	rel?: string;
	onClick?: never;
	ref?: Ref<HTMLAnchorElement>;
};

export type MenuItemProps = MenuItemButtonProps | MenuItemLinkProps;

const BASE_CLASSES = [
	'flex w-full cursor-pointer items-center gap-2 whitespace-nowrap px-4 py-2 text-left text-sm transition-colors',
	'focus-visible:bg-gray-100 focus-visible:outline-none dark:focus-visible:bg-gray-700',
];

// `:enabled` only ever matches form controls, so the anchor branch guards its
// hover state with `aria-disabled` + `pointer-events-none` instead.
const BUTTON_STATE_CLASSES = [
	'hover:enabled:bg-gray-100 dark:hover:enabled:bg-gray-700',
	'disabled:cursor-not-allowed disabled:opacity-50',
];

const LINK_STATE_CLASSES = [
	'no-underline hover:bg-gray-100 dark:hover:bg-gray-700',
	'aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
];

function menuItemClasses(
	stateClasses: readonly string[],
	danger: boolean,
	className?: string
): string {
	return clsx(
		BASE_CLASSES,
		stateClasses,
		danger
			? 'text-red-600 dark:text-red-400'
			: 'text-gray-700 dark:text-gray-300',
		className
	);
}

const MenuItemContent = ({
	icon,
	trailing,
	children,
}: Readonly<Pick<MenuItemBaseProps, 'icon' | 'trailing' | 'children'>>) => (
	<>
		{icon && (
			<div className={clsx(icon, 'h-4 w-4 flex-shrink-0')} aria-hidden="true" />
		)}
		{children}
		{trailing && (
			// Dimmed, but not below AA: gray-400 sits at 2.5:1 on white.
			<span className="ml-auto flex-shrink-0 pl-2 text-xs text-gray-500 dark:text-gray-400">
				{trailing}
			</span>
		)}
	</>
);

function MenuItemButton({
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
			className={menuItemClasses(BUTTON_STATE_CLASSES, danger, className)}
		>
			<MenuItemContent icon={icon} trailing={trailing}>
				{children}
			</MenuItemContent>
			{isOption && (
				// Rendered either way so picking another option doesn't reflow the
				// row it left behind.
				<span
					className={clsx(
						'i-mdi-check ml-auto h-4 w-4 flex-shrink-0',
						!selected && 'invisible'
					)}
					aria-hidden="true"
				/>
			)}
		</button>
	);
}

function MenuItemLink({
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
			className={menuItemClasses(LINK_STATE_CLASSES, danger, className)}
		>
			<MenuItemContent icon={icon} trailing={trailing}>
				{children}
			</MenuItemContent>
		</a>
	);
}

/**
 * A row inside a `Menu` or `ContextMenu`, at any depth: the menu collects
 * `[role="menuitem"]`/`[role="menuitemradio"]` across all its descendants
 * for keyboard navigation, and close-on-select travels through React
 * context rather than the DOM tree. `MenuGroup` relies on that to wrap the
 * items it names.
 *
 * Renders either a `<button>` (pass `onClick`) or a native `<a>` (pass
 * `href`, plus optional `target`/`rel`); the two are mutually exclusive.
 * A disabled link drops its `href` and is marked `aria-disabled`, which
 * keeps it out of the menu's keyboard navigation just like a disabled
 * button.
 *
 * Works standalone outside a `Menu`/`ContextMenu` too (e.g. in isolation in
 * Storybook): `onClick` still fires, it just won't auto-close anything.
 */
export function MenuItem(menuItemProps: Readonly<MenuItemProps>) {
	if (menuItemProps.href !== undefined) {
		return <MenuItemLink {...menuItemProps} />;
	}

	return <MenuItemButton {...menuItemProps} />;
}
