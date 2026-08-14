import type {
	HTMLAttributeAnchorTarget,
	MouseEvent,
	ReactNode,
	Ref,
} from 'react';

export type MenuItemBaseProps = {
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
