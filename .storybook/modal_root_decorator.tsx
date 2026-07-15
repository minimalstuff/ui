import { createRoot } from 'react-dom/client';
import type { Decorator } from '@storybook/react-vite';

import { Modal } from '#components/modal/modal';
import { ConfirmModal } from '#components/modal/confirm_modal';

let hasMountedGlobalRoot = false;

function ensureGlobalModalRoot(): void {
	if (hasMountedGlobalRoot) return;
	hasMountedGlobalRoot = true;

	const container = document.createElement('div');
	document.body.appendChild(container);
	createRoot(container).render(
		<>
			<Modal />
			<ConfirmModal />
		</>
	);
}

export const modalRootDecorator: Decorator = (Story, context) => {
	if (!context.parameters.skipGlobalModalRoot) {
		ensureGlobalModalRoot();
	}
	return Story();
};
