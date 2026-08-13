import type { Meta, StoryObj } from '@storybook/react-vite';

import { Kbd } from '#components/kbd/kbd';

const meta = {
	title: 'Example/Kbd',
	component: Kbd,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		children: {
			control: 'text',
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
		},
	},
	args: {
		children: 'Ctrl',
	},
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Combo: Story = {
	render: () => (
		<div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
			<Kbd>Ctrl</Kbd>
			<span>+</span>
			<Kbd>K</Kbd>
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Kbd size="xs">xs</Kbd>
			<Kbd size="sm">sm</Kbd>
			<Kbd size="md">md</Kbd>
			<Kbd size="lg">lg</Kbd>
		</div>
	),
};
