import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { RadioOptions } from './radio_options';

const OPTIONS = [
	{ value: 'a', label: 'Option A' },
	{ value: 'b', label: 'Option B' },
];

describe('RadioOptions', () => {
	test('renders an option per entry', () => {
		render(<RadioOptions options={OPTIONS} />);
		expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'Option B' })).toBeInTheDocument();
	});

	test('normalizes plain string options', () => {
		render(<RadioOptions options={['A', 'B']} />);
		expect(screen.getByRole('radio', { name: 'A' })).toBeInTheDocument();
	});

	test('selects defaultValue when uncontrolled', () => {
		render(<RadioOptions options={OPTIONS} defaultValue="b" />);
		expect(screen.getByRole('radio', { name: 'Option B' })).toBeChecked();
	});

	test('selecting an option updates state when uncontrolled', () => {
		render(<RadioOptions options={OPTIONS} />);

		fireEvent.click(screen.getByRole('radio', { name: 'Option B' }));

		expect(screen.getByRole('radio', { name: 'Option B' })).toBeChecked();
		expect(screen.getByRole('radio', { name: 'Option A' })).not.toBeChecked();
	});

	test('calls onChange with the selected value', () => {
		const handleChange = vi.fn();
		render(<RadioOptions options={OPTIONS} onChange={handleChange} />);

		fireEvent.click(screen.getByRole('radio', { name: 'Option B' }));

		expect(handleChange).toHaveBeenCalledWith('b');
	});

	test('stays controlled by the value prop', () => {
		render(<RadioOptions options={OPTIONS} value="a" onChange={vi.fn()} />);

		fireEvent.click(screen.getByRole('radio', { name: 'Option B' }));

		expect(screen.getByRole('radio', { name: 'Option A' })).toBeChecked();
	});

	test('shows an error message wired to the fieldset', () => {
		render(<RadioOptions options={OPTIONS} error="Pick one" />);
		const errorMessage = screen.getByRole('alert');
		expect(errorMessage).toHaveTextContent('Pick one');
	});

	test('renders option description', () => {
		render(
			<RadioOptions
				options={[{ value: 'a', label: 'Option A', description: 'Details' }]}
			/>
		);
		expect(screen.getByText('Details')).toBeInTheDocument();
	});

	test('disables all options when disabled', () => {
		render(<RadioOptions options={OPTIONS} disabled />);
		expect(screen.getByRole('radio', { name: 'Option A' })).toBeDisabled();
		expect(screen.getByRole('radio', { name: 'Option B' })).toBeDisabled();
	});
});
