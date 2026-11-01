import { describe, expect, test } from 'vitest';

import { resolveNodeLabelledBy } from '#components/shared/resolve_node_labelled_by';

describe('resolveNodeLabelledBy', () => {
	test('should return the label id when the label is a node', () => {
		expect(resolveNodeLabelledBy(<span>Email</span>, 'field-label')).toBe(
			'field-label'
		);
	});

	test.each([
		['a string label', 'Email', undefined],
		['no label', undefined, undefined],
		['a null label', null, undefined],
		['a false label', false, undefined],
		['an empty label', '', undefined],
		['an aria-label', <span key="label">Email</span>, 'Courriel'],
	])('should return undefined when given %s', (_name, label, ariaLabel) => {
		expect(resolveNodeLabelledBy(label, 'field-label', ariaLabel)).toBe(
			undefined
		);
	});
});
