import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '#components/button/button';
import { Modal } from '#components/modal/modal';
import {
	Popover,
	type PopoverOpenChangeDetails,
	type PopoverProps,
} from '#components/popover/popover';
import { RadioOptions } from '#components/radio_options/radio_options';
import { Tabs } from '#components/tabs/tabs';
import { expectWithinViewport, getPortalScope } from '#storybook/play_helpers';

const ORDER_OPTIONS = ['Newest', 'Oldest', 'Most popular'];

const DENSITY_ITEMS = [
	{ title: 'Compact', content: <p>Compact rows.</p> },
	{ title: 'Comfortable', content: <p>Comfortable rows.</p> },
];

const FilterContent = () => (
	<div className="flex flex-col gap-3">
		<RadioOptions label="Order" options={ORDER_OPTIONS} defaultValue="Newest" />
		<Tabs variant="segmented" items={DENSITY_ITEMS} aria-label="Density" />
	</div>
);

const meta = {
	title: 'Components/Popover',
	component: Popover,
	tags: ['autodocs'],
	args: {
		'aria-label': 'Display options',
		trigger: <Button>Display</Button>,
		children: <FilterContent />,
	},
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Display' }));
		const dialog = await body.findByRole('dialog', {
			name: 'Display options',
		});
		await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'open'));

		await userEvent.click(body.getByRole('radio', { name: 'Oldest' }));
		await expect(dialog).toHaveAttribute('data-state', 'open');

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(dialog).not.toBeInTheDocument());
		await expect(canvas.getByRole('button', { name: 'Display' })).toHaveFocus();
	},
};

export const AlignEnd: Story = { args: { align: 'end' } };

export const SideTop: Story = { args: { side: 'top' } };

function ControlledPopover(args: Readonly<PopoverProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const [log, setLog] = useState<string[]>([]);

	const handleOpenChange = (
		next: boolean,
		details: PopoverOpenChangeDetails
	) => {
		setIsOpen(next);
		setLog((previous) => [
			...previous,
			`onOpenChange(${next}, ${details.reason})`,
		]);
	};

	return (
		<div className="flex flex-col gap-3">
			<Popover {...args} isOpen={isOpen} onOpenChange={handleOpenChange} />
			<pre role="log" aria-label="Event log">
				{log.join('\n')}
			</pre>
		</div>
	);
}

export const Controlled: Story = {
	render: (args) => <ControlledPopover {...args} />,
};

const ModalWithPopover = () => {
	const handleOpen = () => {
		void Modal.call({
			title: 'Settings',
			children: (
				<Popover
					aria-label="Display options"
					trigger={<Button>Display</Button>}
				>
					<FilterContent />
				</Popover>
			),
		});
	};

	return <Button onClick={handleOpen}>Open modal</Button>;
};

export const InModal: Story = {
	render: () => <ModalWithPopover />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
		await body.findByRole('dialog', { name: 'Settings' });
		await userEvent.click(body.getByRole('button', { name: 'Display' }));
		const popover = await body.findByRole('dialog', {
			name: 'Display options',
		});

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(popover).not.toBeInTheDocument());
		await expect(
			body.getByRole('dialog', { name: 'Settings' })
		).toBeInTheDocument();
	},
};

const TALL_CONTENT_HEIGHT_PX = 3000;

export const TallContent: Story = {
	args: {
		children: (
			<div
				className="flex flex-col justify-between"
				style={{ height: TALL_CONTENT_HEIGHT_PX }}
			>
				<button type="button">First action</button>
				<button type="button">Last action</button>
			</div>
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Display' }));
		const dialog = await body.findByRole('dialog', {
			name: 'Display options',
		});
		await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'open'));
		await expectWithinViewport(dialog);

		const lastAction = body.getByRole('button', { name: 'Last action' });
		await userEvent.tab();
		await waitFor(() => expect(lastAction).toHaveFocus());
		await waitFor(() => expectWithinViewport(lastAction));
	},
};
