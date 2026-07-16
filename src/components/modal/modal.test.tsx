import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { Modal } from './modal';

describe('Modal', () => {
	test('renders nothing when no call is active', () => {
		render(<Modal />);
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
	});

	test('renders title and children when called', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({ title: 'Hello', children: 'Body text' });
		});

		expect(await screen.findByText('Hello')).toBeInTheDocument();
		expect(screen.getByText('Body text')).toBeInTheDocument();
	});

	test('clicking the close button resolves the call', async () => {
		render(<Modal />);

		let result: Promise<void> = Promise.resolve();
		act(() => {
			result = Modal.call({ title: 'Hello', children: 'Body' });
		});
		await screen.findByText('Hello');

		fireEvent.click(screen.getByRole('button', { name: 'Close' }));

		await expect(result).resolves.toBeUndefined();
	});

	test('pressing Escape resolves the call', async () => {
		render(<Modal />);

		let result: Promise<void> = Promise.resolve();
		act(() => {
			result = Modal.call({ title: 'Hello', children: 'Body' });
		});
		await screen.findByText('Hello');

		fireEvent.keyDown(document, { key: 'Escape' });

		await expect(result).resolves.toBeUndefined();
	});

	test('exposes dialog semantics wired to the title', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({ title: 'Hello', children: 'Body' });
		});
		await screen.findByText('Hello');

		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
		expect(dialog).toHaveAttribute(
			'aria-labelledby',
			screen.getByText('Hello').id
		);
	});

	test('moves focus into the dialog when opened', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({ title: 'Hello', children: 'Body' });
		});
		await screen.findByText('Hello');

		expect(screen.getByRole('dialog')).toHaveFocus();
	});

	test('restores focus to the previously focused element on close', async () => {
		render(
			<>
				<button type="button">Open</button>
				<Modal />
			</>
		);
		const trigger = screen.getByRole('button', { name: 'Open' });
		trigger.focus();

		let result: Promise<void> = Promise.resolve();
		act(() => {
			result = Modal.call({ title: 'Hello', children: 'Body' });
		});
		await screen.findByText('Hello');

		fireEvent.click(screen.getByRole('button', { name: 'Close' }));
		await result;

		expect(trigger).toHaveFocus();
	});
});
