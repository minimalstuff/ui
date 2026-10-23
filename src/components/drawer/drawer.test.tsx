import '@testing-library/jest-dom/vitest';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ConfirmModal } from '#components/modal/confirm_modal';
import { ModalFooter } from '#components/modal/modal_footer';
import { DRAWER_EXIT_DURATION_MS } from '#components/shared/animation';
import { Drawer, type DrawerProps } from './drawer';

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

	test('should slide in from the left when side is left', () => {
		renderDrawer({ side: 'left' });
		expect(screen.getByRole('dialog')).toHaveClass(
			'left-0',
			'-translate-x-full'
		);
	});

	test('should round only the inner edge corners', () => {
		renderDrawer({ radius: 'lg' });
		expect(screen.getByRole('dialog')).toHaveClass('rounded-l-lg');
	});

	test('should apply the size width from the sm breakpoint', () => {
		renderDrawer({ size: 'lg' });
		expect(screen.getByRole('dialog')).toHaveClass('w-full', 'sm:w-[32.5rem]');
	});
});
