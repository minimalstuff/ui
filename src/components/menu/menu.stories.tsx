import type { Meta, StoryObj } from '@storybook/react-vite';

import { Menu } from '#components/menu/menu';
import { MenuItem } from '#components/menu_item/menu_item';
import { IconButton } from '#components/icon_button/icon_button';

const meta = {
	title: 'Example/Menu',
	component: Menu,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		side: {
			control: 'select',
			options: ['top', 'bottom', 'left', 'right'],
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
		},
	},
	args: {
		trigger: (
			<IconButton icon="i-mdi-dots-vertical" aria-label="Options" size="sm" />
		),
		children: (
			<>
				<MenuItem icon="i-mdi-arrow-up" onClick={() => {}}>
					Move up
				</MenuItem>
				<MenuItem icon="i-mdi-arrow-down" onClick={() => {}}>
					Move down
				</MenuItem>
				<MenuItem icon="i-mdi-delete" danger onClick={() => {}}>
					Delete
				</MenuItem>
			</>
		),
	},
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AlignEnd: Story = {
	args: {
		align: 'end',
	},
};

export const AlignCenter: Story = {
	args: {
		align: 'center',
	},
};

export const SideRight: Story = {
	args: {
		side: 'right',
	},
};
