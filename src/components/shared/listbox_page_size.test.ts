import { describe, expect, test } from 'vitest';

import { computePageSize } from '#components/shared/listbox_page_size';

describe('computePageSize', () => {
	test('should return the number of whole rows that fit in the viewport', () => {
		expect(computePageSize(240, 36)).toBe(6);
	});

	test('should return 1 when a row is taller than the viewport', () => {
		expect(computePageSize(100, 300)).toBe(1);
	});
});
