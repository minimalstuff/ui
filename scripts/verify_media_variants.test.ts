import { expect, test } from 'vitest';

import { findMediaVariantTokens } from './verify_media_variants.ts';

test('should flag a breakpoint variant', () => {
	expect(findMediaVariantTokens("'p-2 sm:w-[1rem]'")).toEqual(['sm:w-[1rem]']);
});

test('should flag a motion variant', () => {
	expect(findMediaVariantTokens("'motion-reduce:transition-none'")).toEqual([
		'motion-reduce:transition-none',
	]);
});

test('should flag a max breakpoint variant', () => {
	expect(findMediaVariantTokens("'max-sm:hidden'")).toEqual(['max-sm:hidden']);
});

test('should ignore object keys named after a breakpoint', () => {
	expect(findMediaVariantTokens("{ md: 'p-6', lg: 'p-8' }")).toEqual([]);
});

test.each(['hover:bg-red-500', 'dark:bg-black', 'focus-visible:outline-2'])(
	'should ignore the %s pseudo-class and class-based variant',
	(token) => {
		expect(findMediaVariantTokens(`'${token}'`)).toEqual([]);
	}
);

test('should ignore a library shortcut', () => {
	expect(findMediaVariantTokens("'ms-drawer-width-lg'")).toEqual([]);
});
