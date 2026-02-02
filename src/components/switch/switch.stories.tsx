import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './switch';

const meta = {
	title: 'Example/Switch',
	component: Switch,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
			description: 'Label next to the switch',
		},
		description: {
			control: 'text',
			description: 'Helper text below the label',
		},
		error: {
			control: 'text',
			description: 'Error message below the switch',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable the switch',
		},
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithLabel: Story = {
	args: {
		label: 'Enable notifications',
	},
};

export const WithDescription: Story = {
	args: {
		label: 'Enable dark mode',
		description: 'Use system preference or toggle manually.',
	},
};

export const On: Story = {
	args: {
		label: 'Dark mode',
		defaultChecked: true,
	},
};

export const WithError: Story = {
	args: {
		label: 'Enable feature',
		error: 'This option is required',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Disabled option',
		disabled: true,
	},
};

export const DisabledOn: Story = {
	args: {
		label: 'Disabled and on',
		disabled: true,
		defaultChecked: true,
	},
};

export const Required: Story = {
	args: {
		label: 'I accept the terms',
		required: true,
	},
};

export const RequiredWithError: Story = {
	args: {
		label: 'I accept the terms',
		required: true,
		error: 'You must enable this to continue',
	},
};

export const Controlled: Story = {
	args: {
		label: 'Controlled switch',
		checked: true,
	},
};
