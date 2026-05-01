import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
	applyTheme,
	followThemeState,
	getCurrentTheme,
	setCurrentTheme,
} from './theme';

describe('applyTheme', () => {
	beforeEach(() => {
		document.documentElement.classList.remove('dark');
	});

	afterEach(() => {
		localStorage.clear();
		vi.restoreAllMocks();
	});

	test('adds dark class when theme is dark', () => {
		applyTheme('dark');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	test('removes dark class when theme is light', () => {
		document.documentElement.classList.add('dark');
		applyTheme('light');
		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});

	test('adds dark class when theme is system and prefers dark', () => {
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
		applyTheme('system');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	test('removes dark class when theme is system and prefers light', () => {
		document.documentElement.classList.add('dark');
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
		applyTheme('system');
		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});

	test('returns system when stored theme is invalid', () => {
		localStorage.setItem('theme', 'invalid');
		expect(getCurrentTheme()).toBe('system');
	});

	test('returns stored theme when valid', () => {
		localStorage.setItem('theme', 'dark');
		expect(getCurrentTheme()).toBe('dark');
	});

	test('setCurrentTheme persists and notifies listeners', () => {
		const listener = vi.fn();
		const unsubscribe = followThemeState(listener);

		setCurrentTheme('dark');

		expect(getCurrentTheme()).toBe('dark');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
		expect(listener).toHaveBeenCalledWith('dark');

		unsubscribe();
	});

	test('followThemeState reacts to system preference change when theme is system', () => {
		const mediaQuery = {
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};

		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQuery));
		setCurrentTheme('system');

		const listener = vi.fn();
		const unsubscribe = followThemeState(listener);

		const mediaQueryHandler = mediaQuery.addEventListener.mock
			.calls[0][1] as () => void;
		mediaQuery.matches = true;
		mediaQueryHandler();

		expect(listener).toHaveBeenCalledWith('system');
		expect(document.documentElement.classList.contains('dark')).toBe(true);

		unsubscribe();
	});
});
