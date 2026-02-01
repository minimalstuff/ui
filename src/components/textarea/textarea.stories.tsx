import { Textarea } from '#components/textarea/textarea';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Example/Textarea',
	component: Textarea,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
			description: 'Label above the textarea',
		},
		error: {
			control: 'text',
			description: 'Error message below the textarea',
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
			description: 'Disable the textarea',
		},
	},
	args: {
		placeholder: 'Enter your message...',
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithLabel: Story = {
	args: {
		label: 'Description',
		placeholder: 'Enter your message...',
	},
};

export const WithError: Story = {
	args: {
		label: 'Description',
		placeholder: 'Enter your message...',
		error: 'This field is required',
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
		label: 'Bio',
		placeholder: 'Max 500 characters',
		showCharCount: true,
		maxLength: 500,
		defaultValue: 'Hello',
	},
};

export const WithErrorAndCharCount: Story = {
	args: {
		label: 'Description',
		placeholder: '10–500 characters',
		error: 'Description must be between 10 and 500 characters',
		showCharCount: true,
		minLength: 10,
		maxLength: 500,
		defaultValue: 'Too short',
	},
};

export const Required: Story = {
	args: {
		label: 'Message',
		placeholder: 'Enter your message...',
		required: true,
	},
};

export const RequiredWithError: Story = {
	args: {
		label: 'Message',
		placeholder: 'Enter your message...',
		required: true,
		error: 'This field is required',
	},
};
