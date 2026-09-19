import { describe, expect, test } from 'vitest';

import { findTypeaheadIndex } from './find_typeahead_index';

describe('findTypeaheadIndex', () => {
	test('finds the next label starting with the character', () => {
		const labels = ['Move up', 'Move down', 'Delete'];
		expect(findTypeaheadIndex(labels, 0, 'd')).toBe(2);
	});

	test('wraps around to labels before the current index', () => {
		const labels = ['Delete', 'Move up', 'Move down'];
		expect(findTypeaheadIndex(labels, 1, 'd')).toBe(0);
	});

	test('matches case-insensitively', () => {
		const labels = ['Move up', 'Delete'];
		expect(findTypeaheadIndex(labels, 0, 'D')).toBe(1);
	});

	test('returns -1 when nothing matches', () => {
		const labels = ['Move up', 'Move down'];
		expect(findTypeaheadIndex(labels, 0, 'z')).toBe(-1);
	});

	test('returns -1 for an empty label list', () => {
		expect(findTypeaheadIndex([], 0, 'd')).toBe(-1);
	});
});
