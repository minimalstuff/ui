export const STORYBOOK_CHANNELS = {
	stable: 'stable',
	next: 'next',
} as const;

export type StorybookChannel =
	(typeof STORYBOOK_CHANNELS)[keyof typeof STORYBOOK_CHANNELS];

declare const process: { env: { STORYBOOK_CHANNEL?: string } };

export function getStorybookChannel(): StorybookChannel | undefined {
	const channel = process.env.STORYBOOK_CHANNEL;
	if (channel === STORYBOOK_CHANNELS.stable) return STORYBOOK_CHANNELS.stable;
	if (channel === STORYBOOK_CHANNELS.next) return STORYBOOK_CHANNELS.next;
	return undefined;
}
