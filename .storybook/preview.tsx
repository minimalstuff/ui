import 'virtual:uno.css';
import '#storybook/dark_canvas.css';

import type { Preview } from '@storybook/react-vite';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';

import { modalRootDecorator } from '#storybook/modal_root_decorator';
import { DEFAULT_MOTION_MODE } from '#storybook/motion/index';
import { motionDecorator, motionGlobalTypes } from '#storybook/motion/toolbar';
import { getThemePreference } from '#storybook/theme/index';
import { ThemedDocsContainer } from '#storybook/theme/themed_docs_container';
import {
	themeClassDecorator,
	themeGlobalTypes,
} from '#storybook/theme/toolbar';

const preview: Preview = {
	globalTypes: { ...themeGlobalTypes, ...motionGlobalTypes },
	initialGlobals: {
		theme: getThemePreference(),
		motion: DEFAULT_MOTION_MODE,
	},
	decorators: [themeClassDecorator, motionDecorator, modalRootDecorator],
	parameters: {
		options: {
			storySort: {
				order: ['Overview', 'Changelog', 'Next docs', 'Stable docs', '*'],
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
			container: ThemedDocsContainer,
		},
		viewport: {
			options: MINIMAL_VIEWPORTS,
		},
	},
};

export default preview;
