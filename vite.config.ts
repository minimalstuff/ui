import path from 'node:path';
import UnoCSS from 'unocss/vite';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
/// <reference types="vitest/config" />
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = import.meta.dirname;

const isLibBuild = process.env.VITE_BUILD_LIB === '1';

const STORYBOOK_BROWSER_LAUNCH_OPTIONS = {
	args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
};

export default defineConfig({
	plugins: [
		UnoCSS(),
		react(),
		...(isLibBuild
			? [
					dts({
						tsconfigPath: './tsconfig.app.json',
						bundleTypes: true,
						exclude: ['**/*.stories.tsx'],
					}),
				]
			: []),
	],
	build: {
		copyPublicDir: isLibBuild ? false : true,
		lib: {
			entry: path.resolve(dirname, 'src/index.ts'),
			name: 'MinimalstuffUi',
			formats: ['es'],
			fileName: 'minimalstuff-ui',
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime'],
			output: {
				globals: {},
			},
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
					setupFiles: [path.join(dirname, '.storybook/vitest.setup.ts')],
					browser: {
						enabled: true,
						headless: true,
						instances: [
							{
								browser: 'chromium',
								name: 'light',
								provider: playwright({
									launchOptions: STORYBOOK_BROWSER_LAUNCH_OPTIONS,
									contextOptions: {
										colorScheme: 'light',
										reducedMotion: 'reduce',
									},
								}),
							},
							{
								browser: 'chromium',
								name: 'dark',
								provider: playwright({
									launchOptions: STORYBOOK_BROWSER_LAUNCH_OPTIONS,
									contextOptions: {
										colorScheme: 'dark',
										reducedMotion: 'reduce',
									},
								}),
							},
						],
					},
				},
			},
		],
	},
});
