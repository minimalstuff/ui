import { minimalstuffPreset } from '@minimalstuff/tooling/knip';

export default minimalstuffPreset({
	entry: ['src/index.ts', '.storybook/channel_links/*.mdx'],
	project: [
		'src/**/*.{ts,tsx}',
		'.storybook/**/*.{ts,tsx,mdx}',
		'scripts/**/*.ts',
	],
	ignoreDependencies: ['@typescript/typescript6'],
});
