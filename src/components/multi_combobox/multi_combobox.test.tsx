import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { MultiCombobox } from './multi_combobox';

const OPTIONS = [
	{ value: 'a', label: 'Option A' },
	{ value: 'b', label: 'Option B' },
	{ value: 'c', label: 'Option C' },
];

describe('MultiCombobox', () => {
	test('renders label and names the trigger', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} />);
		expect(
			screen.getByRole('combobox', { name: 'Fruits' })
		).toBeInTheDocument();
	});

	test('should name the combobox from aria-label when no label is given', () => {
		render(<MultiCombobox aria-label="Fruits" options={OPTIONS} />);
		expect(
			screen.getByRole('combobox', { name: 'Fruits' })
		).toBeInTheDocument();
	});

	test('opens the dropdown and lists every option', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} />);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));

		expect(
			screen.getByRole('option', { name: 'Option A' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: 'Option B' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: 'Option C' })
		).toBeInTheDocument();
	});

	test('filters options by the search query', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} />);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		fireEvent.change(screen.getByPlaceholderText('Search'), {
			target: { value: 'B' },
		});

		expect(
			screen.queryByRole('option', { name: 'Option A' })
		).not.toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: 'Option B' })
		).toBeInTheDocument();
	});

	test('toggles a value on click and calls onChange with the new values', () => {
		const handleChange = vi.fn();
		render(
			<MultiCombobox label="Fruits" options={OPTIONS} onChange={handleChange} />
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		fireEvent.click(screen.getByRole('option', { name: 'Option B' }));

		expect(handleChange).toHaveBeenCalledWith(['b']);
	});

	test('deselects an already-selected value on a second click', () => {
		const handleChange = vi.fn();
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				defaultValues={['a']}
				onChange={handleChange}
			/>
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		fireEvent.click(screen.getByRole('option', { name: 'Option A' }));

		expect(handleChange).toHaveBeenCalledWith([]);
	});

	test('collapses extra selections into the overflow chip', () => {
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				defaultValues={['a', 'b', 'c']}
				maxDisplayedValues={2}
			/>
		);

		expect(screen.getByText('+2 more')).toBeInTheDocument();
	});

	test('disables unselected options once maxSelectedValues is reached', () => {
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				defaultValues={['a', 'b']}
				maxSelectedValues={2}
			/>
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));

		expect(screen.getByRole('option', { name: 'Option C' })).toHaveAttribute(
			'aria-disabled',
			'true'
		);
	});

	test('disables options rejected by isOptionDisabled', () => {
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				isOptionDisabled={(optionValue) => optionValue === 'b'}
			/>
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));

		expect(screen.getByRole('option', { name: 'Option B' })).toHaveAttribute(
			'aria-disabled',
			'true'
		);
	});

	test('clicking a disabled option does not call onChange', () => {
		const handleChange = vi.fn();
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				isOptionDisabled={(optionValue) => optionValue === 'b'}
				onChange={handleChange}
			/>
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		fireEvent.click(screen.getByRole('option', { name: 'Option B' }));

		expect(handleChange).not.toHaveBeenCalled();
	});

	test('clear button empties the selection and calls onChange with []', () => {
		const handleChange = vi.fn();
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				defaultValues={['a', 'b']}
				onChange={handleChange}
			/>
		);
		fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));

		expect(handleChange).toHaveBeenCalledWith([]);
	});

	test('onDropdownClose fires with the current values on Escape', () => {
		const handleDropdownClose = vi.fn();
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				defaultValues={['a']}
				onDropdownClose={handleDropdownClose}
			/>
		);
		const trigger = screen.getByRole('combobox', { name: 'Fruits' });
		fireEvent.click(trigger);
		fireEvent.keyDown(screen.getByPlaceholderText('Search'), {
			key: 'Escape',
		});

		expect(handleDropdownClose).toHaveBeenCalledWith(['a']);
	});

	test('onDropdownClose fires with the current values on outside click', () => {
		const handleDropdownClose = vi.fn();
		render(
			<div>
				<MultiCombobox
					label="Fruits"
					options={OPTIONS}
					defaultValues={['a']}
					onDropdownClose={handleDropdownClose}
				/>
				<button type="button">Outside</button>
			</div>
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		fireEvent.mouseDown(screen.getByRole('button', { name: 'Outside' }));

		expect(handleDropdownClose).toHaveBeenCalledWith(['a']);
	});

	test('respects a controlled values prop', () => {
		const handleChange = vi.fn();
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				values={['a']}
				onChange={handleChange}
			/>
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		fireEvent.click(screen.getByRole('option', { name: 'Option B' }));

		expect(handleChange).toHaveBeenCalledWith(['a', 'b']);
		expect(screen.getByRole('combobox', { name: 'Fruits' })).toHaveTextContent(
			'Option A'
		);
		expect(
			screen.getByRole('combobox', { name: 'Fruits' })
		).not.toHaveTextContent('Option B');
	});

	test('should use a small radius by default', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} />);

		expect(screen.getByRole('combobox', { name: 'Fruits' })).toHaveClass(
			'rounded-sm'
		);
	});

	test('caps the dropdown panel radius so a full radius keeps its box', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} radius="full" />);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));

		expect(screen.getByRole('listbox').parentElement).toHaveClass('rounded-lg');
	});

	test('unstyled variant drops the styling classes but keeps the roles', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} unstyled />);
		const trigger = screen.getByRole('combobox', { name: 'Fruits' });

		expect(trigger).not.toHaveClass('border-gray-300');
		fireEvent.click(trigger);
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});
});
