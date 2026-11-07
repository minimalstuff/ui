import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ModalFooter } from '#components/modal/modal_footer';
import { ModalShell } from '#components/modal/modal_shell';

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

	test('restores focus without scrolling the page behind the modal', () => {
		const trigger = document.createElement('button');
		document.body.appendChild(trigger);
		trigger.focus();
		const focusSpy = vi.spyOn(trigger, 'focus');

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

		expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
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

	describe('accessible name warning', () => {
		afterEach(() => {
			vi.restoreAllMocks();
		});

		test('should warn when neither title nor aria-label is given', () => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
			render(
				<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()}>
					Body
				</ModalShell>
			);
			expect(warn).toHaveBeenCalledTimes(1);
			expect(warn).toHaveBeenCalledWith(
				expect.stringContaining('`title` or `aria-label`')
			);
		});

		test('should not warn when a title is given', () => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
			render(
				<ModalShell
					isEnded={false}
					onDismiss={vi.fn<() => void>()}
					title="Named"
				>
					Body
				</ModalShell>
			);
			expect(warn).not.toHaveBeenCalled();
		});
	});

	describe('keyboard scrolling', () => {
		function stubOverflow(): void {
			vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(
				500
			);
			vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(
				100
			);
		}

		afterEach(() => {
			vi.restoreAllMocks();
		});

		test('should make the body focusable and named when it overflows and has no tabbable child', () => {
			stubOverflow();
			render(
				<ModalShell
					isEnded={false}
					onDismiss={vi.fn<() => void>()}
					title="Terms"
				>
					Long text
				</ModalShell>
			);
			const region = screen.getByRole('region', { name: 'Terms' });
			expect(region).toHaveAttribute('tabindex', '0');
		});

		test('should focus the footer button on open when the scroll region is the only other tab stop and there is no close button', () => {
			stubOverflow();
			render(
				<ModalShell
					isEnded={false}
					onDismiss={vi.fn<() => void>()}
					title="Terms"
					dismissible={false}
					role="alertdialog"
					footer={<button>Accept</button>}
				>
					Long text
				</ModalShell>
			);
			expect(screen.getByRole('region', { name: 'Terms' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Accept' })).toHaveFocus();
		});

		test('should not make the body focusable when it contains a button', () => {
			stubOverflow();
			render(
				<ModalShell
					isEnded={false}
					onDismiss={vi.fn<() => void>()}
					title="Terms"
				>
					<button>Accept</button>
				</ModalShell>
			);
			expect(screen.queryByRole('region')).not.toBeInTheDocument();
		});
	});
});

describe('ModalShell unstyled and styling hooks', () => {
	function renderShell(
		props: Partial<React.ComponentProps<typeof ModalShell>>
	) {
		const handleDismiss = vi.fn<() => void>();
		render(
			<ModalShell
				isEnded={false}
				onDismiss={handleDismiss}
				title="Title"
				{...props}
			>
				<button>First</button>
				<button>Second</button>
			</ModalShell>
		);
		const dialog = screen.getByRole('dialog');
		return {
			handleDismiss,
			dialog,
			backdrop: dialog.previousElementSibling as HTMLElement,
			content: screen.getByText('First').parentElement as HTMLElement,
			heading: screen.getByRole('heading'),
		};
	}

	test('should strip the visual classes when unstyled', () => {
		const { dialog, backdrop, content, heading } = renderShell({
			unstyled: true,
		});
		expect(dialog).not.toHaveClass(
			'bg-white',
			'shadow-2xl',
			'rounded-xl',
			'transition-all'
		);
		expect(backdrop).not.toHaveClass('bg-black/60', 'backdrop-blur-md');
		expect(content).not.toHaveClass('px-6', 'text-sm');
		expect(heading).not.toHaveClass('text-base');
		expect(heading.parentElement).not.toHaveClass('px-6');
	});

	test('should keep the layout classes when unstyled', () => {
		const { dialog, backdrop, content } = renderShell({
			unstyled: true,
			size: 'lg',
		});
		expect(dialog).toHaveClass(
			'flex',
			'flex-col',
			'ms-modal-max-height',
			'overflow-hidden',
			'focus:outline-none',
			'max-w-2xl'
		);
		expect(backdrop).toHaveClass('fixed', 'inset-0');
		expect(dialog.parentElement).toHaveClass('fixed', 'inset-0', 'z-50');
		expect(content).toHaveClass('flex-1', 'min-h-0', 'overflow-y-auto');
	});

	test('should render the close button without library styling when unstyled', () => {
		renderShell({ unstyled: true });
		const closeButton = screen.getByRole('button', { name: 'Close' });
		expect(closeButton).not.toHaveClass('border');
		expect(closeButton).toHaveClass('min-h-6', 'min-w-6');
	});

	test('should keep the visual classes by default', () => {
		const { dialog, backdrop, content } = renderShell({});
		expect(dialog).toHaveClass('bg-white', 'shadow-2xl');
		expect(backdrop).toHaveClass('bg-black/60');
		expect(content).toHaveClass('px-6');
	});

	test('should apply panelClassName to the dialog and backdropClassName to the backdrop', () => {
		const { dialog, backdrop } = renderShell({
			panelClassName: 'my-panel',
			backdropClassName: 'my-backdrop',
		});
		expect(dialog).toHaveClass('my-panel');
		expect(backdrop).toHaveClass('my-backdrop');
	});

	test('should apply the hooks when unstyled too', () => {
		const { dialog, backdrop } = renderShell({
			unstyled: true,
			panelClassName: 'my-panel',
			backdropClassName: 'my-backdrop',
		});
		expect(dialog).toHaveClass('my-panel');
		expect(backdrop).toHaveClass('my-backdrop');
	});

	test('should still dismiss on Escape and backdrop click when unstyled', () => {
		const { handleDismiss, dialog } = renderShell({ unstyled: true });
		fireEvent.keyDown(document, { key: 'Escape' });
		fireEvent.click(dialog.parentElement as Element);
		expect(handleDismiss).toHaveBeenCalledTimes(2);
	});

	test('should still trap focus when unstyled', () => {
		renderShell({ unstyled: true, dismissible: false });
		screen.getByText('Second').focus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(screen.getByText('First')).toHaveFocus();
	});

	test('should still return focus once ended when unstyled', () => {
		const trigger = document.createElement('button');
		document.body.appendChild(trigger);
		trigger.focus();
		const { rerender } = render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Title"
				unstyled
			>
				Body
			</ModalShell>
		);
		rerender(
			<ModalShell
				isEnded
				onDismiss={vi.fn<() => void>()}
				title="Title"
				unstyled
			>
				Body
			</ModalShell>
		);
		expect(trigger).toHaveFocus();
		trigger.remove();
	});

	test('should drop the wrapper transition but keep its visibility when unstyled', async () => {
		const { dialog } = renderShell({ unstyled: true });
		expect(dialog.parentElement).not.toHaveClass('transition-opacity');
		await waitFor(() =>
			expect(dialog.parentElement).toHaveClass('opacity-100')
		);
	});

	test('should keep the wrapper transition by default', () => {
		const { dialog } = renderShell({});
		expect(dialog.parentElement).toHaveClass('transition-opacity');
	});

	test('should strip the footer slot visual classes when unstyled', () => {
		renderShell({ unstyled: true, footer: <button>Save</button> });
		const slot = screen.getByRole('button', { name: 'Save' })
			.parentElement as HTMLElement;
		expect(slot).not.toHaveClass('px-6', 'py-4', 'border-t', 'gap-3');
		expect(slot).toHaveClass('flex', 'items-center', 'justify-end');
	});

	test('should keep the footer slot visual classes by default', () => {
		renderShell({ footer: <button>Save</button> });
		const slot = screen.getByRole('button', { name: 'Save' })
			.parentElement as HTMLElement;
		expect(slot).toHaveClass('px-6', 'py-4', 'border-t', 'gap-3');
	});

	test('should set data-state to open then closed once ended', async () => {
		const { rerender } = render(
			<ModalShell isEnded={false} onDismiss={vi.fn<() => void>()} title="Title">
				Body
			</ModalShell>
		);
		await waitFor(() =>
			expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'open')
		);
		rerender(
			<ModalShell isEnded onDismiss={vi.fn<() => void>()} title="Title">
				Body
			</ModalShell>
		);
		expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'closed');
	});
});

describe('ModalShell phoneLayout', () => {
	function renderShell(
		props: Partial<React.ComponentProps<typeof ModalShell>>
	) {
		render(
			<ModalShell
				isEnded={false}
				onDismiss={vi.fn<() => void>()}
				title="Title"
				{...props}
			>
				Body
			</ModalShell>
		);
		const dialog = screen.getByRole('dialog');
		return { dialog, backdrop: dialog.parentElement as HTMLElement };
	}

	test('should not apply sheet classes when phoneLayout is omitted', () => {
		const { dialog, backdrop } = renderShell({});
		expect(dialog).not.toHaveClass('ms-modal-sheet-panel');
		expect(backdrop).not.toHaveClass('ms-modal-sheet-backdrop');
	});

	test('should apply the sheet layout classes when phoneLayout is sheet', () => {
		const { dialog, backdrop } = renderShell({ phoneLayout: 'sheet' });
		expect(backdrop).toHaveClass('ms-modal-sheet-backdrop');
		expect(dialog).toHaveClass(
			'ms-modal-sheet-panel',
			'ms-modal-sheet-size-md',
			'ms-modal-sheet-radius-xl'
		);
	});

	test('should use the sheet closed state when phoneLayout is sheet and the dialog is not visible', () => {
		const { dialog } = renderShell({ phoneLayout: 'sheet', isEnded: true });
		expect(dialog).toHaveClass('ms-modal-sheet-closed');
		expect(dialog).not.toHaveClass('ms-modal-panel-closed');
	});

	test('should keep the sheet position but drop radius and slide when sheet is unstyled', () => {
		const { dialog } = renderShell({
			phoneLayout: 'sheet',
			unstyled: true,
			isEnded: true,
		});
		expect(dialog).toHaveClass('ms-modal-sheet-panel');
		expect(dialog).not.toHaveClass(
			'ms-modal-sheet-radius-xl',
			'ms-modal-sheet-closed'
		);
	});

	test('should apply the fixed sheet height when height is fixed', () => {
		const { dialog } = renderShell({ phoneLayout: 'sheet', height: 'fixed' });
		expect(dialog).toHaveClass('ms-modal-sheet-height-fixed');
	});
});
