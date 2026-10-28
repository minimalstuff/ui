import { useEffect } from 'react';

import { resolveChannelUrl } from './resolve_channel_url';

type ChannelRedirectProps = {
	href: string;
	label: string;
};

function isInsidePreviewFrame(): boolean {
	return window.top !== null && window.top !== window;
}

export function ChannelRedirect({
	href,
	label,
}: Readonly<ChannelRedirectProps>) {
	useEffect(() => {
		if (!window.top || !isInsidePreviewFrame()) return;
		window.top.location.assign(
			resolveChannelUrl(href, window.top.location.href)
		);
	}, [href]);

	return (
		<p>
			Redirecting to the {label}.{' '}
			<a href={href} target="_top">
				Open the {label} manually
			</a>
		</p>
	);
}
