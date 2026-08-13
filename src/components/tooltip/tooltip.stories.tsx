import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '#components/button/button';
import { Tooltip } from '#components/tooltip/tooltip';
import { IconButton } from '#components/icon_button/icon_button';

const meta = {
	title: 'Example/Tooltip',
	component: Tooltip,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		content: {
			control: 'text',
			description: 'Content shown inside the tooltip bubble',
		},
		position: {
			control: 'select',
			options: ['top', 'bottom', 'left', 'right'],
		},
		disabled: {
			control: 'boolean',
			description: 'Never show the tooltip',
		},
		showOnClick: {
			control: 'boolean',
			description: 'Show temporaryContent when the trigger is clicked',
		},
		temporaryContent: {
			control: 'text',
			description: 'Content shown for temporaryDuration after a click',
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
		},
	},
	args: {
		content: 'Helpful text',
		children: (
			<Button variant="outline" color="neutral">
				Hover me
			</Button>
		),
	},
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Positions: Story = {
	render: () => (
		<div className="flex items-center gap-12 p-12">
			{(['top', 'bottom', 'left', 'right'] as const).map((position) => (
				<Tooltip
					key={position}
					content={`Position: ${position}`}
					position={position}
				>
					<Button variant="outline" color="neutral">
						{position}
					</Button>
				</Tooltip>
			))}
		</div>
	),
};

export const OnIconButton: Story = {
	render: () => (
		<Tooltip content="Delete">
			<IconButton icon="i-mdi-delete" aria-label="Delete" color="danger" />
		</Tooltip>
	),
};

export const ClickToCopy: Story = {
	render: () => (
		<Tooltip
			content="Click to copy"
			temporaryContent="Copied!"
			showOnClick
			position="bottom"
		>
			<IconButton icon="i-mdi-content-copy" aria-label="Copy link" />
		</Tooltip>
	),
};

export const Disabled: Story = {
	render: () => (
		<Tooltip content="You will never see this" disabled>
			<Button variant="outline" color="neutral">
				Hover me
			</Button>
		</Tooltip>
	),
};
