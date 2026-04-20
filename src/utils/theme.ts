import type { Theme } from '#types/theme';

const THEME_STORAGE_KEY = 'theme';

type ThemeListener = (theme: Theme) => void;

const themeListeners = new Set<ThemeListener>();

let detachGlobalThemeListeners: (() => void) | null = null;

function isTheme(value: string | null): value is Theme {
	return value === 'light' || value === 'dark' || value === 'system';
}

function isBrowserEnvironment() {
	return typeof globalThis.window !== 'undefined' && typeof globalThis.document !== 'undefined';
}

function notifyThemeListeners(theme: Theme) {
	for (const listener of themeListeners) {
		listener(theme);
	}
}

function setupGlobalThemeListeners() {
	if (!isBrowserEnvironment() || detachGlobalThemeListeners) {
		return;
	}

	const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');

	const handleStorageChange = (event: StorageEvent) => {
		if (event.key !== THEME_STORAGE_KEY) {
			return;
		}

		const nextTheme = isTheme(event.newValue) ? event.newValue : 'system';
		applyTheme(nextTheme);
		notifyThemeListeners(nextTheme);
	};

	const handleSystemThemeChange = () => {
		if (getCurrentTheme() !== 'system') {
			return;
		}

		applyTheme('system');
		notifyThemeListeners('system');
	};

	const canUseEventListener =
		typeof mediaQuery.addEventListener === 'function' &&
		typeof mediaQuery.removeEventListener === 'function';

	globalThis.addEventListener('storage', handleStorageChange);

	if (canUseEventListener) {
		mediaQuery.addEventListener('change', handleSystemThemeChange);
	}

	detachGlobalThemeListeners = () => {
		globalThis.removeEventListener('storage', handleStorageChange);

		if (canUseEventListener) {
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
		}

		detachGlobalThemeListeners = null;
	};
}

function teardownGlobalThemeListenersIfUnused() {
	if (themeListeners.size === 0 && detachGlobalThemeListeners) {
		detachGlobalThemeListeners();
	}
}

export function applyTheme(newTheme: Theme) {
	const root = document.documentElement;

	if (newTheme === 'system') {
		const systemPrefersDark = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches;
		if (systemPrefersDark) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	} else if (newTheme === 'dark') {
		root.classList.add('dark');
	} else {
		root.classList.remove('dark');
	}
}

export function getCurrentTheme(): Theme {
	if (!isBrowserEnvironment()) {
		return 'system';
	}

	const storedTheme = globalThis.localStorage.getItem(THEME_STORAGE_KEY);
	return isTheme(storedTheme) ? storedTheme : 'system';
}

export function setCurrentTheme(theme: Theme) {
	if (!isBrowserEnvironment()) {
		return;
	}

	applyTheme(theme);
	globalThis.localStorage.setItem(THEME_STORAGE_KEY, theme);
	notifyThemeListeners(theme);
}

export function followThemeState(listener: ThemeListener) {
	themeListeners.add(listener);
	setupGlobalThemeListeners();

	return () => {
		themeListeners.delete(listener);
		teardownGlobalThemeListenersIfUnused();
	};
}
