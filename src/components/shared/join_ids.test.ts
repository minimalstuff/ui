import { describe, expect, test } from 'vitest';

import { joinIds } from './join_ids';

describe('joinIds', () => {
	test('joins truthy ids with a space, dropping falsy ones', () => {
		expect(joinIds('hint', false, 'error', null, undefined)).toBe('hint error');
	});

	test('returns undefined when every id is falsy', () => {
		expect(joinIds(false, null, undefined)).toBeUndefined();
	});

	test('keeps the given order', () => {
		expect(joinIds('c', 'a', 'b')).toBe('c a b');
	});
});
