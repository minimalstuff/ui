import presetIcons from '@unocss/preset-icons';
import { defineConfig, presetWind4 } from 'unocss';
import presetWebFonts from '@unocss/preset-web-fonts';

const isLibraryBuild = process.env.VITE_BUILD_LIB === '1';
const EAGERLY_SCANNED_SOURCES = [
	'src/**/*.{ts,tsx}',
	'.storybook/**/*.{ts,tsx}',
];

export default defineConfig({
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
