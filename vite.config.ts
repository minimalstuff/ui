/// <reference types="vitest/config" />
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { createRequire } from 'node:module';
import path from 'node:path';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const dirname = import.meta.dirname;

const require = createRequire(import.meta.url);

/**
 * unplugin-dts points API Extractor at the folder of the `typescript` package,
 * which is TypeScript 7 here and ships no `lib.*.d.ts` files. This folder is
 * the real TypeScript 6 behind the `@typescript/typescript6` shim.
 */
const TYPESCRIPT_6_COMPILER_FOLDER = path.resolve(
	createRequire(require.resolve('@typescript/typescript6')).resolve(
		'@typescript/old'
	),
	'../..'
);

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
						bundleTypes: {
							invokeOptions: {
								typescriptCompilerFolder: TYPESCRIPT_6_COMPILER_FOLDER,
							},
						},
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
		rolldownOptions: {
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
