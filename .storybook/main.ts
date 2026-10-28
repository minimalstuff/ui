import type { StorybookConfig } from '@storybook/react-vite';

import { STORYBOOK_CHANNELS, getStorybookChannel } from './channel.ts';

const CHANNEL_LINK_STORIES = {
	[STORYBOOK_CHANNELS.stable]: './channel_links/next_docs.mdx',
	[STORYBOOK_CHANNELS.next]: './channel_links/stable_docs.mdx',
} as const;

function getChannelLinkStories(): string[] {
	const channel = getStorybookChannel();
	return channel ? [CHANNEL_LINK_STORIES[channel]] : [];
}

const config: StorybookConfig = {
	stories: [
		'./changelog.mdx',
		...getChannelLinkStories(),
		'../src/**/*.mdx',
		'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	addons: [
		'@chromatic-com/storybook',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
		'@storybook/addon-onboarding',
	],
	framework: '@storybook/react-vite',
	core: {
		disableTelemetry: true,
	},
};
export default config;
