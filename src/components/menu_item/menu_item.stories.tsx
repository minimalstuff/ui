import type { Meta, StoryObj } from '@storybook/react-vite';

import { MenuItem } from '#components/menu_item/menu_item';

const meta = {
	title: 'Example/MenuItem',
	component: MenuItem,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		icon: {
			control: 'text',
			description: 'UnoCSS icon class (e.g. i-mdi-pencil)',
		},
		danger: {
			control: 'boolean',
		},
		disabled: {
			control: 'boolean',
		},
	},
	args: {
		children: 'Move up',
		onClick: () => {},
	},
	decorators: [
		(Story) => (
			<div className="w-48 rounded-md border border-gray-200 py-1 shadow-sm dark:border-gray-700">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof MenuItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
	args: {
		icon: 'i-mdi-pencil',
	},
};

export const Danger: Story = {
	args: {
		icon: 'i-mdi-delete',
		danger: true,
		children: 'Delete',
	},
};

export const Disabled: Story = {
	args: {
		icon: 'i-mdi-arrow-up',
		disabled: true,
	},
};
