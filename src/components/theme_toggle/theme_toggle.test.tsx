import '@testing-library/jest-dom/vitest';

import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { useThemeStore } from '#stores/theme_store/theme_store';
import { ThemeToggle } from './theme_toggle';

const WEBKIT_GTK_USER_AGENT =
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
const CHROME_USER_AGENT =
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

function mockViewTransition() {
	const startViewTransition = vi.fn<
		(callback: () => void) => { ready: Promise<void> }
	>((callback) => {
		callback();
		return { ready: Promise.resolve() };
	});
	Object.defineProperty(document, 'startViewTransition', {
		value: startViewTransition,
		configurable: true,
		writable: true,
	});
	vi.stubGlobal(
		'matchMedia',
		vi.fn(() => ({ matches: false }))
	);
	HTMLElement.prototype.animate = vi.fn<() => Animation>();
	return startViewTransition;
}

describe('ThemeToggle', () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		Reflect.deleteProperty(document, 'startViewTransition');
		useThemeStore.setState({ theme: 'system' });
		localStorage.clear();
	});

	test('exposes the current theme via aria-label', () => {
		render(<ThemeToggle />);
		expect(screen.getByRole('button')).toHaveAttribute(
			'aria-label',
			'Current theme: system'
		);
	});

	test('should show the aria-label in a tooltip on hover when tooltip is true', () => {
		render(<ThemeToggle tooltip />);
		const button = screen.getByRole('button');
		act(() => {
			fireEvent.pointerEnter(button.parentElement as HTMLElement);
		});

		expect(screen.getByRole('tooltip')).toHaveTextContent(
			'Current theme: system'
		);
	});

	test('accepts a custom aria-label', () => {
		render(<ThemeToggle getAriaLabel={(theme) => `Theme: ${theme}`} />);
		expect(screen.getByRole('button')).toHaveAttribute(
			'aria-label',
			'Theme: system'
		);
	});

	test('clicking cycles to the next theme', async () => {
		render(<ThemeToggle />);

		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(useThemeStore.getState().theme).toBe('light');
		});
	});

	test('forwards size to the underlying icon button', () => {
		render(<ThemeToggle size="lg" />);
		expect(screen.getByRole('button')).toHaveClass('p-3');
	});

	test('forwards variant to the underlying icon button', () => {
		render(<ThemeToggle variant="ghost" />);
		expect(screen.getByRole('button')).not.toHaveClass('border-gray-300');
	});

	test('should not start a view transition when the user agent is WebKitGTK and the prop is undefined', async () => {
		vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
			WEBKIT_GTK_USER_AGENT
		);
		const startViewTransition = mockViewTransition();
		render(<ThemeToggle />);

		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(useThemeStore.getState().theme).toBe('light');
		});
		expect(startViewTransition).not.toHaveBeenCalled();
	});

	test('should start a view transition when the user agent is WebKitGTK and the prop is true', async () => {
		vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
			WEBKIT_GTK_USER_AGENT
		);
		const startViewTransition = mockViewTransition();
		render(<ThemeToggle isTransitionEnabled />);

		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(startViewTransition).toHaveBeenCalledOnce();
		});
	});

	test('should start a view transition when the user agent is Chrome and the prop is undefined', async () => {
		vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(CHROME_USER_AGENT);
		const startViewTransition = mockViewTransition();
		render(<ThemeToggle />);

		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(startViewTransition).toHaveBeenCalledOnce();
		});
	});
});
