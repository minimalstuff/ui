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

	test('merges a caller-supplied aria-describedby with the error id', () => {
		const { container } = render(
			<CheckboxOptions
				options={OPTIONS}
				aria-describedby="hint"
				error="Pick at least one"
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
			<CheckboxOptions options={OPTIONS} aria-describedby="hint" />
		);
		expect(container.querySelector('fieldset')).toHaveAttribute(
			'aria-describedby',
			'hint'
		);
	});

	test('should announce the group as required to assistive technology when required', () => {
		render(<CheckboxOptions options={OPTIONS} label="Consent" required />);
		expect(
			screen.getByRole('group', { name: 'Consent (required)' })
		).toBeInTheDocument();
	});

	test('should use a custom required label when provided', () => {
		render(
			<CheckboxOptions
				options={OPTIONS}
				label="Consent"
				required
				requiredLabel="obligatoire"
			/>
		);
		expect(
			screen.getByRole('group', { name: 'Consent (obligatoire)' })
		).toBeInTheDocument();
	});

	test('should not announce required when not required', () => {
		render(<CheckboxOptions options={OPTIONS} label="Consent" />);
		expect(screen.getByRole('group', { name: 'Consent' })).toBeInTheDocument();
	});

	test('should hide the visual required mark from assistive technology', () => {
		const { container } = render(
			<CheckboxOptions options={OPTIONS} label="Consent" required />
		);
		const requiredMark = container.querySelector('legend > span');
		expect(requiredMark).toHaveAttribute('aria-hidden', 'true');
	});
});
