import React from 'react';
import { addons, types } from 'storybook/manager-api';

import {
	STORYBOOK_CHANNELS,
	getStorybookChannel,
	type StorybookChannel,
} from '../../channel.ts';

type ChannelLink = { label: string; href: string };

const CHANNEL_LINKS: Record<StorybookChannel, ChannelLink> = {
	[STORYBOOK_CHANNELS.stable]: { label: 'Next docs', href: './next/' },
	[STORYBOOK_CHANNELS.next]: { label: 'Stable docs', href: '../' },
};

const LINK_STYLE: React.CSSProperties = {
	padding: '4px 8px',
	fontSize: 12,
	color: 'var(--sb-manager-text-color, #333)',
	textDecoration: 'underline',
};

function ChannelTool() {
	const channel = getStorybookChannel();
	if (!channel) return null;
	const { label, href } = CHANNEL_LINKS[channel];
	return React.createElement('a', { href, style: LINK_STYLE }, label);
}

addons.register('minimalstuff-ui/channel', () => {
	addons.add('minimalstuff-ui/channel/toolbar', {
		id: 'minimalstuff-ui/channel-toolbar',
		title: 'Documentation channel',
		type: types.TOOL,
		render: () => React.createElement(ChannelTool),
	});
});
