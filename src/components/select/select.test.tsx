import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Select } from './select';

const OPTIONS = [
	{ value: 'a', label: 'Option A' },
	{ value: 'b', label: 'Option B' },
];

describe('Select', () => {
	test('renders label', () => {
		render(<Select label="Country" options={OPTIONS} />);
		expect(screen.getByLabelText('Country')).toBeInTheDocument();
	});

	test('renders all options', () => {
		render(<Select label="Country" options={OPTIONS} />);
		expect(
			screen.getByRole('option', { name: 'Option A' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: 'Option B' })
		).toBeInTheDocument();
	});

	test('renders a placeholder option when provided', () => {
		render(
			<Select label="Country" options={OPTIONS} placeholder="Choose one" />
		);
		expect(
			screen.getByRole('option', { name: 'Choose one' })
		).toBeInTheDocument();
	});

	test('renders as uncontrolled with defaultValue', () => {
		render(<Select label="Country" options={OPTIONS} defaultValue="b" />);
		expect(screen.getByLabelText('Country')).toHaveValue('b');
	});

	test('calls onChange when selection changes', () => {
		const handleChange = vi.fn();
		render(
			<Select label="Country" options={OPTIONS} onChange={handleChange} />
		);

		fireEvent.change(screen.getByLabelText('Country'), {
			target: { value: 'b' },
		});

		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	test('stays controlled by the value prop', () => {
		render(
			<Select label="Country" options={OPTIONS} value="a" onChange={vi.fn()} />
		);
		const select = screen.getByLabelText('Country');

		fireEvent.change(select, { target: { value: 'b' } });

		expect(select).toHaveValue('a');
	});

	test('shows an error message wired to aria-describedby', () => {
		render(<Select label="Country" options={OPTIONS} error="Required" />);
		const select = screen.getByLabelText('Country');
		const errorMessage = screen.getByRole('alert');

		expect(errorMessage).toHaveTextContent('Required');
		expect(select).toHaveAttribute('aria-invalid', 'true');
		expect(select).toHaveAttribute('aria-describedby', errorMessage.id);
	});

	test('forwards disabled to the select', () => {
		render(<Select label="Country" options={OPTIONS} disabled />);
		expect(screen.getByLabelText('Country')).toBeDisabled();
	});

	test('unstyled variant drops the default select styling', () => {
		render(<Select label="Country" options={OPTIONS} unstyled />);
		expect(screen.getByLabelText('Country')).not.toHaveClass('border-gray-300');
	});
});
