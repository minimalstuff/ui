import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

import { STORYBOOK_CHANNELS, getStorybookChannel } from '#storybook/channel';
import { getResolvedTheme } from '#storybook/theme/index';

const NEXT_BRAND_TITLE = '@minimalstuff/ui next';

const baseTheme = themes[getResolvedTheme()];

addons.setConfig({
	theme:
		getStorybookChannel() === STORYBOOK_CHANNELS.next
			? { ...baseTheme, brandTitle: NEXT_BRAND_TITLE }
			: baseTheme,
});
