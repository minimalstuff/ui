import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { AppBar } from '#components/app_bar/app_bar';
import { ThemeToggle } from '#components/theme_toggle/theme_toggle';

const meta = {
	title: 'Components/AppBar',
	component: AppBar,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	argTypes: {
		start: { control: false, description: 'Content on the left' },
		title: { control: false, description: 'Centered content' },
		end: { control: false, description: 'Content on the right' },
		startClassName: {
			control: 'text',
			description: 'Class for the start slot',
		},
		titleClassName: {
			control: 'text',
			description: 'Class for the title slot',
		},
		endClassName: { control: 'text', description: 'Class for the end slot' },
		unstyled: {
			control: 'boolean',
			description: 'Strip all built-in styling',
		},
	},
	args: {
		start: (
			<a href="/" className="font-medium hover:underline">
				Home
			</a>
		),
		title: 'Dashboard',
		end: <ThemeToggle size="sm" />,
	},
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('banner')).toBeInTheDocument();
		await expect(canvas.getByRole('link', { name: 'Home' })).toBeVisible();
	},
};

export const TitleOnly: Story = {
	args: { start: undefined, end: undefined },
};

export const Unstyled: Story = {
	args: {
		unstyled: true,
		className:
			'grid grid-cols-[1fr_auto_1fr] items-center border-b border-dashed border-gray-400 p-2',
	},
};
