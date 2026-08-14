import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Menu } from './menu';
import { Modal } from '#components/modal/modal';
import { MenuItem } from '#components/menu_item/menu_item';
import { ModalProvider } from '#components/modal_provider/modal_provider';

function MenuOpeningAModal() {
	const openShortcuts = () => {
		void Modal.call({
			title: 'Shortcuts',
			children: <button>Close shortcuts</button>,
		});
	};

	return (
		<>
			<Menu trigger={<button>Options</button>}>
				<MenuItem onClick={openShortcuts}>Shortcuts</MenuItem>
			</Menu>
			<ModalProvider />
		</>
	);
}

async function openMenuAndSelectShortcuts() {
	render(<MenuOpeningAModal />);
	fireEvent.click(screen.getByText('Options'));
	await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
	fireEvent.click(screen.getByRole('menuitem'));
}

describe('Menu with a Modal opened from a MenuItem', () => {
	test('unmounts the menu once its exit animation is over', async () => {
		await openMenuAndSelectShortcuts();
		await waitFor(() =>
			expect(screen.queryByRole('menu')).not.toBeInTheDocument()
		);
	});

	test('leaves focus inside the modal, not on the menu trigger', async () => {
		await openMenuAndSelectShortcuts();

		const dialog = await screen.findByRole('dialog');
		expect(dialog.contains(document.activeElement)).toBe(true);
	});

	test('does not leave focus on the trigger while the modal is open', async () => {
		await openMenuAndSelectShortcuts();
		await screen.findByRole('dialog');

		expect(screen.getByText('Options')).not.toHaveFocus();
	});

	test('Escape closes the modal instead of a lingering menu', async () => {
		await openMenuAndSelectShortcuts();
		await screen.findByRole('dialog');

		fireEvent.keyDown(document, { key: 'Escape' });

		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		);
	});

	test('returns focus to the menu trigger once the modal closes', async () => {
		await openMenuAndSelectShortcuts();
		await screen.findByRole('dialog');

		fireEvent.keyDown(document, { key: 'Escape' });

		await waitFor(() => expect(screen.getByText('Options')).toHaveFocus());
	});
});
