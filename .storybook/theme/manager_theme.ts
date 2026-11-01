import { themes } from 'storybook/theming';

import { STORYBOOK_CHANNELS, getStorybookChannel } from '#storybook/channel';
import {
	getResolvedThemeFromPreference,
	type ThemePreference,
} from '#storybook/theme/index';

const NEXT_BRAND_TITLE = '@minimalstuff/ui next';

export function getManagerTheme(preference: ThemePreference) {
	const baseTheme = themes[getResolvedThemeFromPreference(preference)];
	if (getStorybookChannel() !== STORYBOOK_CHANNELS.next) return baseTheme;
	return { ...baseTheme, brandTitle: NEXT_BRAND_TITLE };
}
