import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '#components/button/button';
import { Tooltip } from '#components/tooltip/tooltip';
import { IconButton } from '#components/icon_button/icon_button';
import {
	expectFocusOn,
	getPortalScope,
} from '../../../.storybook/play_helpers';

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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Delete' });

		await userEvent.tab();
		await expectFocusOn(trigger);

		const tooltip = await body.findByRole('tooltip');
		await expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);

		await userEvent.keyboard('{Escape}');
		await waitFor(async () => {
			await expect(body.queryByRole('tooltip')).not.toBeInTheDocument();
		});
		await expectFocusOn(trigger);
	},
};

export const WithOwnDescription: Story = {
	render: () => (
		<div className="flex items-center gap-2">
			<Tooltip content="Delete">
				<IconButton
					icon="i-mdi-delete"
					aria-label="Delete"
					color="danger"
					aria-describedby="delete-hint"
				/>
			</Tooltip>
			<p id="delete-hint">This action cannot be undone</p>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Delete' });

		trigger.blur();
		await userEvent.unhover(trigger);
		await waitFor(async () => {
			await expect(trigger).toHaveAttribute('aria-describedby', 'delete-hint');
		});

		await userEvent.tab();
		await expectFocusOn(trigger);

		const tooltip = await body.findByRole('tooltip');
		await waitFor(async () => {
			const describedBy = trigger.getAttribute('aria-describedby');
			await expect(describedBy).toContain('delete-hint');
			await expect(describedBy).toContain(tooltip.id);
		});
	},
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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Copy link' });

		await userEvent.tab();
		await expectFocusOn(trigger);

		await userEvent.keyboard('{Enter}');
		await waitFor(async () => {
			await expect(body.getByRole('status')).toHaveTextContent('Copied!');
		});
	},
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
