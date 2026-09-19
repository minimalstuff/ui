import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Field } from './field';

describe('Field', () => {
	test('renders a string label bound to the field via htmlFor', () => {
		render(
			<Field fieldId="email" errorId="email-error" label="Email">
				<input id="email" />
			</Field>
		);
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
	});

	test('marks a string label as required', () => {
		render(
			<Field fieldId="email" errorId="email-error" label="Email" required>
				<input id="email" />
			</Field>
		);
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	test('marks a node label as required', () => {
		render(
			<Field
				fieldId="email"
				errorId="email-error"
				label={<span>Email</span>}
				required
			>
				<input id="email" />
			</Field>
		);
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	test('renders no required mark when there is no label to attach it to', () => {
		render(
			<Field fieldId="email" errorId="email-error" required>
				<input id="email" />
			</Field>
		);
		expect(screen.queryByText('*')).not.toBeInTheDocument();
	});

	test('excludes the required mark from the accessible name', () => {
		render(
			<Field fieldId="email" errorId="email-error" label="Email" required>
				<input id="email" />
			</Field>
		);
		expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
	});

	test('shows the error message wired to the given errorId', () => {
		render(
			<Field fieldId="email" errorId="email-error" error="Invalid email">
				<input id="email" />
			</Field>
		);
		const errorMessage = screen.getByRole('alert');
		expect(errorMessage).toHaveTextContent('Invalid email');
		expect(errorMessage).toHaveAttribute('id', 'email-error');
	});
});
