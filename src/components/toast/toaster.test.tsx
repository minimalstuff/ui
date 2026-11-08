import '@testing-library/jest-dom/vitest';

import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { Modal } from '#components/modal/modal';
import { TOAST_EXIT_DURATION_MS } from '#components/shared/animation';
import { toast } from '#components/toast/toast';
import { Toaster } from '#components/toast/toaster';
import { TOAST_ANNOUNCE_DELAY_MS } from '#components/toast/use_toast_announcer';
import { useToastStore } from '#stores/toast_store/toast_store';

function getRegion() {
	return screen.getByRole('region', { name: 'Notifications' });
}

function getToastTexts(): string[] {
	return within(getRegion())
		.getAllByRole('listitem')
		.map(
			(item) => item.querySelector('[data-ms-toast-text]')?.textContent ?? ''
		);
}

function advance(milliseconds: number): void {
	act(() => {
		vi.advanceTimersByTime(milliseconds);
	});
}

function flushMicrotasks(): Promise<void> {
	return Promise.resolve();
}

afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
	useToastStore.getState().resetToasts();
});

describe('Toaster registry', () => {
	test('should render nothing and warn when another Toaster is already mounted', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		render(
			<>
				<Toaster />
				<Toaster />
			</>
		);

		expect(screen.getAllByRole('region')).toHaveLength(1);
		expect(warn).toHaveBeenCalledTimes(1);
	});

	test('should let the next Toaster take over when the active one unmounts', () => {
		vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const first = render(<Toaster />);
		render(<Toaster />);

		first.unmount();

		expect(screen.getAllByRole('region')).toHaveLength(1);
	});

	test('should empty the store once the last Toaster unmounts', async () => {
		const view = render(<Toaster />);
		act(() => {
			toast('Saved');
		});

		view.unmount();
		await act(flushMicrotasks);

		expect(useToastStore.getState().entries).toEqual([]);
	});

	test('should keep the toasts when a StrictMode remount unmounts the Toaster briefly', async () => {
		toast('Saved');

		render(
			<StrictMode>
				<Toaster />
			</StrictMode>
		);
		await act(flushMicrotasks);

		expect(getToastTexts()).toEqual(['Saved']);
	});
});

describe('Toaster order', () => {
	test('should list toasts chronologically for a bottom position', () => {
		render(<Toaster position="bottom-left" />);
		act(() => {
			toast('First');
			toast('Second');
		});

		expect(getToastTexts()).toEqual(['First', 'Second']);
	});

	test('should list the newest toast first for a top position', () => {
		render(<Toaster position="top-center" />);
		act(() => {
			toast('First');
			toast('Second');
		});

		expect(getToastTexts()).toEqual(['Second', 'First']);
	});
});

describe('Toaster announcements', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	test('should announce info politely and errors assertively with the text only', () => {
		render(<Toaster />);
		act(() => {
			toast.success('Saved', {
				description: 'All good',
				action: { label: 'Undo', onClick: () => undefined },
			});
			toast.error('Failed');
		});
		advance(TOAST_ANNOUNCE_DELAY_MS);

		expect(screen.getByRole('status').textContent).toBe('Saved All good');
		expect(screen.getByRole('alert').textContent).toBe('Failed');
	});

	test('should keep the announcers outside the notifications region', () => {
		render(<Toaster />);

		expect(getRegion()).not.toContainElement(screen.getByRole('status'));
		expect(getRegion()).not.toContainElement(screen.getByRole('alert'));
	});

	test('should announce the same id again, even with identical text', () => {
		render(<Toaster />);
		act(() => {
			toast('Synced', { id: 'sync' });
		});
		advance(TOAST_ANNOUNCE_DELAY_MS);
		expect(screen.getByRole('status').textContent).toBe('Synced');

		act(() => {
			toast('Synced', { id: 'sync' });
		});
		expect(screen.getByRole('status')).toBeEmptyDOMElement();
		advance(TOAST_ANNOUNCE_DELAY_MS);

		expect(screen.getByRole('status').textContent).toBe('Synced');
	});

	test('should replace the previous announcement instead of reading the stack', () => {
		render(<Toaster />);
		act(() => {
			toast('First');
		});
		advance(TOAST_ANNOUNCE_DELAY_MS);
		act(() => {
			toast('Second');
		});
		advance(TOAST_ANNOUNCE_DELAY_MS);

		expect(screen.getByRole('status').textContent).toBe('Second');
	});
});

describe('Toaster announcements over a dialog', () => {
	test('should write into the open dialog slot and not into its own announcer', async () => {
		render(
			<>
				<Modal />
				<Toaster />
			</>
		);
		act(() => {
			void Modal.call({ title: 'Settings', children: 'Body' });
		});
		const dialog = await screen.findByRole('dialog');
		await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'open'));

		act(() => {
			toast('Saved');
		});
		const slot = dialog.querySelector('[data-ms-toast-announcer="polite"]');
		await waitFor(() => expect(slot).toHaveTextContent('Saved'));

		const ownAnnouncer = Array.from(
			document.querySelectorAll('[role="status"]')
		).find((element) => !dialog.contains(element));
		expect(ownAnnouncer).toBeEmptyDOMElement();
	});
});

describe('Toaster focus on close', () => {
	function showTwoToasts(): [string, string] {
		let ids: [string, string] = ['', ''];
		act(() => {
			ids = [toast('First', { duration: 0 }), toast('Second', { duration: 0 })];
		});
		return ids;
	}

	function getToastButton(index: number): HTMLElement {
		const item = within(getRegion()).getAllByRole('listitem')[index];
		return within(item).getByRole('button', { name: 'Close notification' });
	}

	beforeEach(() => {
		vi.useFakeTimers();
	});

	test('should focus the next toast when the focused one starts closing', () => {
		render(<Toaster />);
		const [firstId] = showTwoToasts();
		act(() => getToastButton(0).focus());

		act(() => toast.dismiss(firstId));

		expect(document.activeElement).toBe(getToastButton(1));
	});

	test('should restore the element focused before the toaster when no toast follows', () => {
		render(
			<>
				<button>Outside</button>
				<Toaster />
			</>
		);
		const [, secondId] = showTwoToasts();
		const outside = screen.getByRole('button', { name: 'Outside' });
		act(() => outside.focus());
		act(() => getToastButton(1).focus());

		act(() => toast.dismiss(secondId));

		expect(document.activeElement).toBe(outside);
	});

	test('should focus the region when there is nowhere else to go', () => {
		render(<Toaster />);
		let id = '';
		act(() => {
			id = toast('Only', { duration: 0 });
		});
		act(() => getToastButton(0).focus());

		act(() => toast.dismiss(id));
		advance(TOAST_EXIT_DURATION_MS);

		expect(document.activeElement).toBe(getRegion());
	});

	test('should leave focus alone when the closing toast is not focused', () => {
		render(
			<>
				<button>Outside</button>
				<Toaster />
			</>
		);
		const [firstId] = showTwoToasts();
		const outside = screen.getByRole('button', { name: 'Outside' });
		act(() => outside.focus());

		act(() => toast.dismiss(firstId));

		expect(document.activeElement).toBe(outside);
	});
});

describe('Toaster timer bar', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	test('should pause the bar while the toast is hovered', () => {
		render(<Toaster />);
		act(() => {
			toast('Saved', { duration: 1000 });
		});
		const item = within(getRegion()).getByRole('listitem');
		const bar = item.querySelector('[data-ms-toast-timer-bar]');
		expect(bar).toHaveAttribute('data-running', 'true');

		fireEvent.pointerEnter(item, { pointerType: 'mouse' });

		expect(bar).toHaveAttribute('data-running', 'false');
		expect(bar).toHaveStyle({ animationPlayState: 'paused' });
	});

	test('should not pause the bar when a touch pointer enters the toast', () => {
		render(<Toaster />);
		act(() => {
			toast('Saved', { duration: 1000 });
		});
		const item = within(getRegion()).getByRole('listitem');
		const bar = item.querySelector('[data-ms-toast-timer-bar]');

		fireEvent.pointerEnter(item, { pointerType: 'touch' });

		expect(bar).toHaveAttribute('data-running', 'true');
	});

	test('should render no bar for a toast that stays until dismissed', () => {
		render(<Toaster />);
		act(() => {
			toast.error('Failed');
		});

		expect(
			getRegion().querySelector('[data-ms-toast-timer-bar]')
		).not.toBeInTheDocument();
	});
});

describe('Toaster radius and unstyled', () => {
	function showEntry(overrides: { radius?: 'xl'; unstyled?: boolean }) {
		act(() => {
			useToastStore.getState().showToast({
				id: 'entry',
				message: 'Saved',
				tone: 'info',
				duration: 0,
				...overrides,
			});
		});
		return within(getRegion()).getByRole('listitem');
	}

	test('should use lg and the styled look by default', () => {
		render(<Toaster />);

		const item = showEntry({});

		expect(item).toHaveClass('rounded-lg', 'shadow-lg');
	});

	test('should prefer the Toaster radius over the default', () => {
		render(<Toaster radius="md" />);

		expect(showEntry({})).toHaveClass('rounded-md');
	});

	test('should prefer the entry radius over the Toaster radius', () => {
		render(<Toaster radius="md" />);

		expect(showEntry({ radius: 'xl' })).toHaveClass('rounded-xl');
	});

	test('should strip the styling when the Toaster is unstyled', () => {
		render(<Toaster unstyled />);

		const item = showEntry({});

		expect(item).not.toHaveClass('shadow-lg');
		expect(
			within(item).getByRole('button', { name: 'Close notification' })
		).toBeInTheDocument();
	});

	test('should prefer the entry unstyled flag over the Toaster', () => {
		render(<Toaster unstyled />);

		expect(showEntry({ unstyled: false })).toHaveClass('shadow-lg');
	});
});
