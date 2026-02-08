import type { Preview } from '@storybook/react-vite';
import { themes } from 'storybook/theming';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';
import 'virtual:uno.css';
import { getResolvedTheme, getThemePreference } from './theme';
import {
	themeClassDecorator,
	themeGlobalTypes,
	themeSyncDecorator,
} from './theme/toolbar';

const preview: Preview = {
	globalTypes: themeGlobalTypes as Preview['globalTypes'],
	initialGlobals: {
		theme: getThemePreference(),
	},
	decorators: [themeClassDecorator, themeSyncDecorator],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: 'todo',
		},
		docs: {
			theme: themes[getResolvedTheme()],
		},
		viewport: {
			options: MINIMAL_VIEWPORTS,
		},
	},
};

export default preview;
