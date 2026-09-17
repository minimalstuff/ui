import type { Meta, StoryObj } from '@storybook/react-vite';

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
	args: {},
};

export const WithLabel: Story = {
	args: {
		label: 'Fruits',
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
				label="sm"
				options={defaultOptions}
				placeholder="Select fruits..."
				radius="sm"
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
