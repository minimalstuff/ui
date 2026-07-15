import type { Meta, StoryObj } from '@storybook/react-vite';

import { Modal } from '#components/modal/modal';
import { Button } from '#components/button/button';
import { ConfirmModal } from '#components/modal/confirm_modal';
import { ModalProvider } from '#components/modal_provider/modal_provider';

function ModalProviderDemo() {
	const handleOpenStandard = () => {
		void Modal.call({
			title: 'Standard modal',
			children: 'Content from the modal call.',
			size: 'md',
		});
	};

	const handleOpenConfirm = () => {
		void ConfirmModal.call({
			title: 'Confirm action',
			children: 'Do you want to proceed?',
			confirmLabel: 'Yes',
			cancelLabel: 'No',
			onConfirm: async () => {
				await new Promise((r) => setTimeout(r, 500));
			},
		});
	};

	const handleOpenDangerConfirm = () => {
		void ConfirmModal.call({
			title: 'Delete item?',
			children: 'This action cannot be undone.',
			confirmLabel: 'Delete',
			cancelLabel: 'Cancel',
			confirmColor: 'red',
			onConfirm: async () => {
				await new Promise((r) => setTimeout(r, 500));
			},
		});
	};

	return (
		<div className="flex flex-wrap gap-3">
			<Button onClick={handleOpenStandard}>Open standard modal</Button>
			<Button variant="secondary" onClick={handleOpenConfirm}>
				Open confirm modal
			</Button>
			<Button variant="danger" onClick={handleOpenDangerConfirm}>
				Open danger confirm
			</Button>
		</div>
	);
}

const meta = {
	title: 'Example/ModalProvider',
	component: ModalProvider,
	parameters: {
		layout: 'centered',
		skipGlobalModalRoot: true,
	},
	tags: ['autodocs'],
	render: () => (
		<>
			<ModalProvider />
			<ModalProviderDemo />
		</>
	),
} satisfies Meta<typeof ModalProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
