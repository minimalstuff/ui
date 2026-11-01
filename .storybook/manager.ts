import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { addons } from 'storybook/manager-api';

import {
	getThemePreference,
	isThemePreference,
	storeThemePreference,
} from '#storybook/theme/index';
import { getManagerTheme } from '#storybook/theme/manager_theme';

const THEME_SYNC_ADDON_ID = 'minimalstuff/theme-sync';

type GlobalsUpdatedPayload = { globals: { theme?: unknown } };

addons.setConfig({ theme: getManagerTheme(getThemePreference()) });

addons.register(THEME_SYNC_ADDON_ID, (api) => {
	api.on(GLOBALS_UPDATED, ({ globals }: GlobalsUpdatedPayload) => {
		if (!isThemePreference(globals.theme)) return;
		storeThemePreference(globals.theme);
		api.setOptions({ theme: getManagerTheme(globals.theme) });
	});
});
