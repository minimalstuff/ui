import { expect } from 'storybook/test';

/** Asserts that `element` currently holds document focus. */
export async function expectFocusOn(element: Element): Promise<void> {
	await expect(element.ownerDocument.activeElement).toBe(element);
}
