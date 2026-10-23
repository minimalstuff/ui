import '@testing-library/jest-dom/vitest';

import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from '@testing-library/react';
import { useState, type ReactNode } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Drawer } from '#components/drawer/drawer';
import { ConfirmModal } from '#components/modal/confirm_modal';
import { Modal } from '#components/modal/modal';
import { ModalFooter } from '#components/modal/modal_footer';
import { useDismissGuard, type DismissGuard } from './use_dismiss_guard';

const GUARDED_INPUT_LABEL = 'Display name';
const DISCARD_TITLE = 'Discard your changes?';

interface GuardedContentProps {
	guard: DismissGuard;
	isEnabled?: boolean;
}

function GuardedContent({
	guard,
	isEnabled,
}: Readonly<GuardedContentProps>): ReactNode {
	useDismissGuard(guard, isEnabled);
	return <input aria-label={GUARDED_INPUT_LABEL} />;
}

function GuardedFooter({ guard }: Readonly<GuardedContentProps>): ReactNode {
	useDismissGuard(guard);
	return <button type="button">Save</button>;
}

function StateGuardedContent(): ReactNode {
	const [isSafeToClose, setIsSafeToClose] = useState(false);
	useDismissGuard(() => isSafeToClose);
	return (
		<button type="button" onClick={() => setIsSafeToClose(true)}>
			Allow closing
		</button>
	);
}

interface StackedGuardsProps {
	firstGuard: DismissGuard;
	secondGuard: DismissGuard;
}

function SecondGuard({ guard }: Readonly<{ guard: DismissGuard }>): ReactNode {
	useDismissGuard(guard);
	return null;
}

function StackedGuards({
	firstGuard,
	secondGuard,
}: Readonly<StackedGuardsProps>): ReactNode {
	const [hasSecondGuard, setHasSecondGuard] = useState(false);
	useDismissGuard(firstGuard);
	return (
		<>
			<button
				type="button"
				onClick={() => setHasSecondGuard((value) => !value)}
			>
				Toggle second guard
			</button>
			{hasSecondGuard && <SecondGuard guard={secondGuard} />}
		</>
	);
}

function OrphanGuard(): ReactNode {
	useDismissGuard(() => true);
	return null;
}

function createDeferredVerdict() {
	let settle: (isAllowed: boolean) => void = () => {};
	const guard = vi.fn<DismissGuard>(
		() =>
			new Promise<boolean>((resolve) => {
				settle = resolve;
			})
	);
	return { guard, settle: (isAllowed: boolean) => settle(isAllowed) };
}

function getBackdrop(): Element {
	return screen.getByRole('dialog').parentElement as Element;
}

function pressEscape(): void {
	fireEvent.keyDown(document, { key: 'Escape' });
}

async function flushMicrotasks(): Promise<void> {
	await act(async () => {});
}

async function waitForConfirmToClose(): Promise<void> {
	await waitFor(() =>
		expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
	);
}

interface DismissalPath {
	name: string;
	dismiss: () => void;
}

const MODAL_DISMISSAL_PATHS: DismissalPath[] = [
	{ name: 'Escape', dismiss: pressEscape },
	{ name: 'a backdrop click', dismiss: () => fireEvent.click(getBackdrop()) },
	{
		name: 'the close button',
		dismiss: () =>
			fireEvent.click(screen.getByRole('button', { name: 'Close' })),
	},
	{
		name: 'the render-prop close',
		dismiss: () =>
			fireEvent.click(screen.getByRole('button', { name: 'Done' })),
	},
];

const DRAWER_DISMISSAL_PATHS = MODAL_DISMISSAL_PATHS.slice(0, 3);

interface OpenedModal {
	call: Promise<void>;
	hasEnded: () => boolean;
}

function openModal(content: (close: () => void) => ReactNode): OpenedModal {
	render(<Modal />);
	let hasEnded = false;
	let call: Promise<void> = Promise.resolve();
	act(() => {
		call = Modal.call({ title: 'Settings', children: content });
		void call.then(() => {
			hasEnded = true;
		});
	});
	return { call, hasEnded: () => hasEnded };
}

function openGuardedModal(
	guard: DismissGuard,
	isEnabled?: boolean
): OpenedModal {
	return openModal((close) => (
		<>
			<GuardedContent guard={guard} isEnabled={isEnabled} />
			<button type="button" onClick={close}>
				Done
			</button>
		</>
	));
}

function renderGuardedDrawer(guard: DismissGuard, isEnabled?: boolean) {
	const onClose = vi.fn<() => void>();
	const view = render(
		<Drawer isOpen onClose={onClose} title="Settings">
			<GuardedContent guard={guard} isEnabled={isEnabled} />
		</Drawer>
	);
	return { onClose, ...view };
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('useDismissGuard in a Modal', () => {
	test.each(MODAL_DISMISSAL_PATHS)(
		'should run the guard when dismissing with $name',
		async ({ dismiss }) => {
			const guard = vi.fn<DismissGuard>(() => false);
			openGuardedModal(guard);

			dismiss();

			expect(guard).toHaveBeenCalledTimes(1);
		}
	);

	test.each(MODAL_DISMISSAL_PATHS)(
		'should keep the modal open when the guard returns false for $name',
		async ({ dismiss }) => {
			const { hasEnded } = openGuardedModal(() => false);

			dismiss();
			await flushMicrotasks();

			expect(hasEnded()).toBe(false);
			expect(screen.getByRole('dialog')).toBeInTheDocument();
		}
	);

	test.each(MODAL_DISMISSAL_PATHS)(
		'should end the call when the guard returns true for $name',
		async ({ dismiss }) => {
			const { call } = openGuardedModal(() => true);

			dismiss();

			await expect(call).resolves.toBeUndefined();
		}
	);

	test('should end the call when an async guard resolves true', async () => {
		const { call } = openGuardedModal(() => Promise.resolve(true));

		pressEscape();

		await expect(call).resolves.toBeUndefined();
	});

	test('should keep the modal open when an async guard resolves false', async () => {
		const { hasEnded } = openGuardedModal(() => Promise.resolve(false));

		pressEscape();
		await flushMicrotasks();

		expect(hasEnded()).toBe(false);
	});

	test('should keep the modal open and clear the pending state when the guard throws', async () => {
		const guard = vi.fn<DismissGuard>(() => {
			throw new Error('guard failed');
		});
		const { hasEnded } = openGuardedModal(guard);
		vi.spyOn(globalThis, 'queueMicrotask').mockImplementation(() => {});

		pressEscape();
		pressEscape();

		expect(hasEnded()).toBe(false);
		expect(guard).toHaveBeenCalledTimes(2);
	});

	test('should end the call without running the guard when Modal.end is called', async () => {
		const guard = vi.fn<DismissGuard>(() => false);
		const { call, hasEnded } = openGuardedModal(guard);

		act(() => {
			Modal.end(call, undefined);
		});
		await flushMicrotasks();

		expect(hasEnded()).toBe(true);
		expect(guard).not.toHaveBeenCalled();
	});

	test('should run a guard registered from a ModalFooter subtree', () => {
		const guard = vi.fn<DismissGuard>(() => false);
		openModal(() => (
			<ModalFooter>
				<GuardedFooter guard={guard} />
			</ModalFooter>
		));

		pressEscape();

		expect(guard).toHaveBeenCalledTimes(1);
	});

	test('should keep the guarded modal open and refocus its input when the stacked confirm is cancelled', async () => {
		const guard = vi.fn<DismissGuard>(() =>
			ConfirmModal.call({ title: DISCARD_TITLE })
		);
		render(<ConfirmModal />);
		const { hasEnded } = openGuardedModal(guard);
		const input = screen.getByRole('textbox', { name: GUARDED_INPUT_LABEL });
		input.focus();

		pressEscape();
		await screen.findByRole('alertdialog', { name: DISCARD_TITLE });
		pressEscape();
		await waitForConfirmToClose();

		expect(hasEnded()).toBe(false);
		expect(
			screen.getByRole('dialog', { name: 'Settings' })
		).toBeInTheDocument();
		expect(input).toHaveFocus();
		expect(guard).toHaveBeenCalledTimes(1);
	});

	test('should end the call when the stacked confirm is confirmed', async () => {
		render(<ConfirmModal />);
		const { call } = openGuardedModal(() =>
			ConfirmModal.call({ title: DISCARD_TITLE })
		);

		pressEscape();
		await screen.findByRole('alertdialog', { name: DISCARD_TITLE });
		fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

		await expect(call).resolves.toBeUndefined();
	});

	test('should ignore further dismissals while an async guard is pending', () => {
		const { guard } = createDeferredVerdict();
		openGuardedModal(guard);

		pressEscape();
		fireEvent.click(getBackdrop());
		fireEvent.click(screen.getByRole('button', { name: 'Close' }));

		expect(guard).toHaveBeenCalledTimes(1);
	});

	test('should run the guard again after a pending guard resolved false', async () => {
		const { guard, settle } = createDeferredVerdict();
		openGuardedModal(guard);
		pressEscape();

		act(() => settle(false));
		await flushMicrotasks();
		pressEscape();

		expect(guard).toHaveBeenCalledTimes(2);
	});

	test('should dismiss without running the guard when it is disabled', async () => {
		const guard = vi.fn<DismissGuard>(() => false);
		const { call } = openGuardedModal(guard, false);

		pressEscape();

		await expect(call).resolves.toBeUndefined();
		expect(guard).not.toHaveBeenCalled();
	});

	test('should run the latest guard after a rerender', async () => {
		const { hasEnded } = openModal(() => <StateGuardedContent />);
		pressEscape();
		expect(hasEnded()).toBe(false);

		fireEvent.click(screen.getByRole('button', { name: 'Allow closing' }));
		pressEscape();

		await waitFor(() => expect(hasEnded()).toBe(true));
	});

	test('should run only the most recently registered guard and fall back to the previous one', async () => {
		const firstGuard = vi.fn<DismissGuard>(() => false);
		const secondGuard = vi.fn<DismissGuard>(() => false);
		openModal(() => (
			<StackedGuards firstGuard={firstGuard} secondGuard={secondGuard} />
		));
		const toggle = screen.getByRole('button', { name: 'Toggle second guard' });
		fireEvent.click(toggle);

		pressEscape();

		expect(secondGuard).toHaveBeenCalledTimes(1);
		expect(firstGuard).not.toHaveBeenCalled();

		fireEvent.click(toggle);
		pressEscape();

		expect(firstGuard).toHaveBeenCalledTimes(1);
		expect(secondGuard).toHaveBeenCalledTimes(1);
	});

	test('should throw when used outside a Modal or a Drawer', () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => render(<OrphanGuard />)).toThrow(
			'useDismissGuard must be used inside a Modal or a Drawer'
		);
	});

	test('should have no axe violations with a guard registered', async () => {
		openGuardedModal(() => true);
		expect(await axe(document.body)).toHaveNoViolations();
	});
});

describe('useDismissGuard in a Drawer', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	test.each(DRAWER_DISMISSAL_PATHS)(
		'should run the guard when dismissing with $name',
		({ dismiss }) => {
			const guard = vi.fn<DismissGuard>(() => false);
			renderGuardedDrawer(guard);

			dismiss();

			expect(guard).toHaveBeenCalledTimes(1);
		}
	);

	test.each(DRAWER_DISMISSAL_PATHS)(
		'should not call onClose when the guard returns false for $name',
		async ({ dismiss }) => {
			const { onClose } = renderGuardedDrawer(() => false);

			dismiss();
			await flushMicrotasks();

			expect(onClose).not.toHaveBeenCalled();
		}
	);

	test.each(DRAWER_DISMISSAL_PATHS)(
		'should call onClose once when the guard returns true for $name',
		({ dismiss }) => {
			const { onClose } = renderGuardedDrawer(() => true);

			dismiss();

			expect(onClose).toHaveBeenCalledTimes(1);
		}
	);

	test('should call onClose once when an async guard resolves true', async () => {
		const { onClose } = renderGuardedDrawer(() => Promise.resolve(true));

		pressEscape();

		await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
	});

	test('should not call onClose when an async guard resolves false', async () => {
		const { onClose } = renderGuardedDrawer(() => Promise.resolve(false));

		pressEscape();
		await flushMicrotasks();

		expect(onClose).not.toHaveBeenCalled();
	});

	test('should close without running the guard when isOpen turns false', () => {
		vi.useFakeTimers();
		const guard = vi.fn<DismissGuard>(() => false);
		const { rerender } = renderGuardedDrawer(guard);

		rerender(
			<Drawer isOpen={false} onClose={vi.fn<() => void>()} title="Settings">
				<GuardedContent guard={guard} />
			</Drawer>
		);
		act(() => {
			vi.runAllTimers();
		});

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(guard).not.toHaveBeenCalled();
	});

	test('should not call onClose when the drawer closed while an async guard was pending', async () => {
		vi.useFakeTimers();
		const { guard, settle } = createDeferredVerdict();
		const { onClose, rerender } = renderGuardedDrawer(guard);
		pressEscape();

		rerender(
			<Drawer isOpen={false} onClose={onClose} title="Settings">
				<GuardedContent guard={guard} />
			</Drawer>
		);
		act(() => settle(true));
		await flushMicrotasks();

		expect(onClose).not.toHaveBeenCalled();
	});

	test('should run a guard registered from the footer prop', () => {
		const guard = vi.fn<DismissGuard>(() => false);
		render(
			<Drawer
				isOpen
				onClose={vi.fn<() => void>()}
				title="Settings"
				footer={<GuardedFooter guard={guard} />}
			>
				Body
			</Drawer>
		);

		pressEscape();

		expect(guard).toHaveBeenCalledTimes(1);
	});

	test('should keep the drawer open and refocus its input when the stacked confirm is cancelled', async () => {
		const guard = vi.fn<DismissGuard>(() =>
			ConfirmModal.call({ title: DISCARD_TITLE })
		);
		render(<ConfirmModal />);
		const { onClose } = renderGuardedDrawer(guard);
		const input = screen.getByRole('textbox', { name: GUARDED_INPUT_LABEL });
		input.focus();

		pressEscape();
		await screen.findByRole('alertdialog', { name: DISCARD_TITLE });
		pressEscape();
		await waitForConfirmToClose();

		expect(onClose).not.toHaveBeenCalled();
		expect(
			screen.getByRole('dialog', { name: 'Settings' })
		).toBeInTheDocument();
		expect(input).toHaveFocus();
		expect(guard).toHaveBeenCalledTimes(1);
	});

	test('should call onClose when the stacked confirm is confirmed', async () => {
		render(<ConfirmModal />);
		const { onClose } = renderGuardedDrawer(() =>
			ConfirmModal.call({ title: DISCARD_TITLE })
		);

		pressEscape();
		await screen.findByRole('alertdialog', { name: DISCARD_TITLE });
		fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

		await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
	});

	test('should ignore further dismissals while an async guard is pending', () => {
		const { guard } = createDeferredVerdict();
		renderGuardedDrawer(guard);

		pressEscape();
		fireEvent.click(getBackdrop());
		fireEvent.click(screen.getByRole('button', { name: 'Close' }));

		expect(guard).toHaveBeenCalledTimes(1);
	});

	test('should run the guard again after a pending guard resolved false', async () => {
		const { guard, settle } = createDeferredVerdict();
		renderGuardedDrawer(guard);
		pressEscape();

		act(() => settle(false));
		await flushMicrotasks();
		pressEscape();

		expect(guard).toHaveBeenCalledTimes(2);
	});

	test('should dismiss without running the guard when it is disabled', () => {
		const guard = vi.fn<DismissGuard>(() => false);
		const { onClose } = renderGuardedDrawer(guard, false);

		pressEscape();

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(guard).not.toHaveBeenCalled();
	});

	test('should have no axe violations with a guard registered', async () => {
		renderGuardedDrawer(() => true);
		expect(await axe(document.body)).toHaveNoViolations();
	});
});
