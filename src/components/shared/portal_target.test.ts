import { describe, expect, test } from 'vitest';

import { findLandmarkPortalTarget } from './portal_target';

describe('findLandmarkPortalTarget', () => {
	test('should return the closest landmark when the element is inside one', () => {
		document.body.innerHTML =
			'<main><div><button id="trigger"></button></div></main>';
		const target = findLandmarkPortalTarget(document.getElementById('trigger'));
		expect(target.tagName).toBe('MAIN');
	});

	test('should return the closest dialog when nested in a landmark', () => {
		document.body.innerHTML =
			'<main><div role="dialog"><button id="trigger"></button></div></main>';
		const target = findLandmarkPortalTarget(document.getElementById('trigger'));
		expect(target.getAttribute('role')).toBe('dialog');
	});

	test('should ignore a section without an accessible name', () => {
		document.body.innerHTML =
			'<section><button id="trigger"></button></section>';
		expect(findLandmarkPortalTarget(document.getElementById('trigger'))).toBe(
			document.body
		);
	});

	test('should fall back to body when the element is null', () => {
		expect(findLandmarkPortalTarget(null)).toBe(document.body);
	});
});
