/// <reference types="vitest/config" />
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react-swc';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

const isLibBuild = process.env.VITE_BUILD_LIB === '1';

export default defineConfig({
	plugins: [
		UnoCSS(),
		react(),
		...(isLibBuild
			? [
					dts({
						tsconfigPath: './tsconfig.app.json',
						rollupTypes: true,
						exclude: ['**/*.stories.tsx'],
					}),
				]
			: []),
	],
	build: {
		copyPublicDir: isLibBuild ? false : true,
		lib: isLibBuild
			? {
					entry: {
						'minimalstuff-ui': path.resolve(dirname, 'src/index.ts'),
						'uno-config': path.resolve(dirname, 'src/uno-config.ts'),
					},
					name: 'MinimalstuffUi',
					formats: ['es'],
				}
			: undefined,
		rollupOptions: {
			external: [
				'react',
				'react-dom',
				'react/jsx-runtime',
				...(isLibBuild
					? [
							'unocss',
							'@unocss/preset-icons',
							'@unocss/preset-web-fonts',
						]
					: []),
			],
			output: isLibBuild
				? {
						entryFileNames: '[name].js',
						assetFileNames: (assetInfo) =>
							/\.css$/i.test(String(assetInfo.name ?? ''))
								? 'minimalstuff-ui.css'
								: '[name][extname]',
					}
				: { globals: {} },
		},
		cssCodeSplit: false,
	},
	test: {
		projects: [
			{
				extends: true,
				plugins: [
					storybookTest({
						configDir: path.join(dirname, '.storybook'),
					}),
				],
				test: {
					name: 'storybook',
					retry: 2,
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({
							launchOptions: {
								args: [
									'--no-sandbox',
									'--disable-setuid-sandbox',
									'--disable-dev-shm-usage',
								],
							},
						}),
						instances: [
							{
								browser: 'chromium',
							},
						],
					},
					setupFiles: ['.storybook/vitest.setup.ts'],
				},
			},
		],
	},
});
