import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { applyTheme } from './theme';

describe('applyTheme', () => {
	beforeEach(() => {
		document.documentElement.classList.remove('dark');
	});

	afterEach(() => {
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
});
