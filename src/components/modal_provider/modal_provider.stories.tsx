import { Button } from '#components/button/button';
import { ModalProvider } from '#components/modal_provider/modal_provider';
import { useModalStore } from '#stores/modal_store/modal_store';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ModalProviderDemo() {
	const open = useModalStore((s) => s.open);
	const openConfirm = useModalStore((s) => s.openConfirm);

	return (
		<div className="flex flex-wrap gap-3">
			<Button
				onClick={() =>
					open({
						title: 'Standard modal',
						children: 'Content from the modal store.',
						size: 'md',
					})
				}
			>
				Open standard modal
			</Button>
			<Button
				variant="secondary"
				onClick={() =>
					openConfirm({
						title: 'Confirm action',
						children: 'Do you want to proceed?',
						confirmLabel: 'Yes',
						cancelLabel: 'No',
						onConfirm: async () => {
							await new Promise((r) => setTimeout(r, 500));
						},
					})
				}
			>
				Open confirm modal
			</Button>
			<Button
				variant="danger"
				onClick={() =>
					openConfirm({
						title: 'Delete item?',
						children: 'This action cannot be undone.',
						confirmLabel: 'Delete',
						cancelLabel: 'Cancel',
						confirmColor: 'red',
						onConfirm: async () => {
							await new Promise((r) => setTimeout(r, 500));
						},
					})
				}
			>
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
