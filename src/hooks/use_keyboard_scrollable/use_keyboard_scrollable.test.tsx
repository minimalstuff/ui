import '@testing-library/jest-dom/vitest';

import { act, render, screen, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { KEYBOARD_SCROLL_REGION_ATTRIBUTE } from '#components/modal/keyboard_scroll_region_attribute';
import {
	useKeyboardScrollable,
	type UseKeyboardScrollableOptions,
} from '#hooks/use_keyboard_scrollable/use_keyboard_scrollable';

const MOUNT_DELAY_MS = 20;

function stubOverflow(): void {
	vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(500);
	vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100);
}

function SwappableContainer({ isSwapped }: Readonly<{ isSwapped: boolean }>) {
	const { scrollableProps } = useKeyboardScrollable({ label: 'Notes' });

	return isSwapped ? (
		<section data-testid="second" {...scrollableProps}>
			Short
		</section>
	) : (
		<div data-testid="first" {...scrollableProps}>
			Long
		</div>
	);
}

function ScrollContainer({
	options,
	hasButton = false,
	isMountedLate = false,
}: Readonly<{
	options: UseKeyboardScrollableOptions;
	hasButton?: boolean;
	isMountedLate?: boolean;
}>) {
	const { scrollableProps, focusClassName } = useKeyboardScrollable(options);
	const [isShown, setIsShown] = useState(!isMountedLate);

	useEffect(() => {
		if (!isMountedLate) return;
		const timeoutId = setTimeout(() => setIsShown(true), MOUNT_DELAY_MS);
		return () => clearTimeout(timeoutId);
	}, [isMountedLate]);

	if (!isShown) return <p>Loading</p>;

	return (
		<div
			data-testid="container"
			{...scrollableProps}
			className={focusClassName}
		>
			{hasButton ? <button type="button">Action</button> : 'Long text'}
		</div>
	);
}

describe('useKeyboardScrollable', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test('should not make the container focusable when it does not overflow', () => {
		render(<ScrollContainer options={{ label: 'Notes' }} />);

		const container = screen.getByTestId('container');
		expect(container).not.toHaveAttribute('tabindex');
		expect(container).not.toHaveAttribute('role');
	});

	test('should make the container a named region when it overflows and has no tabbable child', async () => {
		stubOverflow();
		render(<ScrollContainer options={{ label: 'Notes' }} />);

		const region = await screen.findByRole('region', { name: 'Notes' });
		expect(region).toHaveAttribute('tabindex', '0');
		expect(region).toHaveAttribute('data-keyboard-scroll-region', 'true');
	});

	test('should name the region from the labelledBy element when labelledBy is given', async () => {
		stubOverflow();
		render(
			<>
				<h2 id="notes-title">Release notes</h2>
				<ScrollContainer options={{ labelledBy: 'notes-title' }} />
			</>
		);

		expect(
			await screen.findByRole('region', { name: 'Release notes' })
		).toBeInTheDocument();
	});

	test('should not add a tab stop when the overflowing container holds a button', () => {
		stubOverflow();
		render(<ScrollContainer options={{ label: 'Notes' }} hasButton />);

		expect(screen.getByTestId('container')).not.toHaveAttribute('tabindex');
	});

	test('should evaluate a container that is mounted after the first render', async () => {
		stubOverflow();
		render(<ScrollContainer options={{ label: 'Notes' }} isMountedLate />);

		await waitFor(() => {
			expect(screen.getByRole('region', { name: 'Notes' })).toHaveAttribute(
				'tabindex',
				'0'
			);
		});
	});

	test('should expose the attribute named by the internal constant when scrollable', async () => {
		stubOverflow();
		render(<ScrollContainer options={{ label: 'Notes' }} />);

		const region = await screen.findByRole('region', { name: 'Notes' });
		expect(KEYBOARD_SCROLL_REGION_ATTRIBUTE).toBe(
			'data-keyboard-scroll-region'
		);
		expect(region).toHaveAttribute(KEYBOARD_SCROLL_REGION_ATTRIBUTE, 'true');
	});

	test('should not give a tab stop to a non-scrollable container that replaces a scrollable one', async () => {
		stubOverflow();
		const { rerender } = render(<SwappableContainer isSwapped={false} />);
		await screen.findByRole('region', { name: 'Notes' });
		vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(100);

		rerender(<SwappableContainer isSwapped />);

		await waitFor(() => {
			expect(screen.getByTestId('second')).not.toHaveAttribute('tabindex');
		});
	});

	test('should become a tab stop when the last tabbable child gets disabled', async () => {
		stubOverflow();
		render(<ScrollContainer options={{ label: 'Notes' }} hasButton />);
		expect(screen.getByTestId('container')).not.toHaveAttribute('tabindex');

		screen.getByRole('button', { name: 'Action' }).setAttribute('disabled', '');

		expect(
			await screen.findByRole('region', { name: 'Notes' })
		).toHaveAttribute('tabindex', '0');
	});

	test('should re-evaluate when a child is resized without any DOM change', async () => {
		const resizeCallbacks: ResizeObserverCallback[] = [];
		vi.stubGlobal(
			'ResizeObserver',
			class {
				constructor(callback: ResizeObserverCallback) {
					resizeCallbacks.push(callback);
				}
				observe = vi.fn<() => void>();
				disconnect = vi.fn<() => void>();
			}
		);
		render(<ScrollContainer options={{ label: 'Notes' }} />);
		expect(screen.getByTestId('container')).not.toHaveAttribute('tabindex');

		stubOverflow();
		act(() => {
			for (const callback of resizeCallbacks)
				callback([], {} as ResizeObserver);
		});

		expect(
			await screen.findByRole('region', { name: 'Notes' })
		).toHaveAttribute('tabindex', '0');
		vi.unstubAllGlobals();
	});

	test('should warn when the region has an empty name', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(<ScrollContainer options={{ label: '  ' }} />);

		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('useKeyboardScrollable')
		);
	});
});
