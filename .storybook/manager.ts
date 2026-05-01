import { themes } from 'storybook/theming';
import { addons } from 'storybook/manager-api';

import { getResolvedTheme } from './theme';

addons.setConfig({
	theme: themes[getResolvedTheme()],
});
