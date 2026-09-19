import type { Meta, StoryObj } from '@storybook/react-vite';
import { fireEvent, userEvent, within } from 'storybook/test';

import { MenuItem } from '#components/menu_item/menu_item';
import { ContextMenu } from '#components/context_menu/context_menu';
import {
	expectFocusOn,
	getPortalScope,
} from '../../../.storybook/play_helpers';

const meta = {
	title: 'Example/ContextMenu',
	component: ContextMenu,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
		},
	},
	args: {
		'aria-label': 'File actions',
		items: (
			<>
				<MenuItem icon="i-mdi-pencil" onClick={() => {}}>
					Edit
				</MenuItem>
				<MenuItem icon="i-mdi-content-copy" onClick={() => {}}>
					Duplicate
				</MenuItem>
				<MenuItem icon="i-mdi-delete" danger onClick={() => {}}>
					Delete
				</MenuItem>
			</>
		),
		children: (
			<div
				tabIndex={0}
				role="region"
				aria-label="File"
				className="flex h-32 w-64 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400"
			>
				<span>Right-click me</span>
				<span className="text-xs">
					Right-click, or focus and press Shift+F10
				</span>
			</div>
		),
	},
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const region = canvas.getByRole('region', { name: 'File' });

		await step('Tab focuses the right-click region', async () => {
			await userEvent.tab();
			await expectFocusOn(region);
		});

		await step(
			'contextmenu (Shift+F10 / the Menu key) opens the menu, focused on Edit',
			async () => {
				await fireEvent.contextMenu(region, { clientX: 0, clientY: 0 });
				const menu = await body.findByRole('menu', { name: 'File actions' });
				await expectFocusOn(within(menu).getByText('Edit'));
			}
		);
	},
};
