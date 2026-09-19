import { describe, expect, test } from 'vitest';

import { getTabStopIndex } from './use_tabs_keyboard_navigation';

const ITEMS = [
	{ title: 'First', content: 'First content' },
	{ title: 'Second', content: 'Second content' },
	{ title: 'Third', content: 'Third content', disabled: true },
];

describe('getTabStopIndex', () => {
	test('returns the active index when that tab is enabled', () => {
		expect(getTabStopIndex(ITEMS, 0)).toBe(0);
	});

	test('falls back to the first enabled tab when the active tab is disabled', () => {
		expect(getTabStopIndex(ITEMS, 2)).toBe(0);
	});

	test('returns -1 when no tab is enabled', () => {
		const allDisabled = ITEMS.map((item) => ({ ...item, disabled: true }));
		expect(getTabStopIndex(allDisabled, 0)).toBe(-1);
	});
});
