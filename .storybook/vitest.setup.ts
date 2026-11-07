import '#storybook/browser_commands.ts';

import { configure } from 'storybook/test';
import { beforeEach } from 'vitest';
import { commands } from 'vitest/browser';

import { clearModalStack } from '#components/modal/modal_stack';
import { useGlobalHotkeysStore } from '#stores/global_hotkeys_store/global_hotkeys_store';
import { resetGlobalModalRoot } from '#storybook/modal_root_decorator';

/** Default 1000 ms is too short for floating-ui positioning and focus hand-offs when several browsers share a loaded CPU. */
const ASYNC_UTIL_TIMEOUT_MS = 3000;

configure({ asyncUtilTimeout: ASYNC_UTIL_TIMEOUT_MS });

const DISABLE_TRANSITIONS_AND_ANIMATIONS_CSS = `
*, *::before, *::after {
	transition: none !important;
	animation: none !important;
}
`;

const style = document.createElement('style');
style.textContent = DISABLE_TRANSITIONS_AND_ANIMATIONS_CSS;
document.head.appendChild(style);

// Every test starts from a clean slate: state leaked by a previous story
// (an open modal, a disabled hotkeys store, a focused element, the real
// cursor left over the canvas) would otherwise make stories pass or fail
// depending on what ran before them. react-call's modal root persists across
// stories by design, so it is torn down here too.
beforeEach(async () => {
	resetGlobalModalRoot();
	clearModalStack();
	useGlobalHotkeysStore.setState({ globalHotkeysEnabled: true });
	(document.activeElement as HTMLElement | null)?.blur();
	await commands.movePointerOutOfStory();
});
