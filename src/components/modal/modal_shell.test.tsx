import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { ModalShell } from './modal_shell';
import { ModalFooter } from './modal_footer';

describe('ModalShell', () => {
	test('renders the title and children', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn()} title="Delete item?">
				Are you sure?
			</ModalShell>
		);
		expect(screen.getByText('Delete item?')).toBeInTheDocument();
		expect(screen.getByText('Are you sure?')).toBeInTheDocument();
	});

	test('shows a close button by default', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn()} title="Title">
				Body
			</ModalShell>
		);
		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
	});

	test('hides the close button when not dismissible', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn()}
				title="Title"
				dismissible={false}
			>
				Body
			</ModalShell>
		);
		expect(
			screen.queryByRole('button', { name: 'Close' })
		).not.toBeInTheDocument();
	});

	test('uses a custom close label', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn()}
				title="Title"
				closeLabel="Fermer"
			>
				Body
			</ModalShell>
		);
		expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
	});

	test('clicking the close button calls onDismiss', () => {
		const handleDismiss = vi.fn();
		render(
			<ModalShell isEnded={false} onDismiss={handleDismiss} title="Title">
				Body
			</ModalShell>
		);
		fireEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(handleDismiss).toHaveBeenCalledTimes(1);
	});

	test('clicking the backdrop calls onDismiss when dismissible', () => {
		const handleDismiss = vi.fn();
		render(
			<ModalShell isEnded={false} onDismiss={handleDismiss} title="Title">
				Body
			</ModalShell>
		);
		fireEvent.click(screen.getByRole('dialog').parentElement as Element);
		expect(handleDismiss).toHaveBeenCalledTimes(1);
	});

	test('clicking the backdrop does nothing when not dismissible', () => {
		const handleDismiss = vi.fn();
		render(
			<ModalShell
				isEnded={false}
				onDismiss={handleDismiss}
				title="Title"
				dismissible={false}
			>
				Body
			</ModalShell>
		);
		fireEvent.click(screen.getByRole('dialog').parentElement as Element);
		expect(handleDismiss).not.toHaveBeenCalled();
	});

	test('Escape calls onDismiss when dismissible', () => {
		const handleDismiss = vi.fn();
		render(
			<ModalShell isEnded={false} onDismiss={handleDismiss} title="Title">
				Body
			</ModalShell>
		);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(handleDismiss).toHaveBeenCalledTimes(1);
	});

	test('Escape does nothing when not dismissible', () => {
		const handleDismiss = vi.fn();
		render(
			<ModalShell
				isEnded={false}
				onDismiss={handleDismiss}
				title="Title"
				dismissible={false}
			>
				Body
			</ModalShell>
		);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(handleDismiss).not.toHaveBeenCalled();
	});

	test('focuses the first focusable element on mount', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn()} title="Title">
				<button>First</button>
				<button>Second</button>
			</ModalShell>
		);
		expect(screen.getByText('First')).toHaveFocus();
	});

	test('Tab from the last focusable element wraps to the first', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn()} dismissible={false}>
				<button>First</button>
				<button>Second</button>
			</ModalShell>
		);
		screen.getByText('Second').focus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(screen.getByText('First')).toHaveFocus();
	});

	test('Shift+Tab from the first focusable element wraps to the last', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn()} dismissible={false}>
				<button>First</button>
				<button>Second</button>
			</ModalShell>
		);
		expect(screen.getByText('First')).toHaveFocus();
		fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
		expect(screen.getByText('Second')).toHaveFocus();
	});

	test('returns focus to the previously focused element once ended', () => {
		const trigger = document.createElement('button');
		trigger.textContent = 'Open';
		document.body.appendChild(trigger);
		trigger.focus();

		const { rerender } = render(
			<ModalShell isEnded={false} onDismiss={vi.fn()} title="Title">
				Body
			</ModalShell>
		);

		rerender(
			<ModalShell isEnded={true} onDismiss={vi.fn()} title="Title">
				Body
			</ModalShell>
		);

		expect(trigger).toHaveFocus();
		trigger.remove();
	});

	test('renders the footer prop in a ModalFooter by default', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn()}
				title="Title"
				footer={<button>Confirm</button>}
			>
				Body
			</ModalShell>
		);
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	test('skips the footer prop slot when children already include a ModalFooter', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn()}
				title="Title"
				footer={<button>From footer prop</button>}
			>
				<>
					<div>Body</div>
					<ModalFooter>
						<button>From children</button>
					</ModalFooter>
				</>
			</ModalShell>
		);
		expect(screen.getByText('From children')).toBeInTheDocument();
		expect(screen.queryByText('From footer prop')).not.toBeInTheDocument();
	});
});
