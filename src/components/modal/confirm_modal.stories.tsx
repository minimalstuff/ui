import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '#components/button/button';
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
			options: ['red', 'blue', 'green'],
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
		confirmColor: 'blue',
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
		confirmColor: 'red',
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
