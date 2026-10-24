import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { describe, expect, test, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ModalFooter } from './modal_footer';
import { ModalShell } from './modal_shell';

function ModalShellWithInitialFocus() {
	const cancelRef = useRef<HTMLButtonElement>(null);

	return (
		<ModalShell
			isEnded={false}
			onDismiss={vi.fn<() => void>()}
			initialFocusRef={cancelRef}
		>
			<button>First</button>
			<button ref={cancelRef}>Cancel</button>
		</ModalShell>
	);
}

describe('ModalShell', () => {
	test('renders the title and children', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Delete item?"
			>
				Are you sure?
			</ModalShell>
		);
		expect(screen.getByText('Delete item?')).toBeInTheDocument();
		expect(screen.getByText('Are you sure?')).toBeInTheDocument();
	});

	test('shows a close button by default', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				Body
			</ModalShell>
		);
		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
	});

	test('hides the close button when not dismissible', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
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
				onDismiss={vi.fn<() => void>()}
				title="Title"
				closeLabel="Fermer"
			>
				Body
			</ModalShell>
		);
		expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
	});

	test('clicking the close button calls onDismiss', () => {
		const handleDismiss = vi.fn<() => void>();
		render(
			<ModalShell isEnded={false} onDismiss={handleDismiss} title="Title">
				Body
			</ModalShell>
		);
		fireEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(handleDismiss).toHaveBeenCalledTimes(1);
	});

	test('clicking the backdrop calls onDismiss when dismissible', () => {
		const handleDismiss = vi.fn<() => void>();
		render(
			<ModalShell isEnded={false} onDismiss={handleDismiss} title="Title">
				Body
			</ModalShell>
		);
		fireEvent.click(screen.getByRole('dialog').parentElement as Element);
		expect(handleDismiss).toHaveBeenCalledTimes(1);
	});

	test('should prevent the default of a mousedown on the backdrop', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				Body
			</ModalShell>
		);
		const isNotPrevented = fireEvent.mouseDown(
			screen.getByRole('dialog').parentElement as Element
		);
		expect(isNotPrevented).toBe(false);
	});

	test('should not prevent the default of a mousedown inside the dialog', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				Body
			</ModalShell>
		);
		const isNotPrevented = fireEvent.mouseDown(screen.getByText('Body'));
		expect(isNotPrevented).toBe(true);
	});

	test('should not prevent the default of a mousedown on content portaled out of the dialog', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				{createPortal(<button type="button">Portaled</button>, document.body)}
			</ModalShell>
		);
		const isNotPrevented = fireEvent.mouseDown(
			screen.getByRole('button', { name: 'Portaled' })
		);
		expect(isNotPrevented).toBe(true);
	});

	test('clicking the backdrop does nothing when not dismissible', () => {
		const handleDismiss = vi.fn<() => void>();
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
		const handleDismiss = vi.fn<() => void>();
		render(
			<ModalShell isEnded={false} onDismiss={handleDismiss} title="Title">
				Body
			</ModalShell>
		);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(handleDismiss).toHaveBeenCalledTimes(1);
	});

	test('Escape does nothing when not dismissible', () => {
		const handleDismiss = vi.fn<() => void>();
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
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				<button>First</button>
				<button>Second</button>
			</ModalShell>
		);
		expect(screen.getByText('First')).toHaveFocus();
	});

	test('Tab from the last focusable element wraps to the first', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				dismissible={false}
			>
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
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				dismissible={false}
			>
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
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				Body
			</ModalShell>
		);

		rerender(
			<ModalShell isEnded={true} onDismiss={vi.fn<() => void>()} title="Title">
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
				onDismiss={vi.fn<() => void>()}
				title="Title"
				footer={<button>Confirm</button>}
			>
				Body
			</ModalShell>
		);
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	test('uses role="dialog" by default', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				Body
			</ModalShell>
		);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	test('renders as an alertdialog when role is alertdialog', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Title"
				role="alertdialog"
			>
				Body
			</ModalShell>
		);
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	test('describes an alertdialog by its content', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Title"
				role="alertdialog"
			>
				Are you sure?
			</ModalShell>
		);
		const dialog = screen.getByRole('alertdialog');
		const describedById = dialog.getAttribute('aria-describedby');
		expect(describedById).toBeTruthy();
		expect(document.getElementById(describedById as string)).toHaveTextContent(
			'Are you sure?'
		);
	});

	test('does not add aria-describedby for a plain dialog', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				Body
			</ModalShell>
		);
		expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
	});

	test('names the dialog with aria-label when there is no title', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				aria-label="Notice"
			>
				Body
			</ModalShell>
		);
		expect(screen.getByRole('dialog', { name: 'Notice' })).toBeInTheDocument();
	});

	test('ignores aria-label once a title is set', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Title"
				aria-label="Notice"
			>
				Body
			</ModalShell>
		);
		expect(screen.getByRole('dialog', { name: 'Title' })).toBeInTheDocument();
	});

	test('focuses initialFocusRef instead of the first tabbable element', () => {
		render(<ModalShellWithInitialFocus />);
		expect(screen.getByText('Cancel')).toHaveFocus();
	});

	test('Escape does nothing when the event was already handled', () => {
		const handleDismiss = vi.fn<() => void>();
		render(
			<ModalShell isEnded={false} onDismiss={handleDismiss} title="Title">
				Body
			</ModalShell>
		);

		const event = new KeyboardEvent('keydown', {
			key: 'Escape',
			bubbles: true,
			cancelable: true,
		});
		event.preventDefault();
		document.dispatchEvent(event);

		expect(handleDismiss).not.toHaveBeenCalled();
	});

	test('only the topmost modal responds to Escape when modals are stacked', () => {
		const handleDismissFirst = vi.fn<() => void>();
		const handleDismissSecond = vi.fn<() => void>();
		render(
			<>
				<ModalShell
					isEnded={false}
					onDismiss={handleDismissFirst}
					title="First"
				>
					Body
				</ModalShell>
				<ModalShell
					isEnded={false}
					onDismiss={handleDismissSecond}
					title="Second"
				>
					Body
				</ModalShell>
			</>
		);

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(handleDismissSecond).toHaveBeenCalledTimes(1);
		expect(handleDismissFirst).not.toHaveBeenCalled();
	});

	test('the modal beneath regains Escape handling once the topmost one ends', () => {
		const handleDismissFirst = vi.fn<() => void>();
		const handleDismissSecond = vi.fn<() => void>();
		const { rerender } = render(
			<>
				<ModalShell
					isEnded={false}
					onDismiss={handleDismissFirst}
					title="First"
				>
					Body
				</ModalShell>
				<ModalShell
					isEnded={false}
					onDismiss={handleDismissSecond}
					title="Second"
				>
					Body
				</ModalShell>
			</>
		);

		rerender(
			<>
				<ModalShell
					isEnded={false}
					onDismiss={handleDismissFirst}
					title="First"
				>
					Body
				</ModalShell>
				<ModalShell
					isEnded={true}
					onDismiss={handleDismissSecond}
					title="Second"
				>
					Body
				</ModalShell>
			</>
		);

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(handleDismissFirst).toHaveBeenCalledTimes(1);
		expect(handleDismissSecond).not.toHaveBeenCalled();
	});

	test('should give the dialog a fixed height when height is fixed', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Title"
				height="fixed"
			>
				Body
			</ModalShell>
		);
		expect(screen.getByRole('dialog')).toHaveClass('ms-modal-height-fixed');
	});

	test('should leave scrolling to the content when height is fixed', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Title"
				height="fixed"
			>
				Body
			</ModalShell>
		);
		const content = screen.getByText('Body');
		expect(content).toHaveClass(
			'overflow-hidden',
			'flex',
			'flex-col',
			'min-h-0'
		);
		expect(content).not.toHaveClass('overflow-y-auto');
	});

	test('should keep header and footer outside the content when height is fixed', () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Title"
				height="fixed"
				footer={<button>Save</button>}
			>
				Body
			</ModalShell>
		);
		const content = screen.getByText('Body');
		expect(content).not.toContainElement(screen.getByText('Title'));
		expect(content).not.toContainElement(screen.getByText('Save'));
	});

	test('should scroll the content without a fixed height by default', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				Body
			</ModalShell>
		);
		expect(screen.getByText('Body')).toHaveClass('overflow-y-auto');
		expect(screen.getByRole('dialog')).not.toHaveClass('ms-modal-height-fixed');
	});

	test('should pad the backdrop with the library shortcut', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				Body
			</ModalShell>
		);
		const backdrop = screen.getByRole('dialog').parentElement;
		expect(backdrop).toHaveClass('ms-modal-backdrop-padding');
	});

	test('should cap the dialog height with the library shortcut', () => {
		render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				Body
			</ModalShell>
		);
		expect(screen.getByRole('dialog')).toHaveClass('ms-modal-max-height');
	});

	test('should have no axe violations when height is fixed with a footer', async () => {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Title"
				height="fixed"
			>
				Body
				<ModalFooter>
					<button type="button">Save</button>
				</ModalFooter>
			</ModalShell>
		);
		expect(await axe(document.body)).toHaveNoViolations();
	});

	test('should keep the page scroll locked when the top of two stacked modals unmounts', () => {
		const first = render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="First">
				Body
			</ModalShell>
		);
		const second = render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Second"
			>
				Body
			</ModalShell>
		);

		second.unmount();

		expect(document.documentElement.style.overflow).toBe('hidden');
		first.unmount();
	});

	test('should restore the previous page overflow once every stacked modal has unmounted', () => {
		document.documentElement.style.overflow = 'scroll';
		const first = render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="First">
				Body
			</ModalShell>
		);
		const second = render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Second"
			>
				Body
			</ModalShell>
		);

		second.unmount();
		first.unmount();

		expect(document.documentElement.style.overflow).toBe('scroll');
		document.documentElement.style.overflow = '';
	});
});
