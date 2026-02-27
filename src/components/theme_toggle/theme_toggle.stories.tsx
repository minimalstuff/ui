import { ThemeToggle } from '#components/theme_toggle/theme_toggle';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Example/ThemeToggle',
	component: ThemeToggle,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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
