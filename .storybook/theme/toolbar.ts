import type React from 'react';

import {
	getResolvedThemeFromPreference,
	getThemePreference,
	type ThemePreference,
} from '#storybook/theme/index';

const THEME_TOOLBAR_ITEMS: { value: ThemePreference; title: string }[] = [
	{ value: 'light', title: 'Light' },
	{ value: 'dark', title: 'Dark' },
	{ value: 'system', title: 'System' },
];

export const themeGlobalTypes = {
	theme: {
		name: 'Theme',
		description: 'Storybook theme',
		toolbar: {
			title: 'Theme',
			icon: 'paintbrush' as const,
			items: THEME_TOOLBAR_ITEMS,
			dynamicTitle: true,
		},
	},
};

function applyThemeClass(preference: ThemePreference): void {
	if (typeof document === 'undefined') return;
	const resolved = getResolvedThemeFromPreference(preference);
	document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function themeClassDecorator(
	Story: () => React.ReactElement,
	context: { globals: { theme?: ThemePreference } }
): React.ReactElement {
	const preference = context.globals.theme ?? getThemePreference();
	applyThemeClass(preference);
	return Story();
}
