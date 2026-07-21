import type { Meta, StoryObj } from '@storybook/react-vite';

import { Combobox, type ComboboxOption } from './combobox';

const defaultOptions: ComboboxOption[] = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'orange', label: 'Orange' },
];

const meta = {
	title: 'Example/Combobox',
	component: Combobox,
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
			description: 'Placeholder shown when nothing is selected',
		},
		noResultsText: {
			control: 'text',
			description: 'Text shown when the search matches nothing',
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
		placeholder: 'Search a fruit...',
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithLabel: Story = {
	args: {
		label: 'Fruit',
	},
};

export const WithError: Story = {
	args: {
		label: 'Fruit',
		error: 'Please select a fruit',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Fruit',
		disabled: true,
	},
};

export const Required: Story = {
	args: {
		label: 'Fruit',
		required: true,
	},
};

export const Controlled: Story = {
	args: {
		label: 'Fruit',
		value: 'banana',
	},
};

export const ManyOptions: Story = {
	args: {
		label: 'Country',
		placeholder: 'Search a country...',
		options: [
			{ value: 'fr', label: 'France' },
			{ value: 'de', label: 'Germany' },
			{ value: 'es', label: 'Spain' },
			{ value: 'it', label: 'Italy' },
			{ value: 'gb', label: 'United Kingdom' },
			{ value: 'us', label: 'United States' },
		],
	},
};

export const Unstyled: Story = {
	args: {
		label: 'Fruit',
		unstyled: true,
	},
};
