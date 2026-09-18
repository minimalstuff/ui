import { beforeEach } from 'vitest';

import { resetGlobalModalRoot } from './modal_root_decorator';

const DISABLE_TRANSITIONS_AND_ANIMATIONS_CSS = `
*, *::before, *::after {
	transition: none !important;
	animation: none !important;
}
`;

const style = document.createElement('style');
style.textContent = DISABLE_TRANSITIONS_AND_ANIMATIONS_CSS;
document.head.appendChild(style);

// A modal left open by a failed play (react-call's root persists across
// stories by design) would otherwise leak into every story that runs after
// it. Starting each test with no modal open keeps failures isolated to the
// story that actually caused them.
beforeEach(() => {
	resetGlobalModalRoot();
});
