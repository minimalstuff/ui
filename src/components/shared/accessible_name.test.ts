import { describe, expect, test } from 'vitest';

import { getAccessibleName, normalizeText } from './accessible_name';

function createElement(markup: string): Element {
	document.body.innerHTML = markup;
	return document.body.firstElementChild as Element;
}

describe('normalizeText', () => {
	test('should trim and collapse whitespace when the text is padded', () => {
		expect(normalizeText('  a \n  b  ')).toBe('a b');
	});

	test('should return an empty string when the text is null', () => {
		expect(normalizeText(null)).toBe('');
	});
});

describe('getAccessibleName', () => {
	test('should prefer aria-label when present', () => {
		const element = createElement('<button aria-label=" Close ">x</button>');
		expect(getAccessibleName(element)).toBe('Close');
	});

	test('should join the aria-labelledby targets when there is no aria-label', () => {
		const element = createElement(
			'<button aria-labelledby="a b">x</button><span id="a">One</span><span id="b">Two</span>'
		);
		expect(getAccessibleName(element)).toBe('One Two');
	});

	test('should fall back to the text content when there is no label', () => {
		const element = createElement('<button> Save   all </button>');
		expect(getAccessibleName(element)).toBe('Save all');
	});

	test('should fall back to the text content when aria-labelledby points nowhere', () => {
		const element = createElement(
			'<button aria-labelledby="missing">Save</button>'
		);
		expect(getAccessibleName(element)).toBe('Save');
	});
});
