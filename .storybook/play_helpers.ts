import { expect, userEvent, waitFor, within } from 'storybook/test';

import { MODAL_EXIT_DURATION_MS } from '#components/shared/animation';

/** Margin on top of the modal exit animation, so a "still open" check can't pass merely because it ran before react-call finished unmounting a closing modal. */
const EXIT_ANIMATION_SETTLE_MARGIN_MS = 100;

/** Asserts that `element` currently holds document focus. */
export async function expectFocusOn(element: Element): Promise<void> {
	await expect(element.ownerDocument.activeElement).toBe(element);
}

/** Scopes queries to `document.body`, for content rendered through a portal (e.g. `Modal`, `ConfirmModal`) rather than into `canvasElement`. */
export function getPortalScope(
	canvasElement: HTMLElement
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

/** Waits until no CSS transition or animation is running on `element`, so geometry and computed styles can be measured at rest. */
function isFullyOpaque(element: HTMLElement): boolean {
	return getComputedStyle(element).opacity === '1';
}

/** Waits until `dialog` and all its ancestors are fully opaque and no transition is running, i.e. its open transition is over. */
export async function waitForDialogOpen(dialog: HTMLElement): Promise<void> {
	const chain: HTMLElement[] = [];
	for (let node: HTMLElement | null = dialog; node; node = node.parentElement) {
		chain.push(node);
	}
	await waitFor(async () => {
		await expect(chain.every(isFullyOpaque)).toBe(true);
	});
	await waitForTransitionsToSettle(dialog);
}

/**
 * Asserts that the open `dialog` has no `scale` or `translate` left, which
 * would make it the containing block of a fixed descendant and clip a menu
 * portalled into it. Used where the geometry cannot expose the clipping on
 * its own: a drawer spans the full viewport height and floating-ui keeps the
 * menu inside the clipping ancestor, so the menu never leaves the panel.
 */
export async function expectDialogHasNoTransform(
	dialog: HTMLElement
): Promise<void> {
	await waitForDialogOpen(dialog);
	await expect(getComputedStyle(dialog).scale).toBe('none');
	await expect(getComputedStyle(dialog).translate).toBe('none');
}

async function waitForTransitionsToSettle(element: HTMLElement): Promise<void> {
	await waitFor(async () => {
		await expect(element.getAnimations()).toHaveLength(0);
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

/** Asserts that every menu item is the topmost element at its centre, so no part of the menu is clipped by an ancestor or covered by another layer. */
async function expectEveryMenuItemHittable(menu: HTMLElement): Promise<void> {
	await Promise.all(
		within(menu).getAllByRole('menuitem').map(expectMenuItemHittable)
	);
}

/** Asserts that `menu` sits inside `dialog` and is fully reachable (no item clipped or covered) once the dialog's open transition is over. */
export async function expectMenuReachableInDialog(
	menu: HTMLElement,
	dialog: HTMLElement
): Promise<void> {
	await expect(dialog.contains(menu)).toBe(true);
	await waitForTransitionsToSettle(menu);
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
