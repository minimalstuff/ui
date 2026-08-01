import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { act, render, screen } from '@testing-library/react';

import { Modal } from '#components/modal/modal';
import { ModalProvider } from './modal_provider';
import { ConfirmModal } from '#components/modal/confirm_modal';

describe('ModalProvider', () => {
	test('provides a single working root for Modal', async () => {
		render(<ModalProvider />);

		act(() => {
			void Modal.call({ title: 'Hello', children: 'Body' });
		});

		expect(await screen.findByText('Hello')).toBeInTheDocument();
	});

	test('provides a single working root for ConfirmModal', async () => {
		render(<ModalProvider />);

		act(() => {
			void ConfirmModal.call({ title: 'Delete item?' });
		});

		expect(await screen.findByText('Delete item?')).toBeInTheDocument();
	});

	test('throws if mounted alongside another Modal root', () => {
		render(
			<>
				<Modal />
				<ModalProvider />
			</>
		);

		expect(() => {
			void Modal.call({ title: 'Hello', children: 'Body' });
		}).toThrow('Multiple instances of <Root> found!');
	});
});
