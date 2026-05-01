import presetIcons from '@unocss/preset-icons';
import { defineConfig, presetWind4 } from 'unocss';
import presetWebFonts from '@unocss/preset-web-fonts';

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
});
