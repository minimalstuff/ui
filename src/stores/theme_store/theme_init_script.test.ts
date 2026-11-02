import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { THEME_INIT_SCRIPT } from '#stores/theme_store/theme_init_script';

function stubSystemPrefersDark(prefersDark: boolean) {
	vi.stubGlobal(
		'matchMedia',
		vi.fn().mockReturnValue({ matches: prefersDark })
	);
}

function runScript() {
	// oxlint-disable-next-line no-eval -- the script is a string meant for inline <head> use; evaluating it is the only way to test its behaviour
	globalThis.eval(THEME_INIT_SCRIPT);
}

function isDarkApplied() {
	return document.documentElement.classList.contains('dark');
}

describe('THEME_INIT_SCRIPT', () => {
	beforeEach(() => {
		document.documentElement.classList.remove('dark');
		localStorage.clear();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	test('should apply dark when the stored theme is dark', () => {
		stubSystemPrefersDark(false);
		localStorage.setItem('theme', 'dark');

		runScript();

		expect(isDarkApplied()).toBe(true);
	});

	test('should remove dark when the stored theme is light', () => {
		stubSystemPrefersDark(true);
		document.documentElement.classList.add('dark');
		localStorage.setItem('theme', 'light');

		runScript();

		expect(isDarkApplied()).toBe(false);
	});

	test.each([
		{ prefersDark: true, expected: true },
		{ prefersDark: false, expected: false },
	])(
		'should follow the system preference ($prefersDark) when the stored theme is system',
		({ prefersDark, expected }) => {
			stubSystemPrefersDark(prefersDark);
			localStorage.setItem('theme', 'system');

			runScript();

			expect(isDarkApplied()).toBe(expected);
		}
	);

	test('should follow the system preference when nothing is stored', () => {
		stubSystemPrefersDark(true);

		runScript();

		expect(isDarkApplied()).toBe(true);
	});

	test('should follow the system preference when the stored value is invalid', () => {
		stubSystemPrefersDark(true);
		localStorage.setItem('theme', 'purple');

		runScript();

		expect(isDarkApplied()).toBe(true);
	});

	test('should follow the system preference when localStorage throws', () => {
		stubSystemPrefersDark(true);
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new DOMException('blocked', 'SecurityError');
		});

		runScript();

		expect(isDarkApplied()).toBe(true);
	});
});
