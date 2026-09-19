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

	test('merges a caller-supplied aria-describedby with the error id', () => {
		const { container } = render(
			<RadioOptions
				options={OPTIONS}
				aria-describedby="hint"
				error="Pick one"
			/>
		);
		const fieldset = container.querySelector('fieldset');
		const errorMessage = screen.getByRole('alert');
		const describedBy = fieldset?.getAttribute('aria-describedby');

		expect(describedBy).toContain('hint');
		expect(describedBy).toContain(errorMessage.id);
	});

	test('keeps only the caller-supplied aria-describedby when there is no error', () => {
		const { container } = render(
			<RadioOptions options={OPTIONS} aria-describedby="hint" />
		);
		expect(container.querySelector('fieldset')).toHaveAttribute(
			'aria-describedby',
			'hint'
		);
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

	test('uses the caller id verbatim for the radio group', () => {
		render(<RadioOptions options={OPTIONS} id="plan" />);
		expect(screen.getByRole('radio', { name: 'Option A' })).toHaveAttribute(
			'id',
			'plan-0'
		);
	});

	test('keeps an option disabled when the group is explicitly enabled', () => {
		render(
			<RadioOptions
				disabled={false}
				options={[
					{ value: 'a', label: 'Option A' },
					{ value: 'b', label: 'Option B', disabled: true },
				]}
			/>
		);
		expect(screen.getByRole('radio', { name: 'Option B' })).toBeDisabled();
	});

	test('forwards className to each option row, not the legend', () => {
		render(<RadioOptions options={OPTIONS} label="Plan" className="custom" />);
		const optionLabel = screen
			.getByRole('radio', {
				name: 'Option A',
			})
			.closest('label');

		expect(optionLabel).toHaveClass('custom');
		expect(screen.getByText('Plan')).not.toHaveClass('custom');
	});
});
