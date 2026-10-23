import presetIcons from '@unocss/preset-icons';
import presetWebFonts from '@unocss/preset-web-fonts';
import { defineConfig, presetWind4, type Variant } from 'unocss';

const isLibraryBuild = process.env.VITE_BUILD_LIB === '1';
const EAGERLY_SCANNED_SOURCES = [
	'src/**/*.{ts,tsx}',
	'.storybook/**/*.{ts,tsx}',
];

const INTERACTIVE_VARIANT_PREFIX = 'interactive:';

/**
 * `interactive:` applies a utility only while the element is neither natively
 * disabled nor `aria-disabled="true"` (e.g. a loading button that stays focusable).
 */
const interactiveVariant: Variant = (matcher) => {
	if (!matcher.startsWith(INTERACTIVE_VARIANT_PREFIX)) return matcher;
	return {
		matcher: matcher.slice(INTERACTIVE_VARIANT_PREFIX.length),
		selector: (selector) => `${selector}:enabled:not([aria-disabled="true"])`,
	};
};

export default defineConfig({
	variants: [interactiveVariant],
	presets: [
		presetWind4({
			dark: 'class',
		}),
		presetIcons({
			cdn: 'https://esm.sh/',
		}),
		presetWebFonts({
			provider: 'bunny',
		}),
	],
	content: {
		filesystem: isLibraryBuild ? [] : EAGERLY_SCANNED_SOURCES,
		pipeline: {
			include: [
				/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|marko|html)($|\?)/,
				'src/**/*.{ts,tsx}',
			],
		},
	},
});
