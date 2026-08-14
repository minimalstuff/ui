import { MenuItemLink } from '#components/menu_item/menu_item_link';
import { MenuItemButton } from '#components/menu_item/menu_item_button';
import type { MenuItemProps } from '#components/menu_item/menu_item_props';

export type {
	MenuItemButtonProps,
	MenuItemLinkProps,
	MenuItemProps,
} from '#components/menu_item/menu_item_props';

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
