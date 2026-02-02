import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, type SelectOption } from './select';

const defaultOptions: SelectOption[] = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'orange', label: 'Orange' },
];

const meta = {
	title: 'Example/Select',
	component: Select,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
			description: 'Label above the select',
		},
		error: {
			control: 'text',
			description: 'Error message below the select',
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder for the empty option',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable the select',
		},
	},
	args: {
		options: defaultOptions,
		placeholder: 'Choose a fruit...',
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Select>;

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

export const RequiredWithError: Story = {
	args: {
		label: 'Fruit',
		required: true,
		error: 'This field is required',
	},
};

export const WithoutPlaceholder: Story = {
	args: {
		label: 'Fruit',
		placeholder: undefined,
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
		placeholder: 'Select a country...',
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
