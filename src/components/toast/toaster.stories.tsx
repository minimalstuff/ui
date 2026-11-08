import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { page } from 'vitest/browser';

import { Button } from '#components/button/button';
import { Modal } from '#components/modal/modal';
import { ModalFooter } from '#components/modal/modal_footer';
import { toast } from '#components/toast/toast';
import { Toaster, type ToasterProps } from '#components/toast/toaster';
import { useToastStore } from '#stores/toast_store/toast_store';
import { getPortalScope } from '#storybook/play_helpers';

const DESKTOP_VIEWPORT = { width: 1024, height: 768 };
const PHONE_VIEWPORT = { width: 390, height: 700 };
const EDGE_OFFSET_PX = 16;
const EDGE_TOLERANCE_PX = 4;
const STACK_SIZE = 5;

function ToasterDemo() {
	const [persistentCount, setPersistentCount] = useState(0);

	const handlePersistent = () => {
		toast(`Persistent ${persistentCount + 1}`, { duration: 0 });
		setPersistentCount((count) => count + 1);
	};
	const handleOpenModal = () => {
		void Modal.call({
			title: 'Settings',
			children: (
				<>
					<Button onClick={() => toast.success('Saved from the modal')}>
						Toast from the modal
					</Button>
					<ModalFooter>
						<Button>Footer action</Button>
					</ModalFooter>
				</>
			),
		});
	};
	const handleSheet = () => {
		void Modal.call({
			title: 'Sheet',
			phoneLayout: 'sheet',
			children: (
				<>
					<Button onClick={() => toast.success('Saved from the sheet')}>
						Toast from the sheet
					</Button>
					<ModalFooter>
						<Button>Footer action</Button>
					</ModalFooter>
				</>
			),
		});
	};

	return (
		<div className="flex flex-wrap gap-3">
			<Button color="neutral" onClick={() => toast('The list is up to date.')}>
				Info
			</Button>
			<Button
				onClick={() =>
					toast.success('Saved.', { description: 'Your changes are live.' })
				}
			>
				Success
			</Button>
			<Button
				color="warning"
				onClick={() => toast.warning('Disk almost full.')}
			>
				Warning
			</Button>
			<Button
				color="danger"
				onClick={() => toast.error('Could not update the list.')}
			>
				Error
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast('Item removed', {
						id: 'removed',
						action: { label: 'Undo', onClick: () => undefined },
					})
				}
			>
				Action
			</Button>
			<Button variant="outline" onClick={() => toast('Synced', { id: 'sync' })}>
				Same id
			</Button>
			<Button variant="outline" onClick={handlePersistent}>
				Add persistent
			</Button>
			<Button variant="outline" onClick={handleOpenModal}>
				Open modal
			</Button>
			<Button variant="outline" onClick={handleSheet}>
				Open sheet
			</Button>
		</div>
	);
}

function ToasterStage(props: Readonly<ToasterProps>) {
	return (
		<>
			<ToasterDemo />
			<Toaster {...props} />
		</>
	);
}

const meta = {
	title: 'Components/Toaster',
	component: ToasterStage,
	parameters: { layout: 'centered' },
	argTypes: {
		position: {
			control: 'select',
			options: [
				'top-left',
				'top-center',
				'top-right',
				'bottom-left',
				'bottom-center',
				'bottom-right',
			],
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
		},
	},
} satisfies Meta<typeof ToasterStage>;

export default meta;

type Story = StoryObj<typeof meta>;

function getRegion(canvasElement: Element) {
	return getPortalScope(canvasElement).getByRole('region', {
		name: 'Notifications',
	});
}

function getToasts(canvasElement: Element): HTMLElement[] {
	return within(getRegion(canvasElement)).queryAllByRole('listitem');
}

function getAnnouncer(role: 'status' | 'alert'): HTMLElement {
	const announcer = Array.from(
		document.querySelectorAll<HTMLElement>(`[role="${role}"]`)
	).find((element) => !element.closest('[aria-modal="true"]'));
	if (!announcer) throw new Error(`expected a ${role} announcer`);
	return announcer;
}

async function clickButton(canvasElement: HTMLElement, name: string) {
	const canvas = within(canvasElement);
	await userEvent.click(canvas.getByRole('button', { name }));
}

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await clickButton(canvasElement, 'Info');
		await clickButton(canvasElement, 'Success');
		await clickButton(canvasElement, 'Warning');
		await clickButton(canvasElement, 'Error');

		await waitFor(() => expect(getToasts(canvasElement)).toHaveLength(4));
		const tones = getToasts(canvasElement).map((item) => item.dataset.tone);
		await expect(tones).toEqual(['info', 'success', 'warning', 'danger']);
	},
};

export const WarningAndErrorStayUntilDismissed: Story = {
	play: async ({ canvasElement }) => {
		await clickButton(canvasElement, 'Info');
		await clickButton(canvasElement, 'Warning');
		await clickButton(canvasElement, 'Error');

		await waitFor(() => expect(getToasts(canvasElement)).toHaveLength(3));
		const [info, warning, error] = getToasts(canvasElement);
		await expect(
			info.querySelector('[data-ms-toast-timer-bar]')
		).not.toBeNull();
		await expect(warning.querySelector('[data-ms-toast-timer-bar]')).toBeNull();
		await expect(error.querySelector('[data-ms-toast-timer-bar]')).toBeNull();
	},
};

export const SameIdAnnouncedAgain: Story = {
	play: async ({ canvasElement }) => {
		await clickButton(canvasElement, 'Same id');
		await waitFor(() =>
			expect(getAnnouncer('status')).toHaveTextContent('Synced')
		);

		await clickButton(canvasElement, 'Same id');
		await waitFor(() => expect(getAnnouncer('status')).toBeEmptyDOMElement());
		await waitFor(() =>
			expect(getAnnouncer('status')).toHaveTextContent('Synced')
		);
		await expect(getToasts(canvasElement)).toHaveLength(1);
	},
};

export const AnnouncementLandsInTheRightAnnouncer: Story = {
	play: async ({ canvasElement }) => {
		await clickButton(canvasElement, 'Error');
		await waitFor(() =>
			expect(getAnnouncer('alert')).toHaveTextContent(
				'Could not update the list.'
			)
		);
		await expect(getAnnouncer('status')).toBeEmptyDOMElement();

		await clickButton(canvasElement, 'Info');
		await waitFor(() =>
			expect(getAnnouncer('status').textContent).toBe('The list is up to date.')
		);
		await expect(getRegion(canvasElement)).not.toContainElement(
			getAnnouncer('status')
		);
	},
};

export const FullStackEvictsButSparesTheFocusedToast: Story = {
	play: async ({ canvasElement }) => {
		await Array.from({ length: STACK_SIZE }).reduce<Promise<void>>(
			(previous) =>
				previous.then(() => clickButton(canvasElement, 'Add persistent')),
			Promise.resolve()
		);
		await waitFor(() =>
			expect(getToasts(canvasElement)).toHaveLength(STACK_SIZE)
		);

		const firstClose = within(getToasts(canvasElement)[0]).getByRole('button', {
			name: 'Close notification',
		});
		firstClose.focus();
		await waitFor(() =>
			expect(useToastStore.getState().entries[0]?.isPinned).toBe(true)
		);
		toast('Persistent 6', { duration: 0 });

		await waitFor(async () => {
			const texts = getToasts(canvasElement).map((item) => item.textContent);
			await expect(texts).toHaveLength(STACK_SIZE);
			await expect(texts[0]).toContain('Persistent 1');
			await expect(texts.join(' ')).not.toContain('Persistent 2');
			await expect(texts.join(' ')).toContain('Persistent 6');
		});
	},
};

export const FocusMovesToTheNextToastOnClose: Story = {
	play: async ({ canvasElement }) => {
		await clickButton(canvasElement, 'Add persistent');
		await clickButton(canvasElement, 'Add persistent');
		await waitFor(() => expect(getToasts(canvasElement)).toHaveLength(2));
		const [first, second] = getToasts(canvasElement);
		const firstClose = within(first).getByRole('button', {
			name: 'Close notification',
		});
		firstClose.focus();

		await userEvent.keyboard('{Enter}');

		await waitFor(() =>
			expect(second.contains(document.activeElement)).toBe(true)
		);
	},
};

export const OverAModalKeepsItsCloseButtonClickable: Story = {
	play: async ({ canvasElement }) => {
		const body = getPortalScope(canvasElement);
		await clickButton(canvasElement, 'Open modal');
		const dialog = await body.findByRole('dialog', { name: 'Settings' });
		await userEvent.click(
			within(dialog).getByRole('button', { name: 'Toast from the modal' })
		);
		await waitFor(() => expect(getToasts(canvasElement)).toHaveLength(1));

		const closeButton = within(dialog).getByRole('button', { name: 'Close' });
		const rect = closeButton.getBoundingClientRect();
		const hit = document.elementFromPoint(
			rect.left + rect.width / 2,
			rect.top + rect.height / 2
		);
		await expect(closeButton.contains(hit)).toBe(true);

		const slot = dialog.querySelector('[data-ms-toast-announcer="polite"]');
		await waitFor(() => expect(slot).toHaveTextContent('Saved from the modal'));
		await expect(getAnnouncer('status')).toBeEmptyDOMElement();

		await userEvent.click(closeButton);
		await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
	},
};

export const OverAPhoneSheetKeepsItsFooterClickable: Story = {
	play: async ({ canvasElement }) => {
		await page.viewport(PHONE_VIEWPORT.width, PHONE_VIEWPORT.height);
		try {
			const body = getPortalScope(canvasElement);
			await clickButton(canvasElement, 'Open sheet');
			const dialog = await body.findByRole('dialog', { name: 'Sheet' });
			await userEvent.click(
				within(dialog).getByRole('button', { name: 'Toast from the sheet' })
			);
			await waitFor(() => expect(getToasts(canvasElement)).toHaveLength(1));

			const region = getRegion(canvasElement);
			await waitFor(() =>
				expect(region.getBoundingClientRect().top).toBeLessThan(
					PHONE_VIEWPORT.height / 2
				)
			);
			const footerButton = within(dialog).getByRole('button', {
				name: 'Footer action',
			});
			const rect = footerButton.getBoundingClientRect();
			const hit = document.elementFromPoint(
				rect.left + rect.width / 2,
				rect.top + rect.height / 2
			);
			await expect(footerButton.contains(hit)).toBe(true);
		} finally {
			await page.viewport(DESKTOP_VIEWPORT.width, DESKTOP_VIEWPORT.height);
		}
	},
};

const SHORT_VIEWPORT = { width: 320, height: 256 };

export const ShortViewportKeepsEveryCloseButtonReachable: Story = {
	play: async ({ canvasElement }) => {
		await page.viewport(SHORT_VIEWPORT.width, SHORT_VIEWPORT.height);
		try {
			await Array.from({ length: STACK_SIZE }).reduce<Promise<void>>(
				(previous) =>
					previous.then(() => clickButton(canvasElement, 'Add persistent')),
				Promise.resolve()
			);
			await waitFor(() =>
				expect(getToasts(canvasElement)).toHaveLength(STACK_SIZE)
			);

			const oldestClose = within(getToasts(canvasElement)[0]).getByRole(
				'button',
				{
					name: 'Close notification',
				}
			);
			oldestClose.focus();

			await waitFor(async () => {
				const rect = oldestClose.getBoundingClientRect();
				await expect(rect.top).toBeGreaterThanOrEqual(0);
				await expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight);
				const hit = document.elementFromPoint(
					rect.left + rect.width / 2,
					rect.top + rect.height / 2
				);
				await expect(oldestClose.contains(hit)).toBe(true);
			});
		} finally {
			await page.viewport(DESKTOP_VIEWPORT.width, DESKTOP_VIEWPORT.height);
		}
	},
};

export const RaisedOffsetKeepsTheStackInsideTheViewport: Story = {
	play: async ({ canvasElement }) => {
		const RAISED_OFFSET = '6rem';
		await page.viewport(SHORT_VIEWPORT.width, SHORT_VIEWPORT.height);
		document.documentElement.style.setProperty(
			'--ms-toast-offset-bottom',
			RAISED_OFFSET
		);
		try {
			await Array.from({ length: STACK_SIZE }).reduce<Promise<void>>(
				(previous) =>
					previous.then(() => clickButton(canvasElement, 'Add persistent')),
				Promise.resolve()
			);
			await waitFor(() =>
				expect(getToasts(canvasElement)).toHaveLength(STACK_SIZE)
			);

			const rect = getRegion(canvasElement).getBoundingClientRect();
			await expect(rect.top).toBeGreaterThanOrEqual(0);
			await expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight);
		} finally {
			document.documentElement.style.removeProperty('--ms-toast-offset-bottom');
			await page.viewport(DESKTOP_VIEWPORT.width, DESKTOP_VIEWPORT.height);
		}
	},
};

export const KeyboardJumpAndEscape: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await clickButton(canvasElement, 'Add persistent');
		await waitFor(() => expect(getToasts(canvasElement)).toHaveLength(1));
		const pageButton = canvas.getByRole('button', { name: 'Info' });
		pageButton.focus();

		await userEvent.keyboard('{F8}');
		await waitFor(() =>
			expect(document.activeElement).toBe(getRegion(canvasElement))
		);

		await userEvent.tab();
		const closeButton = within(getToasts(canvasElement)[0]).getByRole(
			'button',
			{
				name: 'Close notification',
			}
		);
		await expect(document.activeElement).toBe(closeButton);

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(getToasts(canvasElement)).toHaveLength(0));
		await expect(document.activeElement).toBe(pageButton);
	},
};

type Corner = { isTop: boolean; horizontal: 'left' | 'center' | 'right' };

async function expectToasterAtCorner(
	canvasElement: HTMLElement,
	{ isTop, horizontal }: Readonly<Corner>
) {
	await page.viewport(DESKTOP_VIEWPORT.width, DESKTOP_VIEWPORT.height);
	await clickButton(canvasElement, 'Info');
	await waitFor(() => expect(getToasts(canvasElement)).toHaveLength(1));
	const rect = getToasts(canvasElement)[0].getBoundingClientRect();

	await waitFor(async () => {
		const verticalGap = isTop ? rect.top : window.innerHeight - rect.bottom;
		await expect(Math.abs(verticalGap - EDGE_OFFSET_PX)).toBeLessThan(
			EDGE_TOLERANCE_PX
		);
		if (horizontal === 'center')
			await expect(
				Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2)
			).toBeLessThan(EDGE_TOLERANCE_PX);
		else {
			const horizontalGap =
				horizontal === 'left' ? rect.left : window.innerWidth - rect.right;
			await expect(Math.abs(horizontalGap - EDGE_OFFSET_PX)).toBeLessThan(
				EDGE_TOLERANCE_PX
			);
		}
	});
}

export const TopLeft: Story = {
	args: { position: 'top-left' },
	play: ({ canvasElement }) =>
		expectToasterAtCorner(canvasElement, { isTop: true, horizontal: 'left' }),
};

export const TopCenter: Story = {
	args: { position: 'top-center' },
	play: ({ canvasElement }) =>
		expectToasterAtCorner(canvasElement, { isTop: true, horizontal: 'center' }),
};

export const TopRight: Story = {
	args: { position: 'top-right' },
	play: ({ canvasElement }) =>
		expectToasterAtCorner(canvasElement, { isTop: true, horizontal: 'right' }),
};

export const BottomLeft: Story = {
	args: { position: 'bottom-left' },
	play: ({ canvasElement }) =>
		expectToasterAtCorner(canvasElement, { isTop: false, horizontal: 'left' }),
};

export const BottomCenter: Story = {
	args: { position: 'bottom-center' },
	play: ({ canvasElement }) =>
		expectToasterAtCorner(canvasElement, {
			isTop: false,
			horizontal: 'center',
		}),
};

export const BottomRight: Story = {
	args: { position: 'bottom-right' },
	play: ({ canvasElement }) =>
		expectToasterAtCorner(canvasElement, { isTop: false, horizontal: 'right' }),
};
