const THEME_STORAGE_KEY = 'sb-theme-preference';

export type ThemePreference = 'light' | 'dark' | 'system';

const VALID_PREFERENCES: ThemePreference[] = ['light', 'dark', 'system'];

export function isThemePreference(value: unknown): value is ThemePreference {
	return VALID_PREFERENCES.some((preference) => preference === value);
}

export function storeThemePreference(preference: ThemePreference): void {
	if (typeof window === 'undefined' || !window.localStorage) return;
	window.localStorage.setItem(THEME_STORAGE_KEY, preference);
}

export function getThemePreference(): ThemePreference {
	if (typeof window === 'undefined' || !window.localStorage) return 'system';
	const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
	if (stored && VALID_PREFERENCES.includes(stored as ThemePreference)) {
		return stored as ThemePreference;
	}
	return 'system';
}

export function getResolvedThemeFromPreference(
	preference: ThemePreference
): 'light' | 'dark' {
	if (preference === 'light') return 'light';
	if (preference === 'dark') return 'dark';
	const prefersDark = globalThis.matchMedia?.(
		'(prefers-color-scheme: dark)'
	)?.matches;
	return prefersDark ? 'dark' : 'light';
}
