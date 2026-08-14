import type { Meta, StoryObj } from '@storybook/react-vite';

import {
	MenuItem,
	type MenuItemButtonProps,
	type MenuItemLinkProps,
} from '#components/menu_item/menu_item';

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
} satisfies Meta<MenuItemButtonProps>;

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

export const Selected: Story = {
	args: {
		children: 'Dark',
		icon: 'i-mdi-weather-night',
		selected: true,
	},
};

export const NotSelected: Story = {
	args: {
		children: 'Light',
		icon: 'i-mdi-white-balance-sunny',
		selected: false,
	},
};

function renderLink(linkProps: Readonly<MenuItemLinkProps>) {
	return <MenuItem {...linkProps} />;
}

export const AsLink: Story = {
	render: () =>
		renderLink({
			icon: 'i-mdi-cog',
			href: '/settings',
			children: 'Settings',
		}),
};

export const AsExternalLink: Story = {
	render: () =>
		renderLink({
			icon: 'i-mdi-open-in-new',
			href: 'https://example.com',
			target: '_blank',
			children: 'Documentation',
		}),
};

export const DisabledLink: Story = {
	render: () =>
		renderLink({
			icon: 'i-mdi-cog',
			href: '/settings',
			disabled: true,
			children: 'Settings',
		}),
};
