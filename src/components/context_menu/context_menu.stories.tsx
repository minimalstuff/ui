import type { Meta, StoryObj } from '@storybook/react-vite';

import { MenuItem } from '#components/menu_item/menu_item';
import { ContextMenu } from '#components/context_menu/context_menu';

const meta = {
	title: 'Example/ContextMenu',
	component: ContextMenu,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
		},
	},
	args: {
		items: (
			<>
				<MenuItem icon="i-mdi-pencil" onClick={() => {}}>
					Edit
				</MenuItem>
				<MenuItem icon="i-mdi-content-copy" onClick={() => {}}>
					Duplicate
				</MenuItem>
				<MenuItem icon="i-mdi-delete" danger onClick={() => {}}>
					Delete
				</MenuItem>
			</>
		),
		children: (
			<div className="flex h-32 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
				Right-click me
			</div>
		),
	},
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
