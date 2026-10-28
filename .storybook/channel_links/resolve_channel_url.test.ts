import { describe, expect, it } from 'vitest';

import { resolveChannelUrl } from './resolve_channel_url';

const STABLE_TO_NEXT_HREF = './next/';
const NEXT_TO_STABLE_HREF = '../';

describe('resolveChannelUrl', () => {
	it('should resolve the next url from the stable manager url', () => {
		expect(
			resolveChannelUrl(STABLE_TO_NEXT_HREF, 'https://example.com/ui/')
		).toBe('https://example.com/ui/next/');
	});

	it('should drop the path query when leaving the stable manager', () => {
		expect(
			resolveChannelUrl(
				STABLE_TO_NEXT_HREF,
				'https://example.com/ui/?path=/docs/next-docs--docs'
			)
		).toBe('https://example.com/ui/next/');
	});

	it('should resolve the stable url from the next manager url', () => {
		expect(
			resolveChannelUrl(NEXT_TO_STABLE_HREF, 'https://example.com/ui/next/')
		).toBe('https://example.com/ui/');
	});

	it('should drop the path query when leaving the next manager', () => {
		expect(
			resolveChannelUrl(
				NEXT_TO_STABLE_HREF,
				'https://example.com/ui/next/?path=/docs/stable-docs--docs'
			)
		).toBe('https://example.com/ui/');
	});
});
