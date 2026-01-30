export const THEME_STORAGE_KEY = 'sb-theme-preference';

export type ThemePreference = 'light' | 'dark' | 'system';

const VALID_PREFERENCES: ThemePreference[] = ['light', 'dark', 'system'];

export function getThemePreference(): ThemePreference {
	if (typeof window === 'undefined' || !window.localStorage) return 'system';
	const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
	if (stored && VALID_PREFERENCES.includes(stored as ThemePreference)) {
		return stored as ThemePreference;
	}
	return 'system';
}

export function getResolvedTheme(): 'light' | 'dark' {
	return getResolvedThemeFromPreference(getThemePreference());
}

export function getResolvedThemeFromPreference(
	preference: ThemePreference
): 'light' | 'dark' {
	if (preference === 'light') return 'light';
	if (preference === 'dark') return 'dark';
	if (typeof window !== 'undefined' && window.matchMedia) {
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	}
	return 'light';
}
