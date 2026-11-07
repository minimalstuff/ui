/// <reference types="vitest/config" />
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { movePointerOutOfStory } from './scripts/move_pointer_out_of_story.ts';

const dirname = import.meta.dirname;

const isLibBuild = process.env.VITE_BUILD_LIB === '1';

const packageManifest = JSON.parse(
	readFileSync(path.resolve(dirname, 'package.json'), 'utf8')
) as {
	dependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
};

const EXTERNAL_PACKAGE_NAMES = [
	...Object.keys(packageManifest.dependencies ?? {}),
	...Object.keys(packageManifest.peerDependencies ?? {}),
];

function isExternalModule(moduleId: string) {
	return EXTERNAL_PACKAGE_NAMES.some(
		(packageName) =>
			moduleId === packageName || moduleId.startsWith(`${packageName}/`)
	);
}

/** Stories share a few cores with other browsers; the first story of a file also pays the module loading cost. */
const STORYBOOK_TEST_TIMEOUT_MS = 30_000;

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
		rolldownOptions: {
			external: isExternalModule,
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
					retry: 0,
					testTimeout: STORYBOOK_TEST_TIMEOUT_MS,
					setupFiles: [path.join(dirname, '.storybook/vitest.setup.ts')],
					browser: {
						enabled: true,
						headless: true,
						commands: { movePointerOutOfStory },
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
