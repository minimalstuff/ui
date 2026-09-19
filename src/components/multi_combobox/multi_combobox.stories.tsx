import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { expectFocusOn } from '../../../.storybook/play_helpers';
import { MultiCombobox, type MultiComboboxOption } from './multi_combobox';

const defaultOptions: MultiComboboxOption[] = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'orange', label: 'Orange' },
	{ value: 'grape', label: 'Grape' },
	{ value: 'mango', label: 'Mango' },
];

const sortOptions: MultiComboboxOption[] = [
	{ value: 'name', label: 'Name' },
	{ value: 'name_desc', label: 'Name (desc)' },
	{ value: 'date', label: 'Date' },
	{ value: 'date_desc', label: 'Date (desc)' },
	{ value: 'price', label: 'Price' },
	{ value: 'price_desc', label: 'Price (desc)' },
];

function findOppositeSortOption(optionValue: string): string {
	return optionValue.endsWith('_desc')
		? optionValue.replace('_desc', '')
		: `${optionValue}_desc`;
}

function isSortOptionDisabled(
	optionValue: string,
	selectedValues: readonly string[]
): boolean {
	return selectedValues.includes(findOppositeSortOption(optionValue));
}

const meta = {
	title: 'Example/MultiCombobox',
	component: MultiCombobox,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
			description: 'Label above the combobox',
		},
		error: {
			control: 'text',
			description: 'Error message below the combobox',
		},
		placeholder: {
			control: 'text',
			description: 'Trigger text shown when nothing is selected',
		},
		searchPlaceholder: {
			control: 'text',
			description: 'Placeholder for the dropdown search input',
		},
		noResultsText: {
			control: 'text',
			description: 'Text shown when the search matches nothing',
		},
		clearLabel: {
			control: 'text',
			description: 'Accessible label for the clear icon button',
		},
		clearText: {
			control: 'text',
			description: 'Label for the footer clear button',
		},
		maxSelectedValues: {
			control: 'number',
			description: 'Caps how many options can be selected at once',
		},
		maxDisplayedValues: {
			control: 'number',
			description: 'Pills shown on the trigger before collapsing into +N more',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable the combobox',
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
			description: 'Border radius',
		},
		unstyled: {
			control: 'boolean',
			description: 'Strip all built-in styling',
		},
	},
	args: {
		options: defaultOptions,
		placeholder: 'Select fruits...',
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof MultiCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		'aria-label': 'Fruits',
	},
};

export const WithLabel: Story = {
	args: {
		label: 'Fruits',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('combobox', { name: 'Fruits' });

		await step('Tab focuses the trigger', async () => {
			await userEvent.tab();
			await expectFocusOn(trigger);
		});

		await step(
			'ArrowUp opens the listbox with the last option active',
			async () => {
				await userEvent.keyboard('{ArrowUp}');
				const searchInput = canvas.getByRole('textbox', { name: 'Search' });
				const lastOption = canvas.getByRole('option', { name: 'Mango' });
				await expect(searchInput).toHaveAttribute(
					'aria-activedescendant',
					lastOption.id
				);
			}
		);

		await step('Enter selects the active option', async () => {
			await userEvent.keyboard('{Enter}');
			await expect(
				canvas.getByRole('option', { name: 'Mango' })
			).toHaveAttribute('aria-selected', 'true');
		});

		await step(
			'Escape closes the listbox, returns focus to the trigger, and leaves no stale aria-activedescendant on it',
			async () => {
				await userEvent.keyboard('{Escape}');
				await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
				await expectFocusOn(trigger);
				await expect(trigger).not.toHaveAttribute('aria-activedescendant');
			}
		);

		await step('Tab moves focus to the "Clear selection" button', async () => {
			await userEvent.tab();
			await expectFocusOn(
				canvas.getByRole('button', { name: 'Clear selection' })
			);
		});

		await step(
			'activating the clear button empties the selection, returns focus to the trigger, and restores the placeholder',
			async () => {
				await userEvent.keyboard('{Enter}');
				await expectFocusOn(trigger);
				await expect(trigger).toHaveTextContent('Select fruits...');
			}
		);
	},
};

export const Capped: Story = {
	args: {
		label: 'Sort by',
		options: sortOptions,
		placeholder: 'Select sort order...',
		maxSelectedValues: 2,
		isOptionDisabled: isSortOptionDisabled,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('combobox', { name: 'Sort by' });

		await step('Tab focuses the trigger', async () => {
			await userEvent.tab();
			await expectFocusOn(trigger);
		});

		await step(
			'ArrowDown opens the listbox with the first option active and moves focus into the named search input',
			async () => {
				await userEvent.keyboard('{ArrowDown}');
				const searchInput = canvas.getByRole('textbox', { name: 'Search' });
				await expectFocusOn(searchInput);
				await expect(searchInput).toHaveAccessibleDescription(
					'You can select up to 2 items'
				);
				const nameOption = canvas.getByRole('option', { name: 'Name' });
				await expect(searchInput).toHaveAttribute(
					'aria-activedescendant',
					nameOption.id
				);
			}
		);

		await step('Enter selects "Name"', async () => {
			await userEvent.keyboard('{Enter}');
			await expect(
				canvas.getByRole('option', { name: 'Name' })
			).toHaveAttribute('aria-selected', 'true');
		});

		await step(
			'moving to "Date" and pressing Enter selects it, reaching the cap',
			async () => {
				await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
				await expect(
					canvas.getByRole('option', { name: 'Date' })
				).toHaveAttribute('aria-selected', 'true');
			}
		);

		await step(
			'ArrowDown lands on the disabled "Date (desc)" option, which still shows as active',
			async () => {
				await userEvent.keyboard('{ArrowDown}');
				const searchInput = canvas.getByRole('textbox', { name: 'Search' });
				const dateDescOption = canvas.getByRole('option', {
					name: 'Date (desc)',
				});
				await expect(searchInput).toHaveAttribute(
					'aria-activedescendant',
					dateDescOption.id
				);
				await expect(dateDescOption).toHaveAttribute('aria-disabled', 'true');
				const dateDescStyle = getComputedStyle(dateDescOption);
				await expect(dateDescStyle.backgroundColor).not.toBe(
					'rgba(0, 0, 0, 0)'
				);
				await expect(dateDescStyle.outlineStyle).toBe('solid');
			}
		);

		await step(
			'Enter on the disabled active option does not select it',
			async () => {
				await userEvent.keyboard('{Enter}');
				await expect(
					canvas.getByRole('option', { name: 'Date (desc)' })
				).toHaveAttribute('aria-selected', 'false');
			}
		);

		await step(
			'Tab moves focus straight to the footer Clear button',
			async () => {
				await userEvent.tab();
				await expectFocusOn(canvas.getByRole('button', { name: 'Clear' }));
			}
		);

		await step(
			'activating the footer Clear button empties the selection and refocuses the search input',
			async () => {
				await userEvent.keyboard('{Enter}');
				await expectFocusOn(canvas.getByRole('textbox', { name: 'Search' }));
				await expect(
					canvas.getByRole('option', { name: 'Name' })
				).toHaveAttribute('aria-selected', 'false');
				await expect(
					canvas.getByRole('option', { name: 'Date' })
				).toHaveAttribute('aria-selected', 'false');
			}
		);
	},
};

export const WithError: Story = {
	args: {
		label: 'Fruits',
		error: 'Please select at least one fruit',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Fruits',
		disabled: true,
		defaultValues: ['apple'],
	},
};

export const Radius: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
			<MultiCombobox
				label="none"
				options={defaultOptions}
				placeholder="Select fruits..."
				radius="none"
			/>
			<MultiCombobox
				label="md"
				options={defaultOptions}
				placeholder="Select fruits..."
				radius="md"
			/>
			<MultiCombobox
				label="lg"
				options={defaultOptions}
				placeholder="Select fruits..."
				radius="lg"
			/>
			<MultiCombobox
				label="full"
				options={defaultOptions}
				placeholder="Select fruits..."
				radius="full"
			/>
		</div>
	),
};

export const Unstyled: Story = {
	args: {
		label: 'Fruits',
		unstyled: true,
	},
};

export const Required: Story = {
	args: {
		label: 'Fruits',
		required: true,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step(
			'the trigger is marked as required for assistive tech',
			async () => {
				await expect(canvas.getByRole('combobox')).toHaveAttribute(
					'aria-required',
					'true'
				);
			}
		);
	},
};

function FollowedByButtonExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
			<MultiCombobox label="Fruits" options={defaultOptions} />
			<button type="button">Next</button>
		</div>
	);
}

export const FollowedByButton: Story = {
	render: () => <FollowedByButtonExample />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('combobox', { name: 'Fruits' });

		await step('Tab focuses the trigger', async () => {
			await userEvent.tab();
			await expectFocusOn(trigger);
		});

		await step('ArrowDown opens the listbox', async () => {
			await userEvent.keyboard('{ArrowDown}');
			await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		});

		await step(
			'Tab moves focus to the "Next" button and closes the dropdown',
			async () => {
				await userEvent.tab();
				await expectFocusOn(canvas.getByRole('button', { name: 'Next' }));
				await expect(trigger).toHaveAttribute('aria-expanded', 'false');
			}
		);
	},
};

export const NoResults: Story = {
	args: {
		label: 'Fruits',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('combobox', { name: 'Fruits' });

		await step(
			'typing a query with no matches announces "No results found"',
			async () => {
				await userEvent.click(trigger);
				const searchInput = canvas.getByRole('textbox', { name: 'Search' });
				await userEvent.type(searchInput, 'zzz');
				await expect(canvas.getByRole('status')).toHaveTextContent(
					'No results found'
				);
			}
		);
	},
};
