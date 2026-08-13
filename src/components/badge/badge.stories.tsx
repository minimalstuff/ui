import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '#components/badge/badge';

const meta = {
	title: 'Example/Badge',
	component: Badge,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		color: {
			control: 'select',
			options: ['primary', 'neutral', 'success', 'danger', 'warning'],
		},
		variant: {
			control: 'select',
			options: ['solid', 'outline', 'subtle'],
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
		},
		children: {
			control: 'text',
		},
	},
	args: {
		children: 'Badge',
	},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllColors: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Badge color="primary">Primary</Badge>
			<Badge color="neutral">Neutral</Badge>
			<Badge color="success">Success</Badge>
			<Badge color="danger">Danger</Badge>
			<Badge color="warning">Warning</Badge>
		</div>
	),
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Badge color="danger" variant="solid">
				Solid
			</Badge>
			<Badge color="danger" variant="outline">
				Outline
			</Badge>
			<Badge color="danger" variant="subtle">
				Subtle
			</Badge>
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Badge size="xs">xs</Badge>
			<Badge size="sm">sm</Badge>
			<Badge size="md">md</Badge>
			<Badge size="lg">lg</Badge>
		</div>
	),
};
