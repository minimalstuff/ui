import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, waitForElementToBeRemoved, within } from 'storybook/test';

import { Menu } from '#components/menu/menu';
import { MenuItem } from '#components/menu_item/menu_item';
import { IconButton } from '#components/icon_button/icon_button';
import { MenuSeparator } from '#components/menu_separator/menu_separator';
import {
	expectFocusOn,
	getPortalScope,
} from '../../../.storybook/play_helpers';

const meta = {
	title: 'Example/Menu',
	component: Menu,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		side: {
			control: 'select',
			options: ['top', 'bottom', 'left', 'right'],
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
		},
	},
	args: {
		trigger: (
			<IconButton icon="i-mdi-dots-vertical" aria-label="Options" size="sm" />
		),
		children: (
			<>
				<MenuItem icon="i-mdi-arrow-up" onClick={() => {}}>
					Move up
				</MenuItem>
				<MenuItem icon="i-mdi-arrow-down" onClick={() => {}}>
					Move down
				</MenuItem>
				<MenuSeparator />
				<MenuItem icon="i-mdi-delete" danger onClick={() => {}}>
					Delete
				</MenuItem>
			</>
		),
	},
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Options' });

		await step('Tab focuses the trigger', async () => {
			await userEvent.tab();
			await expectFocusOn(trigger);
		});

		await step(
			'ArrowDown opens the menu, named by the trigger, focused on the first item',
			async () => {
				await userEvent.keyboard('{ArrowDown}');
				const menu = await body.findByRole('menu', { name: 'Options' });
				await expectFocusOn(within(menu).getByText('Move up'));
			}
		);

		await step('typing "d" focuses Delete', async () => {
			await userEvent.keyboard('d');
			await expectFocusOn(body.getByText('Delete'));
		});

		await step(
			'Escape closes the menu and returns focus to the trigger',
			async () => {
				await userEvent.keyboard('{Escape}');
				await waitForElementToBeRemoved(() => body.queryByRole('menu'));
				await expectFocusOn(trigger);
			}
		);

		await step(
			'ArrowUp on the trigger reopens the menu focused on the last item',
			async () => {
				await userEvent.keyboard('{ArrowUp}');
				const menu = await body.findByRole('menu', { name: 'Options' });
				await expectFocusOn(within(menu).getByText('Delete'));
			}
		);

		await step('Escape closes the menu again', async () => {
			await userEvent.keyboard('{Escape}');
			await waitForElementToBeRemoved(() => body.queryByRole('menu'));
		});
	},
};

export const AlignEnd: Story = {
	args: {
		align: 'end',
	},
};

export const AlignCenter: Story = {
	args: {
		align: 'center',
	},
};

export const SideRight: Story = {
	args: {
		side: 'right',
	},
};
