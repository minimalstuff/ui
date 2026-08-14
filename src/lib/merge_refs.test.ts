import { describe, expect, test } from 'vitest';

import { mergeRefs } from './merge_refs';

describe('mergeRefs', () => {
	test('calls every callback ref with the node', () => {
		const calls: unknown[] = [];
		const merged = mergeRefs<string>(
			(node) => {
				calls.push(['a', node]);
			},
			(node) => {
				calls.push(['b', node]);
			}
		);

		merged('node');

		expect(calls).toEqual([
			['a', 'node'],
			['b', 'node'],
		]);
	});

	test('sets .current on every object ref', () => {
		const first = { current: null as string | null };
		const second = { current: null as string | null };
		const merged = mergeRefs<string>(first, second);

		merged('node');

		expect(first.current).toBe('node');
		expect(second.current).toBe('node');
	});

	test('skips undefined refs', () => {
		const first = { current: null as string | null };
		const merged = mergeRefs<string>(first, undefined);

		expect(() => merged('node')).not.toThrow();
		expect(first.current).toBe('node');
	});
});
