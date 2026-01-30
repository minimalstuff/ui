import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';

const meta = {
	title: 'Example/Input',
	component: Input,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
			description: 'Label above the input',
		},
		error: {
			control: 'text',
			description: 'Error message below the input',
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder text',
		},
		showCharCount: {
			control: 'boolean',
			description: 'Show character count when minLength or maxLength is set',
		},
		minLength: {
			control: 'number',
			description: 'Minimum length',
		},
		maxLength: {
			control: 'number',
			description: 'Maximum length',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable the input',
		},
	},
	args: {
		placeholder: 'Placeholder',
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithLabel: Story = {
	args: {
		label: 'Email',
		placeholder: 'you@example.com',
	},
};

export const WithError: Story = {
	args: {
		label: 'Email',
		placeholder: 'you@example.com',
		error: 'Please enter a valid email address',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Disabled',
		placeholder: 'Cannot edit',
		disabled: true,
	},
};

export const WithCharCount: Story = {
	args: {
		label: 'Username',
		placeholder: '3–20 characters',
		showCharCount: true,
		minLength: 3,
		maxLength: 20,
		defaultValue: 'ab',
	},
};

export const WithCharCountControlled: Story = {
	args: {
		label: 'Bio',
		placeholder: 'Max 140 characters',
		showCharCount: true,
		maxLength: 140,
		value: 'Hello world',
	},
};

export const WithErrorAndCharCount: Story = {
	args: {
		label: 'Username',
		placeholder: '3–20 characters',
		error: 'Username must be between 3 and 20 characters',
		showCharCount: true,
		minLength: 3,
		maxLength: 20,
		defaultValue: 'ab',
	},
};
