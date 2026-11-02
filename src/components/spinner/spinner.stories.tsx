import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Spinner } from '#components/spinner/spinner';

const meta = {
	title: 'Components/Spinner',
	component: Spinner,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
			description: 'Icon and text size',
		},
		label: {
			control: 'text',
			description:
				'Visible text. Without it, the loading label is announced to screen readers only',
		},
		unstyled: {
			control: 'boolean',
			description: 'Strip all built-in styling',
		},
	},
	args: {
		size: 'md',
	},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('status')).toHaveTextContent('Loading');
	},
};

export const WithLabel: Story = {
	args: { label: 'Saving changes' },
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-6">
			{(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
				<Spinner key={size} size={size} label={size} />
			))}
		</div>
	),
};
