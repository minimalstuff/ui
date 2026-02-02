import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox';

const meta = {
	title: 'Example/Checkbox',
	component: Checkbox,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
			description: 'Label next to the checkbox',
		},
		error: {
			control: 'text',
			description: 'Error message below the checkbox',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable the checkbox',
		},
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithLabel: Story = {
	args: {
		label: 'Accept terms and conditions',
	},
};

export const Checked: Story = {
	args: {
		label: 'Subscribe to newsletter',
		defaultChecked: true,
	},
};

export const WithError: Story = {
	args: {
		label: 'Accept terms and conditions',
		error: 'You must accept the terms to continue',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Disabled option',
		disabled: true,
	},
};

export const DisabledChecked: Story = {
	args: {
		label: 'Disabled and checked',
		disabled: true,
		defaultChecked: true,
	},
};

export const Required: Story = {
	args: {
		label: 'I agree to the privacy policy',
		required: true,
	},
};

export const RequiredWithError: Story = {
	args: {
		label: 'I agree to the privacy policy',
		required: true,
		error: 'This field is required',
	},
};

export const Controlled: Story = {
	args: {
		label: 'Controlled checkbox',
		checked: true,
	},
};
