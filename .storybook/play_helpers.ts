import { expect, within } from 'storybook/test';

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
