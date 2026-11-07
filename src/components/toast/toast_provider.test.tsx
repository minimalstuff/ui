import '@testing-library/jest-dom/vitest';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { TOAST_EXIT_DURATION_MS } from '#components/shared/animation';
import { ToastProvider } from '#components/toast/toast_provider';
import { type ToastApi } from '#components/toast/toast_types';
import { useToast } from '#components/toast/use_toast';

function renderToasts() {
	let toastApi: ToastApi | null = null;
	function Capture() {
		const api = useToast();
		useEffect(() => {
			toastApi = api;
		}, [api]);
		return null;
	}
	const view = render(
		<ToastProvider>
			<Capture />
		</ToastProvider>
	);
	const getApi = (): ToastApi => {
		if (!toastApi) throw new Error('expected the toast api to be captured');
		return toastApi;
	};
	return { getApi, ...view };
}

function advance(milliseconds: number): void {
	act(() => {
		vi.advanceTimersByTime(milliseconds);
	});
}

function advanceThroughExit(milliseconds: number): void {
	advance(milliseconds);
	advance(TOAST_EXIT_DURATION_MS);
}

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe('ToastProvider', () => {
	test('should show a toast and remove it once dismissed', () => {
		const { getApi } = renderToasts();
		let id = '';
		act(() => {
			id = getApi().show({ message: 'Saved' });
		});
		expect(screen.getByText('Saved')).toBeInTheDocument();

		act(() => getApi().dismiss(id));
		advance(TOAST_EXIT_DURATION_MS);

		expect(screen.queryByText('Saved')).not.toBeInTheDocument();
	});

	test('should dismiss itself after the default duration', () => {
		const { getApi } = renderToasts();
		act(() => {
			getApi().show({ message: 'Saved' });
		});

		advance(3999);
		expect(screen.getByText('Saved')).toBeInTheDocument();

		advanceThroughExit(1);
		expect(screen.queryByText('Saved')).not.toBeInTheDocument();
	});

	test('should keep an error longer than an info toast', () => {
		const { getApi } = renderToasts();
		act(() => {
			getApi().show({ message: 'Failed', tone: 'error' });
		});

		advance(4000 + TOAST_EXIT_DURATION_MS);
		expect(screen.getByText('Failed')).toBeInTheDocument();

		advanceThroughExit(2000);
		expect(screen.queryByText('Failed')).not.toBeInTheDocument();
	});

	test.each([0, Infinity])(
		'should keep a toast until dismissed when the duration is %s',
		(duration) => {
			const { getApi } = renderToasts();
			act(() => {
				getApi().show({ message: 'Sticky', duration });
			});

			advance(60_000);

			expect(screen.getByText('Sticky')).toBeInTheDocument();
		}
	);

	test('should pause the timer while the toast is hovered', () => {
		const { getApi } = renderToasts();
		act(() => {
			getApi().show({ message: 'Saved', duration: 1000 });
		});
		const toast = screen.getByText('Saved');

		advance(600);
		fireEvent.mouseEnter(toast);
		advance(5000);
		expect(screen.getByText('Saved')).toBeInTheDocument();

		fireEvent.mouseLeave(toast);
		advance(399);
		expect(screen.getByText('Saved')).toBeInTheDocument();
		advanceThroughExit(1);
		expect(screen.queryByText('Saved')).not.toBeInTheDocument();
	});

	test('should pause the timer while focus is inside the toast', () => {
		const { getApi } = renderToasts();
		act(() => {
			getApi().show({ message: 'Saved', duration: 1000 });
		});
		const closeButton = screen.getByRole('button', {
			name: 'Close notification',
		});

		act(() => closeButton.focus());
		advance(5000);
		expect(screen.getByText('Saved')).toBeInTheDocument();

		act(() => closeButton.blur());
		advanceThroughExit(1000);
		expect(screen.queryByText('Saved')).not.toBeInTheDocument();
	});

	test('should dismiss the oldest toasts beyond three', () => {
		const { getApi } = renderToasts();
		act(() => {
			for (const message of ['One', 'Two', 'Three', 'Four']) {
				getApi().show({ message, duration: 0 });
			}
		});
		advance(TOAST_EXIT_DURATION_MS);

		expect(screen.queryByText('One')).not.toBeInTheDocument();
		expect(screen.getByText('Two')).toBeInTheDocument();
		expect(screen.getByText('Four')).toBeInTheDocument();
	});

	test('should run the action and dismiss the toast when it is clicked', () => {
		const { getApi } = renderToasts();
		const onClick = vi.fn<() => void>();
		act(() => {
			getApi().show({
				message: 'Removed',
				duration: 0,
				action: { label: 'Undo', onClick },
			});
		});

		fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
		advance(TOAST_EXIT_DURATION_MS);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(screen.queryByText('Removed')).not.toBeInTheDocument();
	});

	test('should dismiss the toast from its close button', () => {
		const { getApi } = renderToasts();
		act(() => {
			getApi().show({ message: 'Saved', duration: 0 });
		});

		fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));
		advance(TOAST_EXIT_DURATION_MS);

		expect(screen.queryByText('Saved')).not.toBeInTheDocument();
	});

	test('should announce an error through an alert and the others through a status', () => {
		const { getApi } = renderToasts();
		act(() => {
			getApi().show({ message: 'Failed', tone: 'error', duration: 0 });
			getApi().show({ message: 'Saved', tone: 'success', duration: 0 });
		});

		expect(screen.getByRole('alert')).toHaveTextContent('Failed');
		expect(screen.getByRole('alert')).not.toHaveTextContent('Saved');
		expect(screen.getByRole('status')).toHaveTextContent('Saved');
	});

	test('should render empty live regions inside a labelled region before any toast', () => {
		renderToasts();

		expect(
			screen.getByRole('region', { name: 'Notifications' })
		).toBeInTheDocument();
		expect(screen.getByRole('status')).toBeEmptyDOMElement();
		expect(screen.getByRole('alert')).toBeEmptyDOMElement();
	});

	test('should not move focus when a toast appears', () => {
		const { getApi } = renderToasts();
		const before = document.activeElement;
		act(() => {
			getApi().show({ message: 'Saved' });
		});

		expect(document.activeElement).toBe(before);
	});

	test('should have no accessibility violations', async () => {
		vi.useRealTimers();
		const { getApi } = renderToasts();
		act(() => {
			getApi().show({
				message: 'Saved',
				duration: 0,
				action: { label: 'Undo', onClick: () => undefined },
			});
			getApi().show({ message: 'Failed', tone: 'error', duration: 0 });
		});

		expect(await axe(document.body)).toHaveNoViolations();
	});
});

describe('useToast', () => {
	test('should throw outside a ToastProvider', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		function Orphan() {
			useToast();
			return null;
		}

		expect(() => render(<Orphan />)).toThrow(
			'useToast must be used inside a ToastProvider'
		);
		spy.mockRestore();
	});
});
