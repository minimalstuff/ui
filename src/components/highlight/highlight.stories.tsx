import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Highlight } from '#components/highlight/highlight';

const meta = {
	title: 'Components/Highlight',
	component: Highlight,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		text: {
			control: 'text',
			description: 'Full text to render',
		},
		ranges: {
			description:
				'Flat [start0, end0, start1, end1, ...] pairs, ascending and non-overlapping, marking the matched substrings',
		},
	},
	args: {
		text: 'The quick brown fox jumps over the lazy dog',
		ranges: [4, 9, 16, 19],
	},
	decorators: [
		(Story) => (
			<div className="text-gray-700 dark:text-gray-300">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Highlight>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoMatches: Story = {
	args: {
		ranges: [],
	},
};

export const Unstyled: Story = {
	args: {
		unstyled: true,
		markClassName: 'bg-pink-200 px-0.5 font-semibold text-pink-900',
	},
	play: async ({ canvas }) => {
		const mark = canvas.getByText('quick');
		await expect(mark).toHaveClass('bg-pink-200');
		await expect(mark).not.toHaveClass('bg-yellow-200');
	},
};
