import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from '#components/avatar/avatar';

const GITHUB_AVATAR = 'https://github.com/Sonny93.png';

const meta = {
	title: 'Example/Avatar',
	component: Avatar,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		name: {
			control: 'text',
			description: 'Full name — the initial is derived from it.',
		},
		src: {
			control: 'text',
			description:
				'Picture URL. Falls back to the initial when it fails to load.',
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
		},
		color: {
			control: 'select',
			options: ['primary', 'neutral', 'danger', 'success', 'warning'],
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
		},
		unstyled: {
			control: 'boolean',
			description: 'Strips color, border and radius; keeps the size.',
		},
	},
	args: {
		name: 'Sonny Dev',
	},
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Avatar name="Sonny Dev" size="xs" />
			<Avatar name="Sonny Dev" size="sm" />
			<Avatar name="Sonny Dev" size="md" />
			<Avatar name="Sonny Dev" size="lg" />
		</div>
	),
};

export const Colors: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Avatar name="Primary" color="primary" />
			<Avatar name="Neutral" color="neutral" />
			<Avatar name="Danger" color="danger" />
			<Avatar name="Success" color="success" />
			<Avatar name="Warning" color="warning" />
		</div>
	),
};

export const Square: Story = {
	args: {
		radius: 'md',
	},
};

export const WithPicture: Story = {
	args: {
		src: GITHUB_AVATAR,
		size: 'md',
	},
};

export const PictureSizes: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Avatar name="Sonny Dev" src={GITHUB_AVATAR} size="xs" />
			<Avatar name="Sonny Dev" src={GITHUB_AVATAR} size="sm" />
			<Avatar name="Sonny Dev" src={GITHUB_AVATAR} size="md" />
			<Avatar name="Sonny Dev" src={GITHUB_AVATAR} size="lg" />
		</div>
	),
};

export const SquarePicture: Story = {
	args: {
		src: GITHUB_AVATAR,
		size: 'lg',
		radius: 'md',
	},
};

export const BrokenPictureFallsBackToInitial: Story = {
	args: {
		src: 'https://example.com/missing-avatar.png',
		size: 'md',
	},
};

export const WithName: Story = {
	render: () => (
		<div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
			<Avatar name="Sonny Dev" />
			<span>Sonny Dev</span>
		</div>
	),
};
