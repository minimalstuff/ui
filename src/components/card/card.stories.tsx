import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from '#components/card/card';
import { Button } from '#components/button/button';

const meta = {
	title: 'Example/Card',
	component: Card,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		padding: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg'],
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
		},
		headingLevel: {
			control: 'select',
			options: [2, 3, 4],
			description: 'Heading level of the title — match the page hierarchy.',
		},
		unstyled: {
			control: 'boolean',
			description: 'Strips surface, border, radius and padding.',
		},
	},
	args: {
		children: (
			<p className="text-sm text-gray-700 dark:text-gray-300">
				sonny@example.com
			</p>
		),
	},
	decorators: [
		(Story) => (
			<div className="w-96">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTitle: Story = {
	args: {
		title: 'Email address',
	},
};

export const WithDescription: Story = {
	args: {
		title: 'Email address',
		description: 'The address you sign in with, and where recovery links go.',
	},
};

export const WithActions: Story = {
	args: {
		title: 'API tokens',
		actions: (
			<Button variant="outline" color="neutral" size="sm">
				Create token
			</Button>
		),
		children: (
			<p className="text-sm text-gray-700 dark:text-gray-300">No token yet.</p>
		),
	},
};

export const SmallPadding: Story = {
	args: {
		title: 'Active sessions',
		padding: 'sm',
	},
};

export const NestedHeadingLevel: Story = {
	args: {
		title: 'Import',
		description: 'Sits under an existing section heading.',
		headingLevel: 3,
	},
};

export const Unstyled: Story = {
	args: {
		title: 'Active sessions',
		unstyled: true,
	},
};
