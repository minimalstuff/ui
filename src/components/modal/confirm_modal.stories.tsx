import { Button } from '#components/button/button';
import { ConfirmModal } from '#components/modal/confirm_modal';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

type ConfirmModalWrapperProps = Omit<
	React.ComponentProps<typeof ConfirmModal>,
	'isOpen' | 'onClose' | 'onConfirm'
> & { defaultOpen?: boolean };

function ConfirmModalWrapper({
	defaultOpen = false,
	title,
	children,
	confirmLabel,
	cancelLabel,
	confirmColor,
	loading,
}: ConfirmModalWrapperProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Open confirm</Button>
			<ConfirmModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onConfirm={async () => {
					await new Promise((r) => setTimeout(r, 800));
				}}
				title={title}
				confirmLabel={confirmLabel}
				cancelLabel={cancelLabel}
				confirmColor={confirmColor}
				loading={loading}
			>
				{children}
			</ConfirmModal>
		</>
	);
}

const meta = {
	title: 'Example/ConfirmModal',
	component: ConfirmModalWrapper,
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
		loading: {
			control: 'boolean',
			description: 'External loading state',
		},
		defaultOpen: {
			control: 'boolean',
			description: 'Open by default',
		},
	},
	args: {
		title: 'Confirm action',
		confirmLabel: 'Confirm',
		cancelLabel: 'Cancel',
		confirmColor: 'blue',
		defaultOpen: false,
	},
	render: (args) => <ConfirmModalWrapper {...args} />,
} satisfies Meta<typeof ConfirmModalWrapper>;

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

export const Loading: Story = {
	args: {
		title: 'Processing…',
		children: 'Please wait while we complete the action.',
		loading: true,
		defaultOpen: false,
	},
};
