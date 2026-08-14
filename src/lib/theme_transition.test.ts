import { afterEach, describe, expect, test, vi } from 'vitest';

import { getNextTheme, switchTheme } from './theme_transition';

describe('getNextTheme', () => {
	test('cycles light to dark', () => {
		expect(getNextTheme('light')).toBe('dark');
	});

	test('cycles dark to system', () => {
		expect(getNextTheme('dark')).toBe('system');
	});

	test('cycles system to light', () => {
		expect(getNextTheme('system')).toBe('light');
	});
});

describe('switchTheme', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		// @ts-expect-error test-only cleanup of a browser API happy-dom doesn't implement
		delete document.startViewTransition;
	});

	test('applies the theme directly when the browser has no View Transitions support', async () => {
		const applyThemeCallback = vi.fn();
		const element = document.createElement('button');

		await switchTheme({ theme: 'dark', element, applyThemeCallback });

		expect(applyThemeCallback).toHaveBeenCalledWith('dark');
	});

	test('applies the theme directly when the user prefers reduced motion', async () => {
		const startViewTransition = vi.fn();
		document.startViewTransition = startViewTransition;
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
		const applyThemeCallback = vi.fn();
		const element = document.createElement('button');

		await switchTheme({ theme: 'dark', element, applyThemeCallback });

		expect(applyThemeCallback).toHaveBeenCalledWith('dark');
		expect(startViewTransition).not.toHaveBeenCalled();
	});

	test('animates a clip-path circle from the trigger element when transitions are supported', async () => {
		const applyThemeCallback = vi.fn();
		const animate = vi.fn();
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
		document.startViewTransition = vi.fn((callback: () => void) => {
			callback();
			return { ready: Promise.resolve() };
		}) as unknown as typeof document.startViewTransition;
		document.documentElement.animate = animate;

		const element = document.createElement('button');
		vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 20,
			width: 30,
			height: 40,
			right: 50,
			bottom: 50,
			x: 20,
			y: 10,
			toJSON: () => ({}),
		});

		await switchTheme({ theme: 'dark', element, applyThemeCallback });

		expect(applyThemeCallback).toHaveBeenCalledWith('dark');
		expect(animate).toHaveBeenCalledWith(
			expect.objectContaining({
				clipPath: expect.arrayContaining([
					expect.stringContaining('circle(0px at 35px 30px)'),
				]),
			}),
			expect.objectContaining({
				pseudoElement: '::view-transition-new(root)',
			})
		);
	});
});
