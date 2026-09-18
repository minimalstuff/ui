import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { CheckboxOptions } from './checkbox_options';

const OPTIONS = [
	{ value: 'a', label: 'Option A' },
	{ value: 'b', label: 'Option B' },
	{ value: 'c', label: 'Option C' },
];

describe('CheckboxOptions', () => {
	test('renders an option per entry', () => {
		render(<CheckboxOptions options={OPTIONS} />);
		expect(
			screen.getByRole('checkbox', { name: 'Option A' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('checkbox', { name: 'Option B' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('checkbox', { name: 'Option C' })
		).toBeInTheDocument();
	});

	test('normalizes plain string options', () => {
		render(<CheckboxOptions options={['A', 'B']} />);
		expect(screen.getByRole('checkbox', { name: 'A' })).toBeInTheDocument();
	});

	test('checks defaultValues when uncontrolled', () => {
		render(<CheckboxOptions options={OPTIONS} defaultValues={['b']} />);
		expect(screen.getByRole('checkbox', { name: 'Option B' })).toBeChecked();
		expect(
			screen.getByRole('checkbox', { name: 'Option A' })
		).not.toBeChecked();
	});

	test('toggling on adds the value', () => {
		render(<CheckboxOptions options={OPTIONS} />);

		fireEvent.click(screen.getByRole('checkbox', { name: 'Option B' }));

		expect(screen.getByRole('checkbox', { name: 'Option B' })).toBeChecked();
	});

	test('toggling off removes the value', () => {
		render(<CheckboxOptions options={OPTIONS} defaultValues={['a']} />);

		fireEvent.click(screen.getByRole('checkbox', { name: 'Option A' }));

		expect(
			screen.getByRole('checkbox', { name: 'Option A' })
		).not.toBeChecked();
	});

	test('allows multiple values to be selected at once', () => {
		render(<CheckboxOptions options={OPTIONS} />);

		fireEvent.click(screen.getByRole('checkbox', { name: 'Option A' }));
		fireEvent.click(screen.getByRole('checkbox', { name: 'Option C' }));

		expect(screen.getByRole('checkbox', { name: 'Option A' })).toBeChecked();
		expect(screen.getByRole('checkbox', { name: 'Option C' })).toBeChecked();
		expect(
			screen.getByRole('checkbox', { name: 'Option B' })
		).not.toBeChecked();
	});

	test('calls onChange with the full new array in options order', () => {
		const handleChange = vi.fn();
		render(<CheckboxOptions options={OPTIONS} onChange={handleChange} />);

		fireEvent.click(screen.getByRole('checkbox', { name: 'Option C' }));
		fireEvent.click(screen.getByRole('checkbox', { name: 'Option A' }));

		expect(handleChange).toHaveBeenLastCalledWith(['a', 'c']);
	});

	test('stays controlled by the values prop', () => {
		render(
			<CheckboxOptions options={OPTIONS} values={['a']} onChange={vi.fn()} />
		);

		fireEvent.click(screen.getByRole('checkbox', { name: 'Option B' }));

		expect(screen.getByRole('checkbox', { name: 'Option A' })).toBeChecked();
		expect(
			screen.getByRole('checkbox', { name: 'Option B' })
		).not.toBeChecked();
	});

	test('disables a single option via per-option disabled', () => {
		render(
			<CheckboxOptions
				options={[
					{ value: 'a', label: 'Option A' },
					{ value: 'b', label: 'Option B', disabled: true },
				]}
			/>
		);
		expect(screen.getByRole('checkbox', { name: 'Option B' })).toBeDisabled();
		expect(
			screen.getByRole('checkbox', { name: 'Option A' })
		).not.toBeDisabled();
	});

	test('disables all options when the group is disabled', () => {
		render(<CheckboxOptions options={OPTIONS} disabled />);
		expect(screen.getByRole('checkbox', { name: 'Option A' })).toBeDisabled();
		expect(screen.getByRole('checkbox', { name: 'Option B' })).toBeDisabled();
	});

	test('shows an error message wired to the fieldset', () => {
		render(<CheckboxOptions options={OPTIONS} error="Pick at least one" />);
		const errorMessage = screen.getByRole('alert');
		expect(errorMessage).toHaveTextContent('Pick at least one');
	});

	test('associates the error message with the fieldset via aria-describedby', () => {
		const { container } = render(
			<CheckboxOptions options={OPTIONS} error="Pick at least one" />
		);
		const fieldset = container.querySelector('fieldset');
		const errorMessage = screen.getByRole('alert');
		expect(fieldset).toHaveAttribute('aria-describedby', errorMessage.id);
	});
});
