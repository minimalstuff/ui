import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, test, vi } from 'vitest';

import { Modal } from '#components/modal/modal';
import { ModalProvider } from '#components/modal_provider/modal_provider';
import { Popover, type PopoverProps } from '#components/popover/popover';

function popoverTree(props: Partial<PopoverProps> = {}) {
	return (
		<>
			<button>Outside</button>
			<Popover
				trigger={<button>Filters</button>}
				aria-label="Filters"
				{...props}
			>
				<label>
					<input type="radio" name="order" /> Newest
				</label>
				<button>Apply</button>
			</Popover>
		</>
	);
}

function renderPopover(props: Partial<PopoverProps> = {}) {
	return render(popoverTree(props));
}

const getTrigger = () => screen.getByRole('button', { name: 'Filters' });

async function openPopover() {
	fireEvent.click(getTrigger());
	await waitFor(() =>
		expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'open')
	);
}

const expectClosed = () =>
	waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

describe('Popover', () => {
	test('is closed by default', () => {
		renderPopover();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('opens a non-modal named dialog wired to the trigger', async () => {
		renderPopover();
		await openPopover();

		const dialog = screen.getByRole('dialog', { name: 'Filters' });
		expect(dialog).not.toHaveAttribute('aria-modal');
		expect(getTrigger()).toHaveAttribute('aria-haspopup', 'dialog');
		expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
		expect(getTrigger()).toHaveAttribute('aria-controls', dialog.id);
	});

	test('names the dialog with aria-labelledby', async () => {
		render(
			<>
				<h2 id="title">Sort order</h2>
				<Popover trigger={<button>Filters</button>} aria-labelledby="title">
					<button>Apply</button>
				</Popover>
			</>
		);
		await openPopover();
		expect(screen.getByRole('dialog', { name: 'Sort order' })).toBeVisible();
	});

	test('opens on mount with defaultOpen', async () => {
		renderPopover({ defaultOpen: true });
		expect(await screen.findByRole('dialog')).toBeInTheDocument();
	});

	test('moves focus to the first tabbable element on open', async () => {
		renderPopover();
		await openPopover();
		await waitFor(() => expect(screen.getByRole('radio')).toHaveFocus());
	});

	test('moves focus to initialFocusRef when provided', async () => {
		const initialFocusRef = createRef<HTMLButtonElement>();
		render(
			<Popover
				trigger={<button>Filters</button>}
				aria-label="Filters"
				initialFocusRef={initialFocusRef}
			>
				<input type="radio" />
				<button ref={initialFocusRef}>Apply</button>
			</Popover>
		);
		await openPopover();
		await waitFor(() =>
			expect(screen.getByRole('button', { name: 'Apply' })).toHaveFocus()
		);
	});

	test('focuses the panel itself when it has nothing tabbable', async () => {
		render(
			<Popover trigger={<button>Filters</button>} aria-label="Filters">
				<p>Nothing to press</p>
			</Popover>
		);
		await openPopover();
		await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());
	});

	test('stays open when content is clicked', async () => {
		renderPopover();
		await openPopover();

		fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
		fireEvent.click(screen.getByRole('radio'));

		expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'open');
	});

	test('closes on a second trigger click and focuses the trigger', async () => {
		renderPopover();
		await openPopover();

		fireEvent.click(getTrigger());

		await expectClosed();
		expect(getTrigger()).toHaveFocus();
	});

	test('closes on Escape without letting the event through, and focuses the trigger', async () => {
		renderPopover();
		await openPopover();

		const notPrevented = fireEvent.keyDown(screen.getByRole('radio'), {
			key: 'Escape',
		});

		expect(notPrevented).toBe(false);
		await expectClosed();
		expect(getTrigger()).toHaveFocus();
	});

	test('closes on Escape pressed on the trigger', async () => {
		renderPopover();
		await openPopover();

		fireEvent.keyDown(getTrigger(), { key: 'Escape' });

		await expectClosed();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('closes on a pointer down outside without stealing focus', async () => {
		renderPopover();
		await openPopover();
		const outside = screen.getByRole('button', { name: 'Outside' });
		outside.focus();

		fireEvent.pointerDown(outside);

		await expectClosed();
		expect(outside).toHaveFocus();
	});

	test('returns focus to the trigger after an outside pointer down that leaves it on body', async () => {
		renderPopover();
		await openPopover();
		(document.activeElement as HTMLElement).blur();

		fireEvent.pointerDown(document.body);

		await waitFor(() => expect(getTrigger()).toHaveFocus());
		await expectClosed();
	});

	test('stays open on a pointer down inside the panel', async () => {
		renderPopover();
		await openPopover();

		fireEvent.pointerDown(screen.getByRole('button', { name: 'Apply' }));

		expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'open');
	});

	test('closes and focuses the trigger when Tab leaves the last element', async () => {
		renderPopover();
		await openPopover();
		const last = screen.getByRole('button', { name: 'Apply' });
		last.focus();

		const notPrevented = fireEvent.keyDown(last, { key: 'Tab' });

		expect(notPrevented).toBe(false);
		await expectClosed();
		expect(getTrigger()).toHaveFocus();
	});

	test('closes when Shift+Tab leaves the first element', async () => {
		renderPopover();
		await openPopover();
		const first = screen.getByRole('radio');
		first.focus();

		fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });

		await expectClosed();
		expect(getTrigger()).toHaveFocus();
	});

	test('stays open when Tab moves between elements of the panel', async () => {
		renderPopover();
		await openPopover();
		const first = screen.getByRole('radio');
		first.focus();

		fireEvent.keyDown(first, { key: 'Tab' });

		expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'open');
	});

	test('closes when focus moves to an element outside', async () => {
		renderPopover();
		await openPopover();

		screen.getByRole('button', { name: 'Outside' }).focus();

		await expectClosed();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('closes when disabled becomes true', async () => {
		const { rerender } = renderPopover();
		await openPopover();

		rerender(popoverTree({ disabled: true }));

		await expectClosed();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('does not open on trigger click while disabled', () => {
		renderPopover({ disabled: true });
		fireEvent.click(getTrigger());
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('calls onOpenChange once per open and once per close', async () => {
		const onOpenChange = vi.fn<(isOpen: boolean) => void>();
		renderPopover({ onOpenChange });

		await openPopover();
		expect(onOpenChange.mock.calls).toEqual([[true]]);

		fireEvent.keyDown(screen.getByRole('radio'), { key: 'Escape' });
		await expectClosed();
		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
	});

	test('calls onOpenChange once when an outside click also blurs the panel', async () => {
		const onOpenChange = vi.fn<(isOpen: boolean) => void>();
		renderPopover({ onOpenChange });
		await openPopover();
		onOpenChange.mockClear();
		const outside = screen.getByRole('button', { name: 'Outside' });

		fireEvent.pointerDown(outside);
		outside.focus();

		await expectClosed();
		expect(onOpenChange).toHaveBeenCalledTimes(1);
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	test('calls onOpenChange when disabled closes it', async () => {
		const onOpenChange = vi.fn<(isOpen: boolean) => void>();
		const { rerender } = renderPopover({ onOpenChange });
		await openPopover();
		onOpenChange.mockClear();

		rerender(popoverTree({ disabled: true, onOpenChange }));

		await expectClosed();
		expect(onOpenChange.mock.calls).toEqual([[false]]);
	});

	test('follows isOpen when controlled and only requests changes', async () => {
		const onOpenChange = vi.fn<(isOpen: boolean) => void>();
		const { rerender } = renderPopover({ isOpen: false, onOpenChange });

		fireEvent.click(getTrigger());
		expect(onOpenChange).toHaveBeenCalledWith(true);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

		rerender(popoverTree({ isOpen: true, onOpenChange }));
		expect(await screen.findByRole('dialog')).toBeInTheDocument();
	});

	test('drops the library styling but keeps panelClassName when unstyled', async () => {
		renderPopover({ unstyled: true, panelClassName: 'custom-panel' });
		await openPopover();

		const panel = screen.getByRole('dialog');
		expect(panel).toHaveClass('custom-panel');
		expect(panel).not.toHaveClass('border');
	});

	test('forwards ref to the wrapper span', () => {
		const ref = createRef<HTMLSpanElement>();
		renderPopover({ ref });
		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
	});
});

describe('Popover inside a Modal', () => {
	test('closes alone on Escape and leaves the modal open', async () => {
		function Opener() {
			const open = () => {
				void Modal.call({
					title: 'Settings',
					children: (
						<Popover trigger={<button>Filters</button>} aria-label="Filters">
							<button>Apply</button>
						</Popover>
					),
				});
			};
			return (
				<>
					<button onClick={open}>Open settings</button>
					<ModalProvider />
				</>
			);
		}
		render(<Opener />);
		fireEvent.click(screen.getByText('Open settings'));
		await screen.findByRole('dialog', { name: 'Settings' });
		fireEvent.click(getTrigger());
		const panel = await screen.findByRole('dialog', { name: 'Filters' });

		fireEvent.keyDown(panel, { key: 'Escape' });

		await waitFor(() =>
			expect(
				screen.queryByRole('dialog', { name: 'Filters' })
			).not.toBeInTheDocument()
		);
		expect(
			screen.getByRole('dialog', { name: 'Settings' })
		).toBeInTheDocument();
	});
});
