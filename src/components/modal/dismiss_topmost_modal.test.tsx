import '@testing-library/jest-dom/vitest';

import { act, render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, expect, test, vi } from 'vitest';

import { Drawer } from '#components/drawer/drawer';
import { ConfirmModal } from '#components/modal/confirm_modal';
import { Modal } from '#components/modal/modal';
import { dismissTopmostModal } from '#components/modal/modal_stack';
import {
	useDismissGuard,
	type DismissGuard,
} from '#components/modal/use_dismiss_guard';

function GuardedContent({
	guard,
}: Readonly<{ guard: DismissGuard }>): ReactNode {
	useDismissGuard(guard);
	return <input aria-label="Name" />;
}

function pressBack(): boolean {
	let isConsumed = false;
	act(() => {
		isConsumed = dismissTopmostModal();
	});
	return isConsumed;
}

interface OpenModalOptions {
	dismissible?: boolean;
	children?: ReactNode;
}

function openModal(options: Readonly<OpenModalOptions> = {}): Promise<void> {
	let closed: Promise<void> = Promise.resolve();
	act(() => {
		closed = Modal.call({ title: 'Settings', children: 'Body', ...options });
	});
	return closed;
}

describe('dismissTopmostModal', () => {
	test('should return false when no dialog is open', () => {
		expect(dismissTopmostModal()).toBe(false);
	});

	test('should close an open Modal and return true', async () => {
		render(<Modal />);
		const closed = openModal();

		expect(pressBack()).toBe(true);

		await expect(closed).resolves.toBeUndefined();
	});

	test('should close an open Drawer and return true', () => {
		const onClose = vi.fn<() => void>();
		render(
			<Drawer isOpen onClose={onClose} title="Filters">
				Body
			</Drawer>
		);

		expect(pressBack()).toBe(true);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test('should close only the ConfirmModal stacked on a Modal', async () => {
		render(
			<>
				<Modal />
				<ConfirmModal />
			</>
		);
		const onModalSettled = vi.fn<() => void>();
		void openModal().then(onModalSettled);
		let response: Promise<boolean> = Promise.resolve(true);
		act(() => {
			response = ConfirmModal.call({ title: 'Delete item?' });
		});

		expect(pressBack()).toBe(true);

		await expect(response).resolves.toBe(false);
		expect(onModalSettled).not.toHaveBeenCalled();
	});

	test('should return true without closing a non-dismissible dialog', () => {
		render(<Modal />);
		const onSettled = vi.fn<() => void>();
		void openModal({ dismissible: false }).then(onSettled);

		expect(pressBack()).toBe(true);
		expect(onSettled).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	test('should keep the dialog open when a dismiss guard refuses', () => {
		render(<Modal />);
		const guard = vi.fn<DismissGuard>(() => false);
		const onSettled = vi.fn<() => void>();
		void openModal({ children: <GuardedContent guard={guard} /> }).then(
			onSettled
		);

		expect(pressBack()).toBe(true);
		expect(guard).toHaveBeenCalledTimes(1);
		expect(onSettled).not.toHaveBeenCalled();
	});
});
