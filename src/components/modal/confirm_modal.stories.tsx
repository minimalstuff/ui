import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '#components/button/button';
import {
	expectFocusOn,
	getPortalScope,
} from '../../../.storybook/play_helpers';
import {
	ConfirmModal,
	type ConfirmModalProps,
} from '#components/modal/confirm_modal';

function ConfirmModalTrigger(props: ConfirmModalProps) {
	const handleOpen = () => {
		void ConfirmModal.call(props);
	};

	return <Button onClick={handleOpen}>Open confirm</Button>;
}
// Pins the name the "Show code" panel reconstructs from `component.name` —
// without it, production minification mangles `ConfirmModalTrigger`.
ConfirmModalTrigger.displayName = 'ConfirmModal';

const meta = {
	title: 'Example/ConfirmModal',
	component: ConfirmModalTrigger,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		title: {
			control: 'text',
			description: 'Modal title',
		},
		confirmLabel: {
			control: 'text',
			description: 'Confirm button label',
		},
		cancelLabel: {
			control: 'text',
			description: 'Cancel button label',
		},
		confirmColor: {
			control: 'select',
			options: ['primary', 'danger', 'success'],
			description: 'Confirm button color',
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
			description: 'Border radius',
		},
	},
	args: {
		title: 'Confirm action',
		confirmLabel: 'Confirm',
		cancelLabel: 'Cancel',
		confirmColor: 'primary',
		onConfirm: async () => {
			await new Promise((r) => setTimeout(r, 800));
		},
	},
} satisfies Meta<typeof ConfirmModalTrigger>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Modal content goes here.',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Open confirm' });

		await step('open the confirm modal', async () => {
			await userEvent.click(trigger);
			await body.findByRole('alertdialog', { name: 'Confirm action' });
		});

		const alertDialog = body.getByRole('alertdialog');

		await step('is described by its body content', async () => {
			const describedById = alertDialog.getAttribute('aria-describedby');
			await expect(describedById).toBeTruthy();
			await expect(
				document.getElementById(describedById ?? '')
			).toHaveTextContent('Modal content goes here.');
		});

		await step('Cancel has initial focus', async () => {
			await expectFocusOn(body.getByRole('button', { name: 'Cancel' }));
		});

		await step('Tab moves focus to Confirm', async () => {
			await userEvent.tab();
			await expectFocusOn(body.getByRole('button', { name: 'Confirm' }));
		});

		await step(
			'Enter confirms; focus stays inside the alertdialog while it loads',
			async () => {
				await userEvent.keyboard('{Enter}');
				await waitFor(async () => {
					await expect(alertDialog.contains(document.activeElement)).toBe(true);
				});
				await userEvent.tab();
				await expect(alertDialog.contains(document.activeElement)).toBe(true);
			}
		);

		await step('closes once confirmed', async () => {
			await waitFor(async () => {
				await expect(body.queryByRole('alertdialog')).not.toBeInTheDocument();
			});
		});
	},
};

export const WithBody: Story = {
	args: {
		title: 'Delete item?',
		children:
			'This action cannot be undone. The item will be permanently removed.',
		confirmLabel: 'Delete',
		cancelLabel: 'Keep',
	},
};

export const Danger: Story = {
	args: {
		title: 'Delete account?',
		children: 'Your account and all data will be permanently deleted.',
		confirmLabel: 'Delete account',
		cancelLabel: 'Cancel',
		confirmColor: 'danger',
	},
};

export const CustomLabels: Story = {
	args: {
		title: 'Save changes?',
		children: 'You have unsaved changes. Do you want to save before leaving?',
		confirmLabel: 'Save',
		cancelLabel: 'Discard',
	},
};
