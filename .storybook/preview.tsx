import 'virtual:uno.css';
import './dark_canvas.css';

import type { Preview } from '@storybook/react-vite';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';

import { modalRootDecorator } from './modal_root_decorator';
import { DEFAULT_MOTION_MODE } from './motion';
import { motionDecorator, motionGlobalTypes } from './motion/toolbar';
import { getThemePreference } from './theme';
import { getDocsTheme } from './theme/docs_theme';
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
		options: {
			storySort: {
				order: ['Overview', '*'],
			},
		},
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
			theme: getDocsTheme(),
		},
		viewport: {
			options: MINIMAL_VIEWPORTS,
		},
	},
};

export default preview;
