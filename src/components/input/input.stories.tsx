import { expect, userEvent, within } from 'storybook/test';
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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText('Username');

		await expect(input).toHaveAccessibleDescription('2/3 min · 2/20 max');

		await userEvent.type(input, 'c');

		await expect(input).toHaveAccessibleDescription('3/3 min · 3/20 max');
	},
};

export const WithExternalDescription: Story = {
	render: (args) => (
		<>
			<p
				id="email-hint"
				className="mb-1 text-sm text-gray-700 dark:text-gray-300"
			>
				We will only use this to send receipts.
			</p>
			<Input {...args} />
		</>
	),
	args: {
		label: 'Email',
		'aria-describedby': 'email-hint',
		error: 'Invalid email',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText('Email');
		const errorMessage = canvas.getByRole('alert');
		const describedBy = input.getAttribute('aria-describedby')?.split(' ');

		await expect(describedBy).toContain('email-hint');
		await expect(describedBy).toContain(errorMessage.id);
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

export const Required: Story = {
	args: {
		label: 'Email',
		placeholder: 'you@example.com',
		required: true,
	},
};

export const RequiredWithError: Story = {
	args: {
		label: 'Email',
		placeholder: 'you@example.com',
		required: true,
		error: 'This field is required',
	},
};
