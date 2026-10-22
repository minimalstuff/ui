import { create, themes } from 'storybook/theming';

import { getResolvedTheme } from './index';

/**
 * The docs page paints its own surface on top of the canvas. In dark mode it
 * reuses the canvas gray-900 from `dark_canvas.css`, so the right padding the
 * page scroll lock adds on `<html>` blends in instead of showing a strip.
 */
const DOCS_THEMES = {
	light: themes.light,
	dark: create({ base: 'dark', appContentBg: 'var(--colors-gray-900)' }),
};

export function getDocsTheme() {
	return DOCS_THEMES[getResolvedTheme()];
}
