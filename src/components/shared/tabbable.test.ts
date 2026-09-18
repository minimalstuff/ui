import { describe, expect, test } from 'vitest';

import { getTabbableElements } from './tabbable';

function renderContainer(html: string): HTMLElement {
	const container = document.createElement('div');
	container.innerHTML = html;
	document.body.appendChild(container);
	return container;
}

describe('getTabbableElements', () => {
	test('includes links, form controls, and elements with a tabindex', () => {
		const container = renderContainer(`
			<a href="/">Link</a>
			<button>Button</button>
			<input type="text" />
			<select><option>One</option></select>
			<textarea></textarea>
			<summary>Summary</summary>
			<div tabindex="0">Custom</div>
		`);

		const tags = getTabbableElements(container).map((element) =>
			element.tagName.toLowerCase()
		);

		expect(tags).toEqual([
			'a',
			'button',
			'input',
			'select',
			'textarea',
			'summary',
			'div',
		]);
	});

	test('excludes disabled form controls', () => {
		const container = renderContainer(
			'<button disabled>Disabled</button><button>Enabled</button>'
		);

		const labels = getTabbableElements(container).map(
			(element) => element.textContent
		);

		expect(labels).toEqual(['Enabled']);
	});

	test('excludes elements with tabindex="-1"', () => {
		const container = renderContainer(
			'<button tabindex="-1">Skip</button><button>Keep</button>'
		);

		const labels = getTabbableElements(container).map(
			(element) => element.textContent
		);

		expect(labels).toEqual(['Keep']);
	});

	test('excludes hidden inputs', () => {
		const container = renderContainer(
			'<input type="hidden" value="x" /><input type="text" />'
		);

		expect(getTabbableElements(container)).toHaveLength(1);
	});

	test('excludes elements inside an inert ancestor', () => {
		const container = renderContainer(
			'<div inert><button>Inert</button></div><button>Live</button>'
		);

		const labels = getTabbableElements(container).map(
			(element) => element.textContent
		);

		expect(labels).toEqual(['Live']);
	});

	test('keeps only the checked radio in a named group', () => {
		const container = renderContainer(`
			<input type="radio" name="fruit" value="apple" />
			<input type="radio" name="fruit" value="banana" checked />
			<input type="radio" name="fruit" value="orange" />
		`);

		const values = getTabbableElements(container).map(
			(element) => (element as HTMLInputElement).value
		);

		expect(values).toEqual(['banana']);
	});

	test('keeps the first radio of a named group when none is checked', () => {
		const container = renderContainer(`
			<input type="radio" name="fruit" value="apple" />
			<input type="radio" name="fruit" value="banana" />
		`);

		const values = getTabbableElements(container).map(
			(element) => (element as HTMLInputElement).value
		);

		expect(values).toEqual(['apple']);
	});

	test('keeps every radio when they do not share a name', () => {
		const container = renderContainer(`
			<input type="radio" name="fruit" value="apple" />
			<input type="radio" name="vegetable" value="carrot" />
		`);

		expect(getTabbableElements(container)).toHaveLength(2);
	});
});
