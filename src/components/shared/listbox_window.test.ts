import { describe, expect, test } from 'vitest';

import {
	computeListboxWindow,
	computeNearestScrollTop,
	getMountedIndices,
	INITIAL_WINDOW_SIZE,
	isWindowedListbox,
	VIRTUALIZATION_THRESHOLD,
} from '#components/shared/listbox_window';

const ROW_HEIGHT = 40;
const VIEWPORT_HEIGHT = 240;
const OVERSCAN = 5;
const OPTION_COUNT = 3000;

function computeWindow(
	overrides: Partial<Parameters<typeof computeListboxWindow>[0]>
) {
	return computeListboxWindow({
		scrollTop: 0,
		viewportHeight: VIEWPORT_HEIGHT,
		rowHeight: ROW_HEIGHT,
		optionCount: OPTION_COUNT,
		overscan: OVERSCAN,
		...overrides,
	});
}

describe('isWindowedListbox', () => {
	test('should be false at the threshold', () => {
		expect(isWindowedListbox(VIRTUALIZATION_THRESHOLD)).toBe(false);
	});

	test('should be true above the threshold', () => {
		expect(isWindowedListbox(VIRTUALIZATION_THRESHOLD + 1)).toBe(true);
	});
});

describe('computeListboxWindow', () => {
	test('should return an empty window when there are no options', () => {
		expect(computeWindow({ optionCount: 0 })).toEqual({
			startIndex: 0,
			endIndex: 0,
		});
	});

	test('should start at zero with overscan after the viewport when at the top', () => {
		expect(computeWindow({})).toEqual({
			startIndex: 0,
			endIndex: 6 + OVERSCAN,
		});
	});

	test('should add overscan on both sides when in the middle', () => {
		expect(computeWindow({ scrollTop: 4000 })).toEqual({
			startIndex: 100 - OVERSCAN,
			endIndex: 106 + OVERSCAN,
		});
	});

	test('should end at the option count when at the bottom', () => {
		const scrollTop = OPTION_COUNT * ROW_HEIGHT - VIEWPORT_HEIGHT;

		expect(computeWindow({ scrollTop }).endIndex).toBe(OPTION_COUNT);
	});

	test('should keep one row when the scroll position is past the content', () => {
		expect(computeWindow({ scrollTop: 10_000_000 })).toEqual({
			startIndex: OPTION_COUNT - 1,
			endIndex: OPTION_COUNT,
		});
	});

	test('should cover every option when the viewport is larger than the content', () => {
		expect(computeWindow({ optionCount: 4, viewportHeight: 1000 })).toEqual({
			startIndex: 0,
			endIndex: 4,
		});
	});

	test('should fall back to the initial window when the row height is unknown', () => {
		expect(computeWindow({ rowHeight: 0 })).toEqual({
			startIndex: 0,
			endIndex: INITIAL_WINDOW_SIZE,
		});
	});

	test('should fall back to every option when fewer than the initial window and unmeasured', () => {
		expect(computeWindow({ rowHeight: 0, optionCount: 3 })).toEqual({
			startIndex: 0,
			endIndex: 3,
		});
	});
});

describe('computeNearestScrollTop', () => {
	const params = {
		scrollTop: 400,
		viewportHeight: VIEWPORT_HEIGHT,
		rowHeight: ROW_HEIGHT,
		edgePadding: 4,
		targetRowHeight: ROW_HEIGHT,
	};

	test('should keep the scroll position when the row is fully visible', () => {
		expect(computeNearestScrollTop({ ...params, index: 12 })).toBe(400);
	});

	test('should align the row to the top when it is above the viewport', () => {
		expect(computeNearestScrollTop({ ...params, index: 2 })).toBe(
			2 * ROW_HEIGHT
		);
	});

	test('should align the row to the bottom when it is below the viewport', () => {
		expect(computeNearestScrollTop({ ...params, index: 30 })).toBe(
			4 + 31 * ROW_HEIGHT - VIEWPORT_HEIGHT
		);
	});

	test('should align the bottom edge with the real height of a taller target row', () => {
		const tallRowHeight = 3 * ROW_HEIGHT;

		expect(
			computeNearestScrollTop({
				...params,
				index: 30,
				targetRowHeight: tallRowHeight,
			})
		).toBe(4 + 30 * ROW_HEIGHT + tallRowHeight - VIEWPORT_HEIGHT);
	});

	test('should scroll to the very top for the first row', () => {
		expect(computeNearestScrollTop({ ...params, index: 0 })).toBe(0);
	});
});

describe('getMountedIndices', () => {
	test('should return the window when the active index is inside', () => {
		expect(
			getMountedIndices({ startIndex: 5, endIndex: 8, activeIndex: 6 })
		).toEqual([5, 6, 7]);
	});

	test('should return the window when nothing is active', () => {
		expect(
			getMountedIndices({ startIndex: 5, endIndex: 8, activeIndex: -1 })
		).toEqual([5, 6, 7]);
	});

	test('should put an active index before the window first', () => {
		expect(
			getMountedIndices({ startIndex: 5, endIndex: 8, activeIndex: 1 })
		).toEqual([1, 5, 6, 7]);
	});

	test('should put an active index after the window last', () => {
		expect(
			getMountedIndices({ startIndex: 5, endIndex: 8, activeIndex: 8 })
		).toEqual([5, 6, 7, 8]);
	});
});
