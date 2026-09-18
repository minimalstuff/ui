import type { Meta, StoryObj } from '@storybook/react-vite';

import { MenuItem } from '#components/menu_item/menu_item';
import { MenuSeparator } from '#components/menu_separator/menu_separator';

const meta = {
	title: 'Example/MenuSeparator',
	component: MenuSeparator,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		unstyled: {
			control: 'boolean',
			description: 'Strips the built-in border and spacing.',
		},
	},
	decorators: [
		(Story) => (
			<div
				className="w-48 rounded-md border border-gray-200 py-1 shadow-sm dark:border-gray-700"
				role="menu"
				aria-label="Actions"
			>
				<MenuItem icon="i-mdi-pencil" onClick={() => {}}>
					Rename
				</MenuItem>
				<Story />
				<MenuItem icon="i-mdi-delete" danger onClick={() => {}}>
					Delete
				</MenuItem>
			</div>
		),
	],
} satisfies Meta<typeof MenuSeparator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Unstyled: Story = {
	args: {
		unstyled: true,
		className: 'my-2 border-t border-dashed border-gray-400',
	},
};
