import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FieldError } from './field_error';

describe('FieldError', () => {
	test('renders nothing without an error', () => {
		const { container } = render(<FieldError id="x-error" />);
		expect(container).toBeEmptyDOMElement();
	});

	test('renders the error text with the given id', () => {
		render(<FieldError id="x-error" error="Required" />);
		const message = screen.getByRole('alert');
		expect(message).toHaveTextContent('Required');
		expect(message).toHaveAttribute('id', 'x-error');
	});
});
