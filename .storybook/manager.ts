import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import { getResolvedTheme } from './theme';

addons.setConfig({
	theme: themes[getResolvedTheme()],
});
