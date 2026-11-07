import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '#components/button/button';
import { Drawer } from '#components/drawer/drawer';
import { IconButton } from '#components/icon_button/icon_button';
import { Menu, type MenuSide } from '#components/menu/menu';
import { MenuItem } from '#components/menu_item/menu_item';
import { MenuSeparator } from '#components/menu_separator/menu_separator';
import { Modal } from '#components/modal/modal';
import {
	expectDialogHasNoTransform,
	expectFocusOn,
	expectMenuReachableInDialog,
	getPortalScope,
	openMenu,
	pressKeysAndExpectFocusInDialog,
	waitForDialogOpen,
	waitForMenuReady,
	waitForRemoval,
} from '#storybook/play_helpers';

const TAB = '{Tab}';
const SHIFT_TAB = '{Shift>}{Tab}{/Shift}';

const MANY_MENU_ITEMS = Array.from({ length: 8 }, (_, index) => (
	<MenuItem key={index} icon="i-mdi-circle-small" onClick={() => {}}>
		Action {index + 1}
	</MenuItem>
));

const OptionsMenu = ({ side }: Readonly<{ side?: MenuSide }>) => (
	<Menu
		side={side}
		trigger={<IconButton icon="i-mdi-dots-vertical" aria-label="Options" />}
	>
		{MANY_MENU_ITEMS}
	</Menu>
);

function ModalWithMenuTrigger() {
	const handleOpen = () => {
		void Modal.call({
			title: 'Item actions',
			children: (
				<div className="flex flex-col gap-4">
					<p>A short dialog.</p>
					<div>
						<OptionsMenu />
					</div>
				</div>
			),
		});
	};

	return <Button onClick={handleOpen}>Open modal</Button>;
}

function DrawerWithMenuTrigger() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Open drawer</Button>
			<Drawer
				title="Item actions"
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<OptionsMenu side="left" />
			</Drawer>
		</>
	);
}

async function expectMenuInDialogSurvivesTab(
	body: ReturnType<typeof getPortalScope>,
	dialog: HTMLElement
): Promise<void> {
	await waitForDialogOpen(dialog);

	const openOptionsMenu = () =>
		openMenu(
			within(dialog).getByRole('button', { name: 'Options' }),
			'Options'
		);

	await expectMenuReachableInDialog(await openOptionsMenu(), dialog);

	const expectKeysCloseMenuAndKeepFocus = async (keys: string) => {
		await pressKeysAndExpectFocusInDialog(dialog, keys);
		await waitForRemoval(() => body.queryByRole('menu'));
	};

	await expectKeysCloseMenuAndKeepFocus(TAB);
	await openOptionsMenu();
	await expectKeysCloseMenuAndKeepFocus(SHIFT_TAB);
}

const meta = {
	title: 'Components/Menu',
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
				await waitForMenuReady(menu);
				const firstItem = within(menu).getByText('Move up');
				const style = getComputedStyle(firstItem);
				await expect(style.outlineStyle).toBe('solid');
				await expect(style.outlineWidth).toBe('2px');
				await expect(style.outlineOffset).toBe('-2px');
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
				await waitForRemoval(() => body.queryByRole('menu'));
				await waitFor(() => expectFocusOn(trigger));
			}
		);

		await step(
			'ArrowUp on the trigger reopens the menu focused on the last item',
			async () => {
				await userEvent.keyboard('{ArrowUp}');
				const menu = await body.findByRole('menu', { name: 'Options' });
				await waitFor(() => expectFocusOn(within(menu).getByText('Delete')));
			}
		);
	},
};

export const ReducedMotion: Story = {
	globals: { motion: 'reduced' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const menu = await openMenu(
			canvas.getByRole('button', { name: 'Options' }),
			'Options'
		);
		const scalesWhenClosed: string[] = [];
		const closedObserver = new MutationObserver(() => {
			if (menu.getAttribute('data-state') !== 'closed') return;
			scalesWhenClosed.push(getComputedStyle(menu).scale);
		});
		closedObserver.observe(menu, {
			attributes: true,
			attributeFilter: ['data-state'],
		});

		await userEvent.keyboard('{Escape}');
		await waitFor(async () => {
			await expect(scalesWhenClosed).toHaveLength(1);
		});
		closedObserver.disconnect();

		await expect(['none', '1']).toContain(scalesWhenClosed[0]);
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

export const InModal: Story = {
	render: () => <ModalWithMenuTrigger />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
		const dialog = await body.findByRole('dialog', { name: 'Item actions' });

		await expectMenuInDialogSurvivesTab(body, dialog);
	},
};

export const InDrawer: Story = {
	render: () => <DrawerWithMenuTrigger />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Open drawer' }));
		const dialog = await body.findByRole('dialog', { name: 'Item actions' });

		await expectDialogHasNoTransform(dialog);
		await expectMenuInDialogSurvivesTab(body, dialog);
	},
};

export const Unstyled: Story = {
	render: () => (
		<Menu
			unstyled
			panelClassName="mt-1 min-w-40 rounded-xl bg-indigo-950 p-2 text-white shadow-2xl"
			trigger={<IconButton icon="i-mdi-dots-vertical" aria-label="Options" />}
		>
			<MenuItem
				unstyled
				className="rounded-lg px-3 py-2 text-sm text-white hover:bg-indigo-800 focus-visible:bg-indigo-800"
				onClick={() => {}}
			>
				Edit
			</MenuItem>
			<MenuItem
				unstyled
				className="rounded-lg px-3 py-2 text-sm text-white hover:bg-indigo-800 focus-visible:bg-indigo-800"
				onClick={() => {}}
			>
				Duplicate
			</MenuItem>
		</Menu>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Options' }));

		const menu = await body.findByRole('menu', { name: 'Options' });
		await expect(menu).toHaveClass('bg-indigo-950');
		await expect(
			within(menu).getByRole('menuitem', { name: 'Edit' })
		).toBeVisible();
	},
};
