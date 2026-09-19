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

	test('should show the active indicator on the active option even when it is disabled', () => {
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				isOptionDisabled={(optionValue) => optionValue === 'b'}
			/>
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		const searchInput = screen.getByPlaceholderText('Search');
		fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
		fireEvent.keyDown(searchInput, { key: 'ArrowDown' });

		expect(screen.getByRole('option', { name: 'Option B' })).toHaveClass(
			'bg-blue-50',
			'outline-2',
			'-outline-offset-2',
			'outline-blue-500'
		);
	});

	test('should close the dropdown when focus moves outside the wrapper', () => {
		const handleDropdownClose = vi.fn();
		render(
			<div>
				<MultiCombobox
					label="Fruits"
					options={OPTIONS}
					onDropdownClose={handleDropdownClose}
				/>
				<button type="button">Outside</button>
			</div>
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		fireEvent.blur(screen.getByPlaceholderText('Search'), {
			relatedTarget: screen.getByRole('button', { name: 'Outside' }),
		});

		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
		expect(handleDropdownClose).toHaveBeenCalledWith([]);
	});

	test('should not call onDropdownClose when the closed trigger blurs', () => {
		const handleDropdownClose = vi.fn();
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				onDropdownClose={handleDropdownClose}
			/>
		);
		const trigger = screen.getByRole('combobox', { name: 'Fruits' });
		fireEvent.focus(trigger);
		fireEvent.blur(trigger, { relatedTarget: null });

		expect(handleDropdownClose).not.toHaveBeenCalled();
	});

	test('should call onDropdownClose with [] when clearing from the trigger while closed', () => {
		const handleDropdownClose = vi.fn();
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				defaultValues={['a', 'b']}
				onDropdownClose={handleDropdownClose}
			/>
		);
		fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));

		expect(handleDropdownClose).toHaveBeenCalledTimes(1);
		expect(handleDropdownClose).toHaveBeenCalledWith([]);
	});

	test('should not call onDropdownClose when clearing from the trigger while open', () => {
		const handleDropdownClose = vi.fn();
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				defaultValues={['a', 'b']}
				onDropdownClose={handleDropdownClose}
			/>
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));

		expect(handleDropdownClose).not.toHaveBeenCalled();
	});

	test('should focus the trigger after clearing the selection via the X button', () => {
		render(
			<MultiCombobox label="Fruits" options={OPTIONS} defaultValues={['a']} />
		);
		fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));

		expect(screen.getByRole('combobox', { name: 'Fruits' })).toHaveFocus();
	});

	test('should focus the search input after clearing the selection via the footer Clear button', () => {
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				defaultValues={['a', 'b']}
				maxSelectedValues={2}
			/>
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		const footerClearButton = screen.getByRole('button', { name: 'Clear' });
		footerClearButton.focus();
		fireEvent.click(footerClearButton);

		expect(screen.getByPlaceholderText('Search')).toHaveFocus();
	});

	test('should give the search input an accessible name and describe it by the max-selected hint', () => {
		render(
			<MultiCombobox label="Fruits" options={OPTIONS} maxSelectedValues={2} />
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));

		const searchInput = screen.getByRole('textbox', { name: 'Search' });
		expect(searchInput).toHaveAccessibleDescription(
			'You can select up to 2 items'
		);
	});

	test('should not put aria-activedescendant on the trigger', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} />);
		const trigger = screen.getByRole('combobox', { name: 'Fruits' });
		fireEvent.click(trigger);
		fireEvent.keyDown(screen.getByPlaceholderText('Search'), {
			key: 'ArrowDown',
		});

		expect(trigger).not.toHaveAttribute('aria-activedescendant');
	});

	test('should open the dropdown with the first option active when ArrowDown is pressed on the closed trigger', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} />);
		const trigger = screen.getByRole('combobox', { name: 'Fruits' });
		fireEvent.keyDown(trigger, { key: 'ArrowDown' });

		const searchInput = screen.getByPlaceholderText('Search');
		const firstOption = screen.getByRole('option', { name: 'Option A' });
		expect(searchInput).toHaveAttribute(
			'aria-activedescendant',
			firstOption.id
		);
	});

	test('should open the dropdown with the last option active when ArrowUp is pressed on the closed trigger', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} />);
		const trigger = screen.getByRole('combobox', { name: 'Fruits' });
		fireEvent.keyDown(trigger, { key: 'ArrowUp' });

		const searchInput = screen.getByPlaceholderText('Search');
		const lastOption = screen.getByRole('option', { name: 'Option C' });
		expect(searchInput).toHaveAttribute('aria-activedescendant', lastOption.id);
	});

	test('should mark the trigger as aria-required when required', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} required />);
		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-required',
			'true'
		);
	});

	test('renders "No results" in a status region, not inside the listbox', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} />);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		fireEvent.change(screen.getByPlaceholderText('Search'), {
			target: { value: 'zzz' },
		});

		const status = screen.getByRole('status');
		expect(status).toHaveTextContent('No results found');
		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});
});
