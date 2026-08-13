import type { Meta, StoryObj } from '@storybook/react-vite';

import { Highlight } from '#components/highlight/highlight';

const meta = {
	title: 'Example/Highlight',
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
