import { create } from 'zustand';

import type { Theme } from '#types/theme';

const THEME_STORAGE_KEY = 'theme';

function isTheme(value: string | null): value is Theme {
	return value === 'light' || value === 'dark' || value === 'system';
}

function isBrowserEnvironment() {
	return (
		typeof globalThis.window !== 'undefined' &&
		typeof globalThis.document !== 'undefined'
	);
}

function applyThemeToDocument(theme: Theme) {
	const systemPrefersDark = window.matchMedia(
		'(prefers-color-scheme: dark)'
	).matches;
	const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);
	document.documentElement.classList.toggle('dark', isDark);
}

function readStoredTheme(): Theme {
	if (!isBrowserEnvironment()) return 'system';
	const storedTheme = globalThis.localStorage.getItem(THEME_STORAGE_KEY);
	return isTheme(storedTheme) ? storedTheme : 'system';
}

interface ThemeStore {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const initialTheme = readStoredTheme();

// Applied once here, at module load, rather than from a component's mount
// effect: a `useEffect` only runs after first paint, which can flash the
// wrong theme. This runs as the script evaluates, before React ever mounts.
if (isBrowserEnvironment()) {
	applyThemeToDocument(initialTheme);
}

export const useThemeStore = create<ThemeStore>((set) => ({
	theme: initialTheme,
	setTheme: (theme) => {
		applyThemeToDocument(theme);

		if (isBrowserEnvironment()) {
			globalThis.localStorage.setItem(THEME_STORAGE_KEY, theme);
		}

		set({ theme });
	},
}));

if (isBrowserEnvironment()) {
	globalThis.addEventListener('storage', (event) => {
		if (event.key !== THEME_STORAGE_KEY) return;

		const nextTheme = isTheme(event.newValue) ? event.newValue : 'system';
		applyThemeToDocument(nextTheme);
		useThemeStore.setState({ theme: nextTheme });
	});

	globalThis
		.matchMedia('(prefers-color-scheme: dark)')
		.addEventListener('change', () => {
			if (useThemeStore.getState().theme !== 'system') return;
			applyThemeToDocument('system');
		});
}
