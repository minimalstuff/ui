import { describe, expect, test } from 'vitest';

import { findDialogPortalTarget } from '#components/shared/dialog_portal_target';

describe('findDialogPortalTarget', () => {
	test('should return the closest dialog when the element is inside one', () => {
		document.body.innerHTML =
			'<div role="dialog" id="outer"><div role="alertdialog" id="inner"><button id="trigger"></button></div></div>';
		const target = findDialogPortalTarget(document.getElementById('trigger'));
		expect(target.id).toBe('inner');
	});

	test('should match a native dialog element', () => {
		document.body.innerHTML = '<dialog><button id="trigger"></button></dialog>';
		const target = findDialogPortalTarget(document.getElementById('trigger'));
		expect(target.tagName).toBe('DIALOG');
	});

	test('should ignore landmarks outside a dialog', () => {
		document.body.innerHTML =
			'<main><header><button id="trigger"></button></header></main>';
		expect(findDialogPortalTarget(document.getElementById('trigger'))).toBe(
			document.body
		);
	});

	test('should fall back to body when the element is null', () => {
		expect(findDialogPortalTarget(null)).toBe(document.body);
	});
});
