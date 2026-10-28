import type { Meta, StoryObj } from '@storybook/react-vite';

import { ThemeToggle } from '#components/theme_toggle/theme_toggle';

const meta = {
	title: 'Components/ThemeToggle',
	component: ThemeToggle,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		isTransitionEnabled: {
			control: 'boolean',
			description:
				'Animate the theme change with a view transition. Defaults to auto: enabled, except on WebKitGTK where it crashes the web process.',
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		tooltip: {
			control: 'boolean',
			description:
				'Show the aria-label in a tooltip. Also accepts a position or { position, content }.',
		},
		variant: {
			control: 'select',
			options: ['solid', 'outline', 'ghost', 'subtle', 'unstyled'],
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ChangeSize: Story = {
	args: {
		size: 'lg',
	},
};

export const WithTooltip: Story = {
	args: {
		tooltip: true,
	},
};

export const FullPage: Story = {
	render: () => (
		<div className="h-screen w-screen flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 shadow-sm">
			<span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
			<ThemeToggle />
		</div>
	),
};

export const FullPageWithoutTransition: Story = {
	args: {
		isTransitionEnabled: false,
	},
	render: () => (
		<div className="h-screen w-screen flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 shadow-sm">
			<span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
			<ThemeToggle isTransitionEnabled={false} />
		</div>
	),
};
