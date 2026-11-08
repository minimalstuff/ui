import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { MultiCombobox } from '#components/multi_combobox/multi_combobox';

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
		const handleChange = vi.fn<() => void>();
		render(
			<MultiCombobox label="Fruits" options={OPTIONS} onChange={handleChange} />
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));
		fireEvent.click(screen.getByRole('option', { name: 'Option B' }));

		expect(handleChange).toHaveBeenCalledWith(['b']);
	});

	test('deselects an already-selected value on a second click', () => {
		const handleChange = vi.fn<() => void>();
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
		const handleChange = vi.fn<() => void>();
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
		const handleChange = vi.fn<() => void>();
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
		const handleDropdownClose = vi.fn<() => void>();
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
		const handleDropdownClose = vi.fn<() => void>();
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
		const handleChange = vi.fn<() => void>();
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
		const handleDropdownClose = vi.fn<() => void>();
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
		const handleDropdownClose = vi.fn<() => void>();
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
		const handleDropdownClose = vi.fn<() => void>();
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
		const handleDropdownClose = vi.fn<() => void>();
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

		const searchInput = screen.getByRole('combobox', { name: /Search/ });
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

	test('should announce every selected label when some are hidden behind the overflow chip', () => {
		render(
			<MultiCombobox
				label="Fruits"
				options={OPTIONS}
				defaultValues={['a', 'b']}
				maxDisplayedValues={1}
			/>
		);

		const trigger = screen.getByRole('combobox', { name: 'Fruits' });
		expect(trigger).toHaveAccessibleDescription('Option A, Option B');
	});

	test('should expose the description in the accessible description', () => {
		render(
			<MultiCombobox label="Fruits" description="Pick some" options={OPTIONS} />
		);

		expect(screen.getByText('Pick some')).toBeInTheDocument();
		expect(
			screen.getByRole('combobox', { name: 'Fruits' })
		).toHaveAccessibleDescription('Pick some');
	});

	test('should expose the search field as an expanded combobox when the popup is open', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} />);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));

		const searchField = screen.getByRole('combobox', { name: /Search/ });
		expect(searchField).toHaveAttribute('aria-expanded', 'true');
	});

	test('should name the listbox after the label when the popup is open', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} />);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));

		expect(screen.getByRole('listbox', { name: 'Fruits' })).toBeInTheDocument();
	});

	test('should name the search field after the field label when the popup is open', () => {
		render(<MultiCombobox label="Fruits" options={OPTIONS} />);
		fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));

		expect(
			screen.getByRole('combobox', { name: 'Fruits, Search' })
		).toBeInTheDocument();
	});

	test('should not add a selection summary when the trigger has no explicit name', () => {
		render(<MultiCombobox options={OPTIONS} defaultValues={['a', 'b']} />);

		const trigger = screen.getByRole('combobox');
		expect(trigger).not.toHaveAttribute('aria-describedby');
		expect(
			trigger.id && document.getElementById(`${trigger.id}-selection`)
		).toBeNull();
	});

	test('should name the listbox with aria-label when both label and aria-label are given', () => {
		render(
			<MultiCombobox label="Fruits" aria-label="Pick" options={OPTIONS} />
		);
		fireEvent.click(screen.getByRole('combobox', { name: 'Pick' }));

		expect(screen.getByRole('listbox', { name: 'Pick' })).toBeInTheDocument();
	});
});

describe('MultiCombobox filterOption', () => {
	const ACCENTED_OPTIONS = [
		{ value: 'cafe', label: 'Café' },
		{ value: 'tea', label: 'Thé' },
	];

	function removeAccents(text: string): string {
		return text.normalize('NFD').replace(/\p{Diacritic}/gu, '');
	}

	function searchFor(query: string): void {
		fireEvent.click(screen.getByRole('combobox', { name: 'Drink' }));
		fireEvent.change(screen.getByPlaceholderText('Search'), {
			target: { value: query },
		});
	}

	test('should use the custom filter instead of the default one', () => {
		render(
			<MultiCombobox
				label="Drink"
				options={ACCENTED_OPTIONS}
				filterOption={(option, query) =>
					removeAccents(option.label)
						.toLowerCase()
						.includes(query.toLowerCase())
				}
			/>
		);
		searchFor('cafe');

		expect(screen.getByRole('option', { name: 'Café' })).toBeInTheDocument();
		expect(
			screen.queryByRole('option', { name: 'Thé' })
		).not.toBeInTheDocument();
	});

	test('should keep the default case-insensitive match when no filter is given', () => {
		render(<MultiCombobox label="Drink" options={ACCENTED_OPTIONS} />);
		searchFor('cafe');

		expect(screen.queryByRole('option')).not.toBeInTheDocument();

		fireEvent.change(screen.getByPlaceholderText('Search'), {
			target: { value: 'CAF' },
		});
		expect(screen.getByRole('option', { name: 'Café' })).toBeInTheDocument();
	});
});

describe('MultiCombobox paging and set semantics', () => {
	const MANY_OPTIONS = Array.from({ length: 30 }, (_, index) => ({
		value: `city-${index + 1}`,
		label: `City ${index + 1}`,
	}));

	function renderOpen() {
		render(<MultiCombobox label="City" options={MANY_OPTIONS} />);
		fireEvent.click(screen.getByRole('combobox', { name: 'City' }));
	}

	function pressKey(key: string) {
		fireEvent.keyDown(screen.getByPlaceholderText('Search'), { key });
	}

	function getActiveOptionName(): string | null {
		const activeId = screen
			.getByPlaceholderText('Search')
			.getAttribute('aria-activedescendant');
		return activeId
			? (document.getElementById(activeId)?.textContent ?? null)
			: null;
	}

	test('should expose the filtered count and 1-based position on every option', () => {
		renderOpen();
		const options = screen.getAllByRole('option');

		expect(options[0]).toHaveAttribute('aria-setsize', '30');
		expect(options[0]).toHaveAttribute('aria-posinset', '1');
		expect(options[29]).toHaveAttribute('aria-posinset', '30');
	});

	test('should update aria-setsize and aria-posinset after filtering', () => {
		renderOpen();
		fireEvent.change(screen.getByPlaceholderText('Search'), {
			target: { value: 'City 2' },
		});
		const options = screen.getAllByRole('option');

		expect(options).toHaveLength(11);
		expect(options[10]).toHaveAttribute('aria-setsize', '11');
		expect(options[10]).toHaveAttribute('aria-posinset', '11');
	});

	test('should activate the tenth option on PageDown when none is active', () => {
		renderOpen();
		pressKey('PageDown');

		expect(getActiveOptionName()).toBe('City 10');
	});

	test('should stay on the last option on PageDown at the end', () => {
		renderOpen();
		pressKey('PageDown');
		pressKey('PageDown');
		pressKey('PageDown');
		pressKey('PageDown');

		expect(getActiveOptionName()).toBe('City 30');
	});

	test('should clamp to the first option on PageUp', () => {
		renderOpen();
		pressKey('PageDown');
		pressKey('PageUp');
		pressKey('PageUp');

		expect(getActiveOptionName()).toBe('City 1');
	});

	test('should neither open the list nor prevent default on PageDown while closed', () => {
		render(<MultiCombobox label="City" options={MANY_OPTIONS} />);
		const wasNotPrevented = fireEvent.keyDown(
			screen.getByRole('combobox', { name: 'City' }),
			{
				key: 'PageDown',
			}
		);

		expect(wasNotPrevented).toBe(true);
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	test('should ignore PageDown with a modifier key and leave the default alone', () => {
		renderOpen();
		pressKey('PageDown');
		const activeBefore = getActiveOptionName();
		const wasNotPrevented = fireEvent.keyDown(
			screen.getByPlaceholderText('Search'),
			{
				key: 'PageDown',
				shiftKey: true,
			}
		);

		expect(wasNotPrevented).toBe(true);
		expect(getActiveOptionName()).toBe(activeBefore);
	});
});
