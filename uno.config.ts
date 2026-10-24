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

/**
 * Library-namespaced `ms-*` shortcuts hold every base + media-variant
 * combination. A consumer stylesheet loaded after `style.css` never generates
 * `ms-*` classes, so it cannot override the media rule at equal specificity.
 */
const LIBRARY_SHORTCUTS: Record<string, string> = {
	'ms-drawer-width-sm': 'w-full sm:w-[22.5rem]',
	'ms-drawer-width-md': 'w-full sm:w-[26.25rem]',
	'ms-drawer-width-lg': 'w-full sm:w-[32.5rem]',
	'ms-drawer-offscreen-right': 'translate-x-full motion-reduce:translate-x-0',
	'ms-drawer-offscreen-left': '-translate-x-full motion-reduce:translate-x-0',
	'ms-drawer-transition':
		'transition-transform duration-200 ease-out motion-reduce:transition-none',
	'ms-modal-backdrop-padding': 'p-2 sm:py-[3rem] lg:py-[5rem]',
	'ms-modal-height-fixed':
		'h-[calc(100vh-4rem)] sm:h-[min(40rem,calc(100vh-10rem))]',
	'ms-modal-max-height':
		'max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-10rem)]',
};

export default defineConfig({
	shortcuts: LIBRARY_SHORTCUTS,
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
