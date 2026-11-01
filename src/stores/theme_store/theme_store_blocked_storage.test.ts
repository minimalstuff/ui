import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

function stubMatchMedia() {
	vi.stubGlobal(
		'matchMedia',
		vi.fn().mockReturnValue({
			matches: false,
			addEventListener: vi.fn<() => void>(),
			removeEventListener: vi.fn<() => void>(),
		})
	);
}

describe('useThemeStore with blocked storage', () => {
	beforeEach(() => {
		vi.resetModules();
		document.documentElement.classList.remove('dark');
		stubMatchMedia();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	test('should fall back to system theme when localStorage access throws at load', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new DOMException('blocked', 'SecurityError');
		});

		const { useThemeStore } = await import('./theme_store');

		expect(useThemeStore.getState().theme).toBe('system');
	});

	test('should apply and set the theme when localStorage write throws', async () => {
		const { useThemeStore } = await import('./theme_store');
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new DOMException('quota', 'QuotaExceededError');
		});

		useThemeStore.getState().setTheme('dark');

		expect(useThemeStore.getState().theme).toBe('dark');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});
});
