import type { Theme } from '#types/theme';

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
