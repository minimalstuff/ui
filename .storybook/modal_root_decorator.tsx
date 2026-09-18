import type { Decorator } from '@storybook/react-vite';
import { createRoot, type Root } from 'react-dom/client';

import { Modal } from '#components/modal/modal';
import { ConfirmModal } from '#components/modal/confirm_modal';

let globalRoot: Root | null = null;
let globalRootContainer: HTMLElement | null = null;

function ensureGlobalModalRoot(): void {
	if (globalRoot) return;

	globalRootContainer = document.createElement('div');
	document.body.appendChild(globalRootContainer);
	globalRoot = createRoot(globalRootContainer);
	globalRoot.render(
		<>
			<Modal />
			<ConfirmModal />
		</>
	);
}

function teardownGlobalModalRoot(): void {
	if (!globalRoot) return;
	globalRoot.unmount();
	globalRootContainer?.remove();
	globalRoot = null;
	globalRootContainer = null;
}

/**
 * Tears down the global modal root so the next story starts with no modal
 * open. The decorator lazily recreates it (see `ensureGlobalModalRoot`), so
 * this is safe to call before every test.
 */
export function resetGlobalModalRoot(): void {
	teardownGlobalModalRoot();
}

export const modalRootDecorator: Decorator = (Story, context) => {
	if (context.parameters.skipGlobalModalRoot) {
		teardownGlobalModalRoot();
	} else {
		ensureGlobalModalRoot();
	}
	return Story();
};
