import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { Combobox } from '#components/combobox/combobox';

const OPTIONS = [
	{ value: 'a', label: 'Option A' },
	{ value: 'b', label: 'Option B' },
];

describe('Combobox', () => {
	test('renders label', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		expect(screen.getByLabelText('Country')).toBeInTheDocument();
	});

	test('does not open the listbox on focus', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		fireEvent.focus(screen.getByLabelText('Country'));
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	test('opens the listbox when clicked', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		fireEvent.click(screen.getByLabelText('Country'));
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
		fireEvent.click(input);
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
		fireEvent.click(input);
		fireEvent.change(input, { target: { value: 'zzz' } });

		expect(screen.getByText('Nada')).toBeInTheDocument();
	});

	test('renders "No results" in a status region, not inside the listbox', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		const input = screen.getByLabelText('Country');
		fireEvent.click(input);
		fireEvent.change(input, { target: { value: 'zzz' } });

		const status = screen.getByRole('status');
		expect(status).toHaveTextContent('No results found');
		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});

	test('calls onChange with the value when an option is clicked', () => {
		const handleChange = vi.fn<() => void>();
		render(
			<Combobox label="Country" options={OPTIONS} onChange={handleChange} />
		);
		const input = screen.getByLabelText('Country');
		fireEvent.click(input);
		fireEvent.click(screen.getByRole('option', { name: 'Option B' }));

		expect(handleChange).toHaveBeenCalledWith('b');
		expect(input).toHaveValue('Option B');
	});

	test('selects the active option on Enter', () => {
		const handleChange = vi.fn<() => void>();
		render(
			<Combobox label="Country" options={OPTIONS} onChange={handleChange} />
		);
		const input = screen.getByLabelText('Country');
		fireEvent.click(input);
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(handleChange).toHaveBeenCalledWith('a');
	});

	test('activates the first option and opens when ArrowDown is pressed while closed', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		const input = screen.getByLabelText('Country');
		fireEvent.keyDown(input, { key: 'ArrowDown' });

		expect(input).toHaveAttribute('aria-expanded', 'true');
		const firstOption = screen.getByRole('option', { name: 'Option A' });
		expect(input).toHaveAttribute('aria-activedescendant', firstOption.id);
	});

	test('activates the last option and opens when ArrowUp is pressed while closed', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		const input = screen.getByLabelText('Country');
		fireEvent.keyDown(input, { key: 'ArrowUp' });

		expect(input).toHaveAttribute('aria-expanded', 'true');
		const lastOption = screen.getByRole('option', { name: 'Option B' });
		expect(input).toHaveAttribute('aria-activedescendant', lastOption.id);
	});

	test('Alt+ArrowDown opens the listbox without activating an option', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		const input = screen.getByLabelText('Country');
		fireEvent.keyDown(input, { key: 'ArrowDown', altKey: true });

		expect(input).toHaveAttribute('aria-expanded', 'true');
		expect(input).not.toHaveAttribute('aria-activedescendant');
	});

	test('Alt+ArrowUp closes the listbox', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		const input = screen.getByLabelText('Country');
		fireEvent.click(input);
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		fireEvent.keyDown(input, { key: 'ArrowUp', altKey: true });
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	test('is not defaultPrevented when Enter is pressed with no active option', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		const input = screen.getByLabelText('Country');
		fireEvent.click(input);

		const notPrevented = fireEvent.keyDown(input, { key: 'Enter' });
		expect(notPrevented).toBe(true);
	});

	test('should not prevent Enter when the query matches nothing', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		const input = screen.getByLabelText('Country');
		fireEvent.click(input);
		fireEvent.change(input, { target: { value: 'zzz' } });

		expect(input).not.toHaveAttribute('aria-activedescendant');
		const notPrevented = fireEvent.keyDown(input, { key: 'Enter' });
		expect(notPrevented).toBe(true);
	});

	test('closes the listbox on Escape', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		const input = screen.getByLabelText('Country');
		fireEvent.click(input);
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		fireEvent.keyDown(input, { key: 'Escape' });
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	test('stays controlled by the value prop', () => {
		const handleChange = vi.fn<() => void>();
		render(
			<Combobox
				label="Country"
				options={OPTIONS}
				value="a"
				onChange={handleChange}
			/>
		);
		const input = screen.getByLabelText('Country');
		fireEvent.click(input);
		fireEvent.click(screen.getByRole('option', { name: 'Option B' }));

		expect(handleChange).toHaveBeenCalledWith('b');
		expect(input).toHaveValue('Option A');
	});

	test('shows an error message wired to aria-describedby', () => {
		render(<Combobox label="Country" options={OPTIONS} error="Required" />);
		const input = screen.getByLabelText('Country');
		const errorMessage = screen.getByText('Required');

		expect(errorMessage).toHaveTextContent('Required');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
	});

	test('disables the input when disabled', () => {
		render(<Combobox label="Country" options={OPTIONS} disabled />);
		expect(screen.getByLabelText('Country')).toBeDisabled();
	});

	test('clears the selection when the clear button is clicked', () => {
		const handleChange = vi.fn<() => void>();
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

	test('returns focus to the input when the clear button is clicked', () => {
		render(<Combobox label="Country" options={OPTIONS} defaultValue="a" />);
		fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));

		expect(screen.getByLabelText('Country')).toHaveFocus();
	});

	test('marks the input as required for assistive tech when required', () => {
		render(<Combobox label="Country" options={OPTIONS} required />);
		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-required',
			'true'
		);
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

	test('should name the listbox after the label when it is open', () => {
		render(<Combobox label="Country" options={OPTIONS} />);
		fireEvent.click(screen.getByLabelText('Country'));

		expect(
			screen.getByRole('listbox', { name: 'Country' })
		).toBeInTheDocument();
	});

	test('should expose the description in the accessible description', () => {
		render(
			<Combobox label="Country" description="Pick one" options={OPTIONS} />
		);

		expect(screen.getByText('Pick one')).toBeInTheDocument();
		expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
			'Pick one'
		);
	});
});

test('should name the listbox with aria-label when both label and aria-label are given', () => {
	render(<Combobox label="Country" aria-label="Pick" options={OPTIONS} />);
	fireEvent.click(screen.getByRole('combobox', { name: 'Pick' }));

	expect(screen.getByRole('listbox', { name: 'Pick' })).toBeInTheDocument();
});

describe('Combobox filterOption', () => {
	const ACCENTED_OPTIONS = [
		{ value: 'cafe', label: 'Café' },
		{ value: 'tea', label: 'Thé' },
	];

	function removeAccents(text: string): string {
		return text.normalize('NFD').replace(/\p{Diacritic}/gu, '');
	}

	test('should use the custom filter instead of the default one', () => {
		render(
			<Combobox
				label="Drink"
				options={ACCENTED_OPTIONS}
				filterOption={(option, query) =>
					removeAccents(option.label)
						.toLowerCase()
						.includes(query.toLowerCase())
				}
			/>
		);
		const input = screen.getByLabelText('Drink');
		fireEvent.click(input);
		fireEvent.change(input, { target: { value: 'cafe' } });

		expect(screen.getByRole('option', { name: 'Café' })).toBeInTheDocument();
		expect(
			screen.queryByRole('option', { name: 'Thé' })
		).not.toBeInTheDocument();
	});

	test('should keep the default case-insensitive match when no filter is given', () => {
		render(<Combobox label="Drink" options={ACCENTED_OPTIONS} />);
		const input = screen.getByLabelText('Drink');
		fireEvent.click(input);
		fireEvent.change(input, { target: { value: 'cafe' } });

		expect(screen.queryByRole('option')).not.toBeInTheDocument();

		fireEvent.change(input, { target: { value: 'CAF' } });
		expect(screen.getByRole('option', { name: 'Café' })).toBeInTheDocument();
	});
});

test('should accept a readonly array of options', () => {
	render(
		<Combobox label="Pick" options={[{ value: 'a', label: 'A' }] as const} />
	);

	expect(screen.getByLabelText('Pick')).toBeInTheDocument();
});

describe('Combobox paging and set semantics', () => {
	const MANY_OPTIONS = Array.from({ length: 30 }, (_, index) => ({
		value: `city-${index + 1}`,
		label: `City ${index + 1}`,
	}));

	function renderOpen() {
		render(<Combobox label="City" options={MANY_OPTIONS} />);
		fireEvent.click(screen.getByRole('combobox', { name: 'City' }));
	}

	function pressKey(key: string) {
		fireEvent.keyDown(screen.getByRole('combobox', { name: 'City' }), { key });
	}

	function getActiveOptionName(): string | null {
		const activeId = screen
			.getByRole('combobox', { name: 'City' })
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
		fireEvent.change(screen.getByRole('combobox', { name: 'City' }), {
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
		render(<Combobox label="City" options={MANY_OPTIONS} />);
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
			screen.getByRole('combobox', { name: 'City' }),
			{
				key: 'PageDown',
				shiftKey: true,
			}
		);

		expect(wasNotPrevented).toBe(true);
		expect(getActiveOptionName()).toBe(activeBefore);
	});
});
