import type { Meta, StoryObj } from '@storybook/react-vite';

import { MenuItem } from '#components/menu_item/menu_item';
import { MenuGroup } from '#components/menu_group/menu_group';
import { MenuSeparator } from '#components/menu_separator/menu_separator';

const meta = {
	title: 'Example/MenuGroup',
	component: MenuGroup,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
			description: 'Group title — names the items for assistive tech.',
		},
		unstyled: {
			control: 'boolean',
			description: 'Strips the built-in label styling and spacing.',
		},
	},
	args: {
		label: 'Theme',
		children: (
			<>
				<MenuItem icon="i-mdi-white-balance-sunny" onClick={() => {}}>
					Light
				</MenuItem>
				<MenuItem icon="i-mdi-weather-night" onClick={() => {}}>
					Dark
				</MenuItem>
			</>
		),
	},
	decorators: [
		(Story) => (
			<div className="w-48 rounded-md border border-gray-200 py-1 shadow-sm dark:border-gray-700">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof MenuGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Unstyled: Story = {
	args: {
		unstyled: true,
		className: 'px-4 py-2 text-sm italic text-gray-500 dark:text-gray-400',
	},
};

export const ThemeChoice: Story = {
	args: {
		label: 'Theme',
		children: (
			<>
				<MenuItem
					icon="i-mdi-white-balance-sunny"
					selected={false}
					onClick={() => {}}
				>
					Light
				</MenuItem>
				<MenuItem icon="i-mdi-weather-night" selected onClick={() => {}}>
					Dark
				</MenuItem>
				<MenuItem icon="i-mdi-monitor" selected={false} onClick={() => {}}>
					System
				</MenuItem>
			</>
		),
	},
};

export const AfterAnUngroupedItem: Story = {
	render: (args) => (
		<>
			<MenuItem icon="i-mdi-pencil" onClick={() => {}}>
				Rename
			</MenuItem>
			<MenuSeparator />
			<MenuGroup {...args} />
		</>
	),
};
