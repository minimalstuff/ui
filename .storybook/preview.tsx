import 'virtual:uno.css';
import './dark_canvas.css';

import { themes } from 'storybook/theming';
import type { Preview } from '@storybook/react-vite';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';

import { DEFAULT_MOTION_MODE } from './motion';
import { modalRootDecorator } from './modal_root_decorator';
import { getResolvedTheme, getThemePreference } from './theme';
import { motionDecorator, motionGlobalTypes } from './motion/toolbar';
import {
	themeClassDecorator,
	themeGlobalTypes,
	themeSyncDecorator,
} from './theme/toolbar';

const preview: Preview = {
	globalTypes: { ...themeGlobalTypes, ...motionGlobalTypes },
	initialGlobals: {
		theme: getThemePreference(),
		motion: DEFAULT_MOTION_MODE,
	},
	decorators: [
		themeClassDecorator,
		themeSyncDecorator,
		motionDecorator,
		modalRootDecorator,
	],
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
