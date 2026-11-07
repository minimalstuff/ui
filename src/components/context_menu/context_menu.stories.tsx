import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '#components/button/button';
import { ContextMenu } from '#components/context_menu/context_menu';
import { MenuItem } from '#components/menu_item/menu_item';
import { Modal } from '#components/modal/modal';
import {
	expectFocusOn,
	expectMenuReachableInDialog,
	getPortalScope,
	pressKeysAndExpectFocusInDialog,
	waitForDialogOpen,
	waitForMenuReady,
	waitForRemoval,
} from '#storybook/play_helpers';

const TAB = '{Tab}';
const SHIFT_TAB = '{Shift>}{Tab}{/Shift}';

const MANY_MENU_ITEMS = Array.from({ length: 8 }, (_, index) => (
	<MenuItem key={index} onClick={() => {}}>
		Action {index + 1}
	</MenuItem>
));

function ModalWithContextMenuTrigger() {
	const handleOpen = () => {
		void Modal.call({
			title: 'File area',
			children: (
				<ContextMenu aria-label="File actions" items={MANY_MENU_ITEMS}>
					<div
						// oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the story needs a keyboard-focusable target to exercise the context menu key
						tabIndex={0}
						role="region"
						aria-label="File"
						className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm"
					>
						Right-click me
					</div>
				</ContextMenu>
			),
		});
	};

	return <Button onClick={handleOpen}>Open modal</Button>;
}

const meta = {
	title: 'Components/ContextMenu',
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
				// oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the story needs a keyboard-focusable target to exercise the context menu key
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
				await waitFor(() => expectFocusOn(within(menu).getByText('Edit')));
			}
		);
	},
};

export const InModal: Story = {
	render: () => <ModalWithContextMenuTrigger />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
		const dialog = await body.findByRole('dialog', { name: 'File area' });
		await waitForDialogOpen(dialog);
		const region = within(dialog).getByRole('region', { name: 'File' });

		const openMenu = async () => {
			const { left, top } = region.getBoundingClientRect();
			await fireEvent.contextMenu(region, {
				clientX: left + 10,
				clientY: top + 10,
			});
			const menu = await body.findByRole('menu', { name: 'File actions' });
			await waitForMenuReady(menu);
			return menu;
		};

		await expectMenuReachableInDialog(await openMenu(), dialog);

		const expectKeysCloseMenuAndKeepFocus = async (keys: string) => {
			await pressKeysAndExpectFocusInDialog(dialog, keys);
			await waitForRemoval(() => body.queryByRole('menu'));
		};

		await expectKeysCloseMenuAndKeepFocus(TAB);
		await openMenu();
		await expectKeysCloseMenuAndKeepFocus(SHIFT_TAB);
	},
};

export const Unstyled: Story = {
	args: {
		unstyled: true,
		panelClassName:
			'rounded-xl bg-indigo-950 p-2 text-sm text-white shadow-2xl',
		items: (
			<>
				<MenuItem
					unstyled
					className="rounded-lg px-3 py-2 hover:bg-indigo-800 focus-visible:bg-indigo-800"
					onClick={() => {}}
				>
					Edit
				</MenuItem>
				<MenuItem
					unstyled
					className="rounded-lg px-3 py-2 hover:bg-indigo-800 focus-visible:bg-indigo-800"
					onClick={() => {}}
				>
					Duplicate
				</MenuItem>
			</>
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const region = canvas.getByRole('region', { name: 'File' });

		await fireEvent.contextMenu(region, { clientX: 100, clientY: 100 });

		const menu = await body.findByRole('menu', { name: 'File actions' });
		await expect(menu).toHaveClass('bg-indigo-950');
		await expect(
			within(menu).getByRole('menuitem', { name: 'Edit' })
		).toBeVisible();
	},
};
