import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FieldDescription } from './field_description';

describe('FieldDescription', () => {
	test('renders nothing without a description', () => {
		const { container } = render(<FieldDescription id="x-description" />);
		expect(container).toBeEmptyDOMElement();
	});

	test('renders a string description as a paragraph', () => {
		render(<FieldDescription id="x-description" description="Helper text" />);
		const description = screen.getByText('Helper text');
		expect(description.tagName).toBe('P');
		expect(description).toHaveAttribute('id', 'x-description');
	});

	test('renders a node description as a span', () => {
		render(
			<FieldDescription
				id="x-description"
				description={<strong>Helper text</strong>}
			/>
		);
		const description = screen.getByText('Helper text');
		expect(description.closest('span')).toHaveAttribute('id', 'x-description');
	});
});
