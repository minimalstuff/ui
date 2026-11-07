import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from 'vitest';

import type * as ThemeStoreModule from '#stores/theme_store/theme_store';

type MediaQueryMock = {
	matches: boolean;
	addEventListener: ReturnType<typeof vi.fn>;
	removeEventListener: ReturnType<typeof vi.fn>;
};

let useThemeStore: typeof ThemeStoreModule.useThemeStore;
let mediaQueryMock: MediaQueryMock;
let systemThemeChangeHandler: () => void;

beforeAll(async () => {
	localStorage.setItem('theme', 'dark');

	mediaQueryMock = {
		matches: false,
		addEventListener: vi.fn<() => void>(),
		removeEventListener: vi.fn<() => void>(),
	};
	vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQueryMock));

	({ useThemeStore } = await import('#stores/theme_store/theme_store'));

	systemThemeChangeHandler = mediaQueryMock.addEventListener.mock
		.calls[0][1] as () => void;
});

describe('useThemeStore', () => {
	beforeEach(() => {
		document.documentElement.classList.remove('dark');
	});

	afterEach(() => {
		localStorage.clear();
	});

	test('initializes from stored theme', () => {
		expect(useThemeStore.getState().theme).toBe('dark');
	});

	test('applies the stored theme to the document as soon as the module loads, before any setTheme call', async () => {
		localStorage.setItem('theme', 'dark');
		vi.resetModules();

		await import('#stores/theme_store/theme_store');

		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	test('setTheme adds dark class and persists for dark theme', () => {
		useThemeStore.getState().setTheme('dark');

		expect(document.documentElement.classList.contains('dark')).toBe(true);
		expect(localStorage.getItem('theme')).toBe('dark');
		expect(useThemeStore.getState().theme).toBe('dark');
	});

	test('setTheme removes dark class for light theme', () => {
		document.documentElement.classList.add('dark');
		useThemeStore.getState().setTheme('light');

		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});

	test('setTheme applies system preference for system theme', () => {
		mediaQueryMock.matches = true;
		useThemeStore.getState().setTheme('system');

		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	test('reacts to storage events from other tabs', () => {
		const storageEvent = new StorageEvent('storage', {
			key: 'theme',
			newValue: 'dark',
		});
		globalThis.dispatchEvent(storageEvent);

		expect(useThemeStore.getState().theme).toBe('dark');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	test('falls back to system theme for invalid storage values', () => {
		document.documentElement.classList.add('dark');
		mediaQueryMock.matches = false;

		const storageEvent = new StorageEvent('storage', {
			key: 'theme',
			newValue: 'not-a-theme',
		});
		globalThis.dispatchEvent(storageEvent);

		expect(useThemeStore.getState().theme).toBe('system');
		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});

	test('ignores storage events for unrelated keys', () => {
		useThemeStore.getState().setTheme('light');

		const storageEvent = new StorageEvent('storage', {
			key: 'unrelated',
			newValue: 'dark',
		});
		globalThis.dispatchEvent(storageEvent);

		expect(useThemeStore.getState().theme).toBe('light');
	});

	test('applies dark class on system preference change when theme is system', () => {
		useThemeStore.getState().setTheme('system');

		mediaQueryMock.matches = true;
		systemThemeChangeHandler();

		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	test('ignores system preference change when theme is not system', () => {
		useThemeStore.getState().setTheme('light');

		mediaQueryMock.matches = true;
		systemThemeChangeHandler();

		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});

	describe('theme-color meta', () => {
		const LIGHT_COLOR = '#ffffff';
		const DARK_COLOR = '#0b0b0b';
		let meta: HTMLMetaElement;

		beforeEach(() => {
			meta = document.createElement('meta');
			meta.setAttribute('name', 'theme-color');
			meta.setAttribute('content', LIGHT_COLOR);
			meta.setAttribute('data-light', LIGHT_COLOR);
			meta.setAttribute('data-dark', DARK_COLOR);
			document.head.append(meta);
		});

		afterEach(() => {
			meta.remove();
		});

		test('should set the meta to the dark color when setTheme is called with dark', () => {
			useThemeStore.getState().setTheme('dark');

			expect(meta.getAttribute('content')).toBe(DARK_COLOR);
		});

		test('should set the meta to the light color when setTheme is called with light', () => {
			meta.setAttribute('content', DARK_COLOR);

			useThemeStore.getState().setTheme('light');

			expect(meta.getAttribute('content')).toBe(LIGHT_COLOR);
		});

		test('should update the meta when a storage event announces another theme', () => {
			globalThis.dispatchEvent(
				new StorageEvent('storage', { key: 'theme', newValue: 'dark' })
			);

			expect(meta.getAttribute('content')).toBe(DARK_COLOR);
		});

		test('should update the meta when the OS preference changes while the theme is system', () => {
			useThemeStore.getState().setTheme('system');

			mediaQueryMock.matches = true;
			systemThemeChangeHandler();

			expect(meta.getAttribute('content')).toBe(DARK_COLOR);
		});

		test('should leave a meta without data attributes untouched when the theme changes', () => {
			meta.removeAttribute('data-dark');
			meta.setAttribute('content', '#123456');

			useThemeStore.getState().setTheme('dark');

			expect(meta.getAttribute('content')).toBe('#123456');
		});

		test('should set the meta as soon as the module loads', async () => {
			localStorage.setItem('theme', 'dark');
			vi.resetModules();

			await import('#stores/theme_store/theme_store');

			expect(meta.getAttribute('content')).toBe(DARK_COLOR);
		});
	});
});
