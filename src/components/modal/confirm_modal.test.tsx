import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { ConfirmModal, type ConfirmModalResponse } from './confirm_modal';

describe('ConfirmModal', () => {
	test('renders title and default labels', async () => {
		render(<ConfirmModal />);

		act(() => {
			void ConfirmModal.call({ title: 'Delete item?' });
		});

		expect(await screen.findByText('Delete item?')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
	});

	test('renders custom labels', async () => {
		render(<ConfirmModal />);

		act(() => {
			void ConfirmModal.call({
				title: 'Delete item?',
				confirmLabel: 'Delete',
				cancelLabel: 'Keep it',
			});
		});

		expect(
			await screen.findByRole('button', { name: 'Delete' })
		).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Keep it' })).toBeInTheDocument();
	});

	test('clicking cancel resolves false', async () => {
		render(<ConfirmModal />);

		let result: Promise<ConfirmModalResponse> = Promise.resolve(false);
		act(() => {
			result = ConfirmModal.call({ title: 'Delete item?' });
		});
		await screen.findByText('Delete item?');

		fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

		await expect(result).resolves.toBe(false);
	});

	test('clicking confirm resolves true', async () => {
		render(<ConfirmModal />);

		let result: Promise<ConfirmModalResponse> = Promise.resolve(false);
		act(() => {
			result = ConfirmModal.call({ title: 'Delete item?' });
		});
		await screen.findByText('Delete item?');

		fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

		await expect(result).resolves.toBe(true);
	});

	test('awaits onConfirm before resolving and disables actions while pending', async () => {
		let resolveConfirm: () => void = () => {};
		const onConfirm = vi.fn(
			() =>
				new Promise<void>((resolve) => {
					resolveConfirm = resolve;
				})
		);

		render(<ConfirmModal />);

		let result: Promise<ConfirmModalResponse> = Promise.resolve(false);
		act(() => {
			result = ConfirmModal.call({ title: 'Delete item?', onConfirm });
		});
		await screen.findByText('Delete item?');

		fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();

		act(() => {
			resolveConfirm();
		});

		await expect(result).resolves.toBe(true);
	});

	test('reports a rejected onConfirm to onError', async () => {
		const confirmError = new Error('network down');
		const onError = vi.fn();

		render(<ConfirmModal />);

		act(() => {
			void ConfirmModal.call({
				title: 'Delete item?',
				onConfirm: () => Promise.reject(confirmError),
				onError,
			});
		});
		await screen.findByText('Delete item?');

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
		});

		expect(onError).toHaveBeenCalledWith(confirmError);
	});

	test('stays open and re-enables its actions when onConfirm rejects', async () => {
		render(<ConfirmModal />);

		act(() => {
			void ConfirmModal.call({
				title: 'Delete item?',
				onConfirm: () => Promise.reject(new Error('network down')),
				onError: vi.fn(),
			});
		});
		await screen.findByText('Delete item?');

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
		});

		expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
	});

	test('throws when calling without a mounted ConfirmModal root', () => {
		expect(() => {
			void ConfirmModal.call({ title: 'Delete item?' });
		}).toThrow('No <Root> found!');
	});

	test('throws when more than one ConfirmModal root is mounted', () => {
		render(
			<>
				<ConfirmModal />
				<ConfirmModal />
			</>
		);

		expect(() => {
			void ConfirmModal.call({ title: 'Delete item?' });
		}).toThrow('Multiple instances of <Root> found!');
	});
});
