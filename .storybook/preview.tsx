import 'virtual:uno.css';

import { themes } from 'storybook/theming';
import type { Preview } from '@storybook/react-vite';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';

import { modalRootDecorator } from './modal_root_decorator';
import { getResolvedTheme, getThemePreference } from './theme';
import {
	themeClassDecorator,
	themeGlobalTypes,
	themeSyncDecorator,
} from './theme/toolbar';

const preview: Preview = {
	globalTypes: themeGlobalTypes,
	initialGlobals: {
		theme: getThemePreference(),
	},
	decorators: [themeClassDecorator, themeSyncDecorator, modalRootDecorator],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: 'error',
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
