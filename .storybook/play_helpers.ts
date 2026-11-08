import { expect, userEvent, waitFor, within } from 'storybook/test';

import { MODAL_EXIT_DURATION_MS } from '#components/shared/animation';

/** The enter transition starts from a requestAnimationFrame, which a starved CPU delays well past the default `asyncUtilTimeout`. */
const DIALOG_OPEN_TIMEOUT_MS = 10_000;

/** Margin on top of the modal exit animation, so a "still open" check can't pass merely because it ran before react-call finished unmounting a closing modal. */
const EXIT_ANIMATION_SETTLE_MARGIN_MS = 100;

/** Asserts that `element` currently holds document focus. */
export async function expectFocusOn(element: Element): Promise<void> {
	await expect(element.ownerDocument.activeElement).toBe(element);
}

/** Scopes queries to `document.body`, for content rendered through a portal (e.g. `Modal`, `ConfirmModal`) rather than into `canvasElement`. */
export function getPortalScope(
	canvasElement: Element
): ReturnType<typeof within> {
	return within(canvasElement.ownerDocument.body);
}

/** Waits past the modal exit animation, so a dialog that's actually closing has time to finish unmounting before a "still open" assertion checks it. */
export function waitPastModalExitAnimation(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(
			resolve,
			MODAL_EXIT_DURATION_MS + EXIT_ANIMATION_SETTLE_MARGIN_MS
		);
	});
}

function isFullyOpaque(element: HTMLElement): boolean {
	return getComputedStyle(element).opacity === '1';
}

/** Waits until `dialog` and all its ancestors are fully opaque, i.e. its open transition is over. */
export async function waitForDialogOpen(dialog: HTMLElement): Promise<void> {
	const chain: HTMLElement[] = [];
	for (let node: HTMLElement | null = dialog; node; node = node.parentElement) {
		chain.push(node);
	}
	await waitFor(
		async () => {
			await expect(chain.every(isFullyOpaque)).toBe(true);
		},
		{ timeout: DIALOG_OPEN_TIMEOUT_MS }
	);
}

const CONTAINING_BLOCK_PROPERTIES = [
	'transform',
	'translate',
	'scale',
	'rotate',
	'filter',
	'backdrop-filter',
] as const;

async function expectPropertyIsNone(
	dialog: HTMLElement,
	property: string
): Promise<void> {
	const value = getComputedStyle(dialog).getPropertyValue(property);
	await expect(
		value,
		`dialog computed \`${property}\` is "${value}", expected "none": it would become the containing block of fixed descendants and clip menus`
	).toBe('none');
}

/**
 * Asserts that the open `dialog` has no `transform`, `translate`, `scale`,
 * `rotate`, `filter` or `backdrop-filter` left, any of which would make it the
 * containing block of a fixed descendant and clip a menu portalled into it.
 * Reads the computed style because `ms-*` shortcuts hide the utilities behind
 * them. Used where the geometry cannot expose the clipping on its own: a
 * drawer spans the full viewport height and floating-ui keeps the menu inside
 * the clipping ancestor, so the menu never leaves the panel.
 */
export async function expectDialogCreatesNoContainingBlock(
	dialog: HTMLElement
): Promise<void> {
	await waitForDialogOpen(dialog);
	await waitFor(async () => {
		await Promise.all(
			CONTAINING_BLOCK_PROPERTIES.map((property) =>
				expectPropertyIsNone(dialog, property)
			)
		);
	});
}

async function expectMenuItemHittable(item: HTMLElement): Promise<void> {
	const { left, top, width, height } = item.getBoundingClientRect();
	const hit = item.ownerDocument.elementFromPoint(
		left + width / 2,
		top + height / 2
	);
	await expect(item.contains(hit)).toBe(true);
}

/** Waits until every menu item is the topmost element at its centre, so no part of the menu is clipped by an ancestor or covered by another layer (the menu may still be moving into place when it first renders). */
async function expectEveryMenuItemHittable(menu: HTMLElement): Promise<void> {
	await waitFor(async () => {
		await Promise.all(
			within(menu).getAllByRole('menuitem').map(expectMenuItemHittable)
		);
	});
}

/** Waits until `query` finds nothing. Unlike `waitForElementToBeRemoved` it also passes when the element is already gone, which happens when the exit timer fires before the first poll. */
export async function waitForRemoval(
	query: () => HTMLElement | null
): Promise<void> {
	await waitFor(async () => {
		await expect(query()).not.toBeInTheDocument();
	});
}

/** Waits until `overlay` (a tooltip or menu) reports `data-state="open"`. A tooltip is mounted before it is visible, and its Escape handler is only attached once visible, so a key pressed in between is silently lost. */
export async function waitForOverlayOpen(overlay: HTMLElement): Promise<void> {
	await waitFor(async () => {
		await expect(overlay).toHaveAttribute('data-state', 'open');
	});
}

/** Waits until `menu` is open and holds focus on its first item, so the keys a play sends next reach it. */
export async function waitForMenuReady(menu: HTMLElement): Promise<void> {
	await waitForOverlayOpen(menu);
	const [firstItem] = within(menu).getAllByRole('menuitem');
	await waitFor(() => expectFocusOn(firstItem));
}

/** Opens the menu named `name` by clicking `trigger`, and returns it once it is ready (see `waitForMenuReady`). */
export async function openMenu(
	trigger: HTMLElement,
	name: string
): Promise<HTMLElement> {
	const scope = getPortalScope(trigger);
	await userEvent.click(trigger);
	const menu = await scope.findByRole('menu', { name });
	await waitForMenuReady(menu);
	return menu;
}

/** Asserts that `menu` sits inside `dialog` and is fully reachable (no item clipped or covered) once the dialog's open transition is over. */
export async function expectMenuReachableInDialog(
	menu: HTMLElement,
	dialog: HTMLElement
): Promise<void> {
	await expect(dialog.contains(menu)).toBe(true);
	await expectEveryMenuItemHittable(menu);
}

/** Presses `keys` (a user-event keyboard sequence such as `{Tab}`) and asserts focus is inside `dialog` afterwards. */
export async function pressKeysAndExpectFocusInDialog(
	dialog: HTMLElement,
	keys: string
): Promise<void> {
	await userEvent.keyboard(keys);
	await expect(dialog.contains(dialog.ownerDocument.activeElement)).toBe(true);
}

/** The option a combobox points to through `aria-activedescendant`. */
function getActiveOption(combobox: HTMLElement): HTMLElement {
	const activeOptionId = combobox.getAttribute('aria-activedescendant');
	if (!activeOptionId) throw new Error('expected an active option');
	const activeOption = combobox.ownerDocument.getElementById(activeOptionId);
	if (!activeOption) throw new Error('expected the active option to exist');
	return activeOption;
}

/** The 1-based `aria-posinset` of the active option, or 0 when none is active. */
export function getActiveOptionPosition(combobox: HTMLElement): number {
	if (!combobox.hasAttribute('aria-activedescendant')) return 0;
	return Number(getActiveOption(combobox).getAttribute('aria-posinset'));
}

/** Waits until the active option lies entirely within the listbox rect. */
export async function expectActiveOptionInView(
	combobox: HTMLElement,
	listbox: HTMLElement
): Promise<void> {
	await waitFor(async () => {
		const optionRect = getActiveOption(combobox).getBoundingClientRect();
		const listboxRect = listbox.getBoundingClientRect();
		await expect(optionRect.top).toBeGreaterThanOrEqual(listboxRect.top);
		await expect(optionRect.bottom).toBeLessThanOrEqual(listboxRect.bottom);
	});
}

/** Presses `key` until the active option reaches `targetPosition` (1-based), failing after `maxPresses`. */
export async function pressKeyUntilActivePosition(
	combobox: HTMLElement,
	key: 'PageDown' | 'PageUp',
	targetPosition: number,
	maxPresses: number
): Promise<void> {
	for (let press = 0; press < maxPresses; press += 1) {
		if (getActiveOptionPosition(combobox) === targetPosition) return;
		// oxlint-disable-next-line no-await-in-loop -- each press depends on where the previous one landed
		await userEvent.keyboard(`{${key}}`);
	}
	await waitFor(async () => {
		await expect(getActiveOptionPosition(combobox)).toBe(targetPosition);
	});
}

/** The most `option` elements a windowed listbox may keep mounted in a story. */
const MAX_WINDOWED_OPTION_COUNT = 60;

/** Waits until the listbox holds between `expectedMinimum` and `MAX_WINDOWED_OPTION_COUNT` options, so a windowed list is proven not to render everything. */
export async function expectBoundedOptionCount(
	listbox: HTMLElement,
	expectedMinimum = 1
): Promise<void> {
	await waitFor(async () => {
		const optionCount = listbox.querySelectorAll('[role="option"]').length;
		await expect(optionCount).toBeGreaterThanOrEqual(expectedMinimum);
		await expect(optionCount).toBeLessThan(MAX_WINDOWED_OPTION_COUNT);
	});
}

/** Waits until the active option is mounted, inside the listbox rect, and the listbox still mounts a bounded number of options. */
export async function expectWindowedActiveOptionInView(
	combobox: HTMLElement,
	listbox: HTMLElement
): Promise<void> {
	await expectActiveOptionInView(combobox, listbox);
	await expectBoundedOptionCount(listbox);
}

/** Finds the option at the 1-based `position` inside `listbox`, or null when it is not mounted. */
export function findOptionAtPosition(
	listbox: HTMLElement,
	position: number
): HTMLElement | null {
	return listbox.querySelector<HTMLElement>(
		`[role="option"][aria-posinset="${position}"]`
	);
}
