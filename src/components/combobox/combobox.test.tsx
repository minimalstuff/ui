import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Combobox } from './combobox';

const OPTIONS = [
	{ value: 'a', label: 'Option A' },
	{ value: 'b', label: 'Option B' },
];

describe('Combobox', () => {
	test('renders label', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		expect(screen.getByLabelText('Country')).toBeInTheDocument();
	});

	test('shows all options on focus', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		fireEvent.focus(screen.getByLabelText('Country'));
		expect(
			screen.getByRole('option', { name: 'Option A' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: 'Option B' })
		).toBeInTheDocument();
	});

	test('filters options as the user types', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		const input = screen.getByLabelText('Country');
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: 'B' } });

		expect(
			screen.queryByRole('option', { name: 'Option A' })
		).not.toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: 'Option B' })
		).toBeInTheDocument();
	});

	test('shows noResultsText when nothing matches', () => {
		render(<Combobox label="Country" options={OPTIONS} noResultsText="Nada" />);
		const input = screen.getByLabelText('Country');
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: 'zzz' } });

		expect(screen.getByText('Nada')).toBeInTheDocument();
	});

	test('calls onChange with the value when an option is clicked', () => {
		const handleChange = vi.fn();
		render(
			<Combobox label="Country" options={OPTIONS} onChange={handleChange} />
		);
		const input = screen.getByLabelText('Country');
		fireEvent.focus(input);
		fireEvent.click(screen.getByRole('option', { name: 'Option B' }));

		expect(handleChange).toHaveBeenCalledWith('b');
		expect(input).toHaveValue('Option B');
	});

	test('selects the active option on Enter', () => {
		const handleChange = vi.fn();
		render(
			<Combobox label="Country" options={OPTIONS} onChange={handleChange} />
		);
		const input = screen.getByLabelText('Country');
		fireEvent.focus(input);
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(handleChange).toHaveBeenCalledWith('a');
	});

	test('closes the listbox on Escape', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		const input = screen.getByLabelText('Country');
		fireEvent.focus(input);
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		fireEvent.keyDown(input, { key: 'Escape' });
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	test('stays controlled by the value prop', () => {
		const handleChange = vi.fn();
		render(
			<Combobox
				label="Country"
				options={OPTIONS}
				value="a"
				onChange={handleChange}
			/>
		);
		const input = screen.getByLabelText('Country');
		fireEvent.focus(input);
		fireEvent.click(screen.getByRole('option', { name: 'Option B' }));

		expect(handleChange).toHaveBeenCalledWith('b');
		expect(input).toHaveValue('Option A');
	});

	test('shows an error message wired to aria-describedby', () => {
		render(<Combobox label="Country" options={OPTIONS} error="Required" />);
		const input = screen.getByLabelText('Country');
		const errorMessage = screen.getByRole('alert');

		expect(errorMessage).toHaveTextContent('Required');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
	});

	test('disables the input when disabled', () => {
		render(<Combobox label="Country" options={OPTIONS} disabled />);
		expect(screen.getByLabelText('Country')).toBeDisabled();
	});

	test('clears the selection when the clear button is clicked', () => {
		const handleChange = vi.fn();
		render(
			<Combobox
				label="Country"
				options={OPTIONS}
				defaultValue="a"
				onChange={handleChange}
			/>
		);
		fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));

		expect(handleChange).toHaveBeenCalledWith('');
	});

	test('unstyled variant drops the default input styling', () => {
		render(<Combobox label="Country" options={OPTIONS} unstyled />);
		expect(screen.getByLabelText('Country')).not.toHaveClass('border-gray-300');
	});

	test('uses the caller id verbatim so external labels can target it', () => {
		render(<Combobox label="Country" options={OPTIONS} id="country" />);
		expect(screen.getByLabelText('Country')).toHaveAttribute('id', 'country');
	});

	test('marks a node label as required', () => {
		render(
			<Combobox label={<span>Country</span>} options={OPTIONS} required />
		);
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	test('renders no required mark when there is no label', () => {
		render(<Combobox options={OPTIONS} required />);
		expect(screen.queryByText('*')).not.toBeInTheDocument();
	});

	test('should name the combobox from aria-label when no label is given', () => {
		render(<Combobox aria-label="Fruit" options={OPTIONS} />);
		expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeInTheDocument();
	});

	test('accepts a custom clear label', () => {
		render(
			<Combobox
				label="Country"
				options={OPTIONS}
				defaultValue="a"
				clearLabel="Effacer"
			/>
		);
		expect(screen.getByRole('button', { name: 'Effacer' })).toBeInTheDocument();
	});
});
