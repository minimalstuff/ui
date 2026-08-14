import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from 'vitest';

type MediaQueryMock = {
	matches: boolean;
	addEventListener: ReturnType<typeof vi.fn>;
	removeEventListener: ReturnType<typeof vi.fn>;
};

let useThemeStore: typeof import('./theme_store').useThemeStore;
let mediaQueryMock: MediaQueryMock;

beforeAll(async () => {
	localStorage.setItem('theme', 'dark');

	mediaQueryMock = {
		matches: false,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	};
	vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQueryMock));

	({ useThemeStore } = await import('./theme_store'));
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

		await import('./theme_store');

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

	test('reacts to system preference change only when theme is system', () => {
		useThemeStore.getState().setTheme('system');

		const mediaQueryHandler = mediaQueryMock.addEventListener.mock
			.calls[0][1] as () => void;
		mediaQueryMock.matches = true;
		mediaQueryHandler();

		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});
});
