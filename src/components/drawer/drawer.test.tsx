import '@testing-library/jest-dom/vitest';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { createPortal } from 'react-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Drawer, type DrawerProps } from '#components/drawer/drawer';
import { ConfirmModal } from '#components/modal/confirm_modal';
import { ModalFooter } from '#components/modal/modal_footer';
import { DRAWER_EXIT_DURATION_MS } from '#components/shared/animation';

function renderDrawer(props: Partial<DrawerProps> = {}) {
	const onClose = vi.fn<() => void>();
	const view = render(
		<Drawer isOpen onClose={onClose} title="Settings" {...props}>
			{props.children ?? 'Body'}
		</Drawer>
	);
	return { onClose, ...view };
}

function rerenderDrawer(
	rerender: (ui: React.ReactElement) => void,
	props: Partial<DrawerProps>
) {
	rerender(
		<Drawer isOpen onClose={vi.fn<() => void>()} title="Settings" {...props}>
			Body
		</Drawer>
	);
}

function pressEscape(): void {
	fireEvent.keyDown(document, { key: 'Escape' });
}

function advancePastExit(): void {
	act(() => {
		vi.advanceTimersByTime(DRAWER_EXIT_DURATION_MS);
	});
}

afterEach(() => {
	vi.useRealTimers();
});

describe('Drawer', () => {
	test('should name the dialog by its title', () => {
		renderDrawer();
		expect(
			screen.getByRole('dialog', { name: 'Settings' })
		).toBeInTheDocument();
	});

	test('should render nothing when closed', () => {
		renderDrawer({ isOpen: false });
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('should have no axe violations when open', async () => {
		renderDrawer();
		expect(await axe(document.body)).toHaveNoViolations();
	});

	test('should have no axe violations when open with a footer', async () => {
		renderDrawer({ footer: <button type="button">Save</button> });
		expect(await axe(document.body)).toHaveNoViolations();
	});

	test('should render the footer prop in the pinned footer', () => {
		renderDrawer({ footer: <button type="button">Save</button> });
		const footer = screen.getByRole('button', { name: 'Save' }).parentElement;
		expect(footer).not.toContainElement(screen.getByText('Body'));
	});

	test('should render a ModalFooter in the pinned footer', () => {
		renderDrawer({
			children: (
				<>
					Body
					<ModalFooter>
						<button type="button">Apply</button>
					</ModalFooter>
				</>
			),
		});
		const dialog = screen.getByRole('dialog');
		const footer = screen.getByRole('button', { name: 'Apply' }).parentElement;
		expect(dialog).toContainElement(footer);
		expect(footer).not.toContainElement(screen.getByText('Body'));
	});

	test('should focus initialFocusRef on open', () => {
		const targetRef = createRef<HTMLButtonElement>();
		renderDrawer({
			initialFocusRef: targetRef,
			children: (
				<>
					<button type="button">First</button>
					<button type="button" ref={targetRef}>
						Target
					</button>
				</>
			),
		});
		expect(screen.getByRole('button', { name: 'Target' })).toHaveFocus();
	});

	test('should focus the first focusable element of the body rather than the close button', () => {
		renderDrawer({
			children: (
				<>
					<button type="button">First</button>
					<button type="button">Second</button>
				</>
			),
		});
		expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
	});

	test('should focus the panel when nothing is focusable', () => {
		renderDrawer({ dismissible: false });
		expect(screen.getByRole('dialog')).toHaveFocus();
	});

	test('should focus the panel when the body has nothing focusable but the footer has buttons', () => {
		renderDrawer({ footer: <button type="button">Save</button> });
		expect(screen.getByRole('dialog')).toHaveFocus();
	});

	test('should wrap Tab from the last focusable element to the first', () => {
		renderDrawer({
			dismissible: false,
			children: (
				<>
					<button type="button">First</button>
					<button type="button">Second</button>
				</>
			),
		});
		screen.getByRole('button', { name: 'Second' }).focus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
	});

	test('should wrap Shift+Tab from the first focusable element to the last', () => {
		renderDrawer({
			dismissible: false,
			children: (
				<>
					<button type="button">First</button>
					<button type="button">Second</button>
				</>
			),
		});
		fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
		expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
	});

	test('should return focus to the opener when closed', () => {
		vi.useFakeTimers();
		const opener = document.createElement('button');
		document.body.appendChild(opener);
		opener.focus();
		const { rerender } = renderDrawer();

		rerenderDrawer(rerender, { isOpen: false });

		expect(opener).toHaveFocus();
		opener.remove();
	});

	test('should fall back to main when the opener was removed', () => {
		vi.useFakeTimers();
		const main = document.createElement('main');
		const opener = document.createElement('button');
		document.body.append(main, opener);
		opener.focus();
		const { rerender } = renderDrawer();
		opener.remove();

		rerenderDrawer(rerender, { isOpen: false });

		expect(main).toHaveFocus();
		main.remove();
	});

	test('should call onClose when Escape is pressed', () => {
		const { onClose } = renderDrawer();
		pressEscape();
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test('should call onClose when the backdrop is clicked', () => {
		const { onClose } = renderDrawer();
		fireEvent.click(screen.getByRole('dialog').parentElement as Element);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test('should prevent the default of a mousedown on the backdrop', () => {
		renderDrawer();
		const isNotPrevented = fireEvent.mouseDown(
			screen.getByRole('dialog').parentElement as Element
		);
		expect(isNotPrevented).toBe(false);
	});

	test('should not prevent the default of a mousedown inside the dialog', () => {
		renderDrawer();
		const isNotPrevented = fireEvent.mouseDown(screen.getByText('Body'));
		expect(isNotPrevented).toBe(true);
	});

	test('should not prevent the default of a mousedown on content portaled out of the dialog', () => {
		renderDrawer({
			children: createPortal(
				<button type="button">Portaled</button>,
				document.body
			),
		});
		const isNotPrevented = fireEvent.mouseDown(
			screen.getByRole('button', { name: 'Portaled' })
		);
		expect(isNotPrevented).toBe(true);
	});

	test('should call onClose when the close button is clicked', () => {
		const { onClose } = renderDrawer();
		fireEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test('should not call onClose on Escape when not dismissible', () => {
		const { onClose } = renderDrawer({ dismissible: false });
		pressEscape();
		expect(onClose).not.toHaveBeenCalled();
	});

	test('should not call onClose on backdrop click when not dismissible', () => {
		const { onClose } = renderDrawer({ dismissible: false });
		fireEvent.click(screen.getByRole('dialog').parentElement as Element);
		expect(onClose).not.toHaveBeenCalled();
	});

	test('should hide the close button when not dismissible', () => {
		renderDrawer({ dismissible: false });
		expect(
			screen.queryByRole('button', { name: 'Close' })
		).not.toBeInTheDocument();
	});

	test('should use a custom close label', () => {
		renderDrawer({ closeLabel: 'Fermer' });
		expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
	});

	test('should ignore Escape when the event was already handled', () => {
		const { onClose } = renderDrawer();
		const event = new KeyboardEvent('keydown', {
			key: 'Escape',
			bubbles: true,
			cancelable: true,
		});
		event.preventDefault();
		document.dispatchEvent(event);
		expect(onClose).not.toHaveBeenCalled();
	});

	test('should let a ConfirmModal stacked on top take Escape first', async () => {
		const { onClose } = renderDrawer();
		render(<ConfirmModal />);
		act(() => {
			void ConfirmModal.call({ title: 'Discard changes?' });
		});
		await screen.findByRole('alertdialog');

		pressEscape();

		expect(onClose).not.toHaveBeenCalled();
	});

	test('should let a ConfirmModal stacked on top take backdrop clicks', async () => {
		const { onClose } = renderDrawer();
		render(<ConfirmModal />);
		act(() => {
			void ConfirmModal.call({ title: 'Discard changes?' });
		});
		const confirmDialog = await screen.findByRole('alertdialog');

		fireEvent.click(confirmDialog.parentElement as Element);

		expect(onClose).not.toHaveBeenCalled();
	});

	test('should regain Escape once the stacked ConfirmModal is closed', async () => {
		const { onClose } = renderDrawer();
		render(<ConfirmModal />);
		act(() => {
			void ConfirmModal.call({ title: 'Discard changes?' });
		});
		await screen.findByRole('alertdialog');
		pressEscape();
		await vi.waitFor(() =>
			expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
		);

		pressEscape();

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test('should stay mounted and inert during the exit transition', () => {
		vi.useFakeTimers();
		const { rerender } = renderDrawer();

		rerenderDrawer(rerender, { isOpen: false });

		const panel = document.querySelector('[role="dialog"]');
		expect(panel).toHaveAttribute('inert');
	});

	test('should unmount once the exit transition ends', () => {
		vi.useFakeTimers();
		const { rerender } = renderDrawer();
		rerenderDrawer(rerender, { isOpen: false });

		advancePastExit();

		expect(document.querySelector('[role="dialog"]')).not.toBeInTheDocument();
	});

	test('should ignore backdrop clicks during the exit transition', () => {
		vi.useFakeTimers();
		const { rerender } = renderDrawer();
		const onClose = vi.fn<() => void>();
		rerender(
			<Drawer isOpen={false} onClose={onClose} title="Settings">
				Body
			</Drawer>
		);

		fireEvent.click(
			document.querySelector('[role="dialog"]')?.parentElement as Element
		);

		expect(onClose).not.toHaveBeenCalled();
	});

	test('should keep exactly one dialog that is not inert when reopened mid-exit', () => {
		vi.useFakeTimers();
		const { rerender } = renderDrawer();
		rerenderDrawer(rerender, { isOpen: false });

		rerenderDrawer(rerender, { isOpen: true });
		advancePastExit();

		const dialogs = screen.getAllByRole('dialog');
		expect(dialogs).toHaveLength(1);
		expect(dialogs[0]).not.toHaveAttribute('inert');
	});

	test('should move focus back inside when reopened mid-exit', () => {
		vi.useFakeTimers();
		const opener = document.createElement('button');
		document.body.appendChild(opener);
		opener.focus();
		const children = <button type="button">First</button>;
		const { rerender } = renderDrawer({ children });
		rerenderDrawer(rerender, { isOpen: false, children });
		expect(opener).toHaveFocus();

		rerender(
			<Drawer isOpen onClose={vi.fn<() => void>()} title="Settings">
				{children}
			</Drawer>
		);

		expect(screen.getByRole('dialog')).toContainElement(
			document.activeElement as HTMLElement
		);
		opener.remove();
	});

	test('should anchor to the left edge when side is left', () => {
		renderDrawer({ side: 'left' });
		expect(screen.getByRole('dialog')).toHaveClass('left-0');
	});

	test.each([
		{ side: 'right', offscreenClass: 'ms-drawer-offscreen-right' },
		{ side: 'left', offscreenClass: 'ms-drawer-offscreen-left' },
	] as const)(
		'should use the $offscreenClass shortcut before entering when side is $side',
		({ side, offscreenClass }) => {
			renderDrawer({ side });
			expect(screen.getByRole('dialog')).toHaveClass(offscreenClass);
		}
	);

	test('should round only the inner edge corners', () => {
		renderDrawer({ radius: 'lg' });
		expect(screen.getByRole('dialog')).toHaveClass('rounded-l-lg');
	});

	test.each([
		{ size: 'sm', widthClass: 'ms-drawer-width-sm' },
		{ size: 'md', widthClass: 'ms-drawer-width-md' },
		{ size: 'lg', widthClass: 'ms-drawer-width-lg' },
	] as const)(
		'should use the $widthClass shortcut when size is $size',
		({ size, widthClass }) => {
			renderDrawer({ size });
			expect(screen.getByRole('dialog')).toHaveClass(widthClass);
		}
	);

	test('should keep the width out of plain utilities a consumer stylesheet could override', () => {
		renderDrawer();
		expect(screen.getByRole('dialog')).not.toHaveClass('w-full');
	});

	test('should use the transition shortcut', () => {
		renderDrawer();
		expect(screen.getByRole('dialog')).toHaveClass('ms-drawer-transition');
	});

	describe('unstyled and styling hooks', () => {
		function getParts() {
			const dialog = screen.getByRole('dialog');
			return {
				dialog,
				backdrop: dialog.previousElementSibling as HTMLElement,
				content: screen.getByText('Body'),
				heading: screen.getByRole('heading'),
			};
		}

		test('should strip the visual classes when unstyled', () => {
			renderDrawer({ unstyled: true });
			const { dialog, backdrop, content, heading } = getParts();
			expect(dialog).not.toHaveClass(
				'bg-white',
				'shadow-2xl',
				'ms-drawer-transition'
			);
			expect(backdrop).not.toHaveClass('bg-black/60', 'backdrop-blur-md');
			expect(content).not.toHaveClass('px-6', 'text-sm');
			expect(heading).not.toHaveClass('text-base');
			expect(heading.parentElement).not.toHaveClass('px-6');
		});

		test('should keep the layout classes when unstyled', () => {
			renderDrawer({ unstyled: true, side: 'left', size: 'lg' });
			const { dialog, backdrop, content } = getParts();
			expect(dialog).toHaveClass(
				'fixed',
				'inset-y-0',
				'h-full',
				'flex',
				'flex-col',
				'overflow-hidden',
				'left-0',
				'ms-drawer-width-lg',
				'focus:outline-none'
			);
			expect(backdrop).toHaveClass('fixed', 'inset-0');
			expect(content).toHaveClass('flex-1', 'overflow-y-auto', 'min-h-0');
		});

		test('should keep the visual classes by default', () => {
			renderDrawer();
			const { dialog, backdrop, content } = getParts();
			expect(dialog).toHaveClass('bg-white', 'shadow-2xl');
			expect(backdrop).toHaveClass('bg-black/60');
			expect(content).toHaveClass('px-6');
		});

		test('should drop the wrapper transition and strip the footer slot when unstyled', () => {
			renderDrawer({ unstyled: true, footer: <button>Save</button> });
			const slot = screen.getByRole('button', { name: 'Save' })
				.parentElement as HTMLElement;
			expect(getParts().dialog.parentElement).not.toHaveClass(
				'transition-opacity'
			);
			expect(slot).not.toHaveClass('px-6', 'py-4', 'border-t', 'gap-3');
			expect(slot).toHaveClass('flex', 'items-center', 'justify-end');
		});

		test('should set data-state to open then closed', () => {
			vi.useFakeTimers();
			const { rerender } = renderDrawer();
			act(() => {
				vi.advanceTimersByTime(100);
			});
			expect(getParts().dialog).toHaveAttribute('data-state', 'open');
			rerender(
				<Drawer isOpen={false} onClose={vi.fn<() => void>()} title="Settings">
					Body
				</Drawer>
			);
			expect(getParts().dialog).toHaveAttribute('data-state', 'closed');
		});

		test('should apply panelClassName and backdropClassName', () => {
			renderDrawer({
				unstyled: true,
				panelClassName: 'my-panel',
				backdropClassName: 'my-backdrop',
			});
			const { dialog, backdrop } = getParts();
			expect(dialog).toHaveClass('my-panel');
			expect(backdrop).toHaveClass('my-backdrop');
		});

		test('should still close on Escape and backdrop click when unstyled', () => {
			const { onClose } = renderDrawer({ unstyled: true });
			pressEscape();
			fireEvent.click(getParts().dialog.parentElement as Element);
			expect(onClose).toHaveBeenCalledTimes(2);
		});

		test('should still move focus into the dialog and restore it on close when unstyled', () => {
			const trigger = document.createElement('button');
			document.body.appendChild(trigger);
			trigger.focus();
			const { rerender } = renderDrawer({ unstyled: true });
			expect(getParts().dialog.contains(document.activeElement)).toBe(true);
			rerender(
				<Drawer isOpen={false} onClose={vi.fn<() => void>()} title="Settings">
					Body
				</Drawer>
			);
			expect(trigger).toHaveFocus();
			trigger.remove();
		});
	});
});

describe('Drawer onExited', () => {
	test('should call onExited once after the exit duration when closed', () => {
		vi.useFakeTimers();
		const onExited = vi.fn<() => void>();
		const { rerender } = renderDrawer({ onExited });

		rerenderDrawer(rerender, { isOpen: false, onExited });
		expect(onExited).not.toHaveBeenCalled();
		advancePastExit();

		expect(onExited).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('should not call onExited when the drawer reopens during the exit', () => {
		vi.useFakeTimers();
		const onExited = vi.fn<() => void>();
		const { rerender } = renderDrawer({ onExited });

		rerenderDrawer(rerender, { isOpen: false, onExited });
		rerenderDrawer(rerender, { isOpen: true, onExited });
		advancePastExit();

		expect(onExited).not.toHaveBeenCalled();
	});

	test('should not call onExited on an initial closed render', () => {
		vi.useFakeTimers();
		const onExited = vi.fn<() => void>();
		renderDrawer({ isOpen: false, onExited });
		advancePastExit();

		expect(onExited).not.toHaveBeenCalled();
	});

	test('should not restart the exit timer when onExited changes identity', () => {
		vi.useFakeTimers();
		const firstOnExited = vi.fn<() => void>();
		const latestOnExited = vi.fn<() => void>();
		const { rerender } = renderDrawer({ onExited: firstOnExited });

		rerenderDrawer(rerender, { isOpen: false, onExited: firstOnExited });
		act(() => {
			vi.advanceTimersByTime(DRAWER_EXIT_DURATION_MS - 1);
		});
		rerenderDrawer(rerender, { isOpen: false, onExited: latestOnExited });
		act(() => {
			vi.advanceTimersByTime(1);
		});

		expect(firstOnExited).not.toHaveBeenCalled();
		expect(latestOnExited).toHaveBeenCalledTimes(1);
	});
});
