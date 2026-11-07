import type { BrowserCommand } from 'vitest/node';

/** Page coordinate (on both axes) just outside the viewport. The tester iframe covers the whole orchestrator page, so no in-page point is safe: a point outside the viewport makes Chromium treat the pointer as having left the window, which clears every :hover. */
const PARK_COORDINATE = -1;

/**
 * Moves the real Playwright mouse outside the story. The story document sits
 * in a tester iframe, and Chromium fires hover and pointerenter events when
 * content appears under a stationary cursor, so a cursor left over the canvas
 * by a previous story opens tooltips by hover. A synthetic `userEvent.unhover`
 * never moves it.
 */
export const movePointerOutOfStory: BrowserCommand<[]> = async (context) => {
	if (context.provider.name !== 'playwright') return;
	await context.page.mouse.move(PARK_COORDINATE, PARK_COORDINATE);
};
