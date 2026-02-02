import { Button } from '#components/button/button';
import { ModalProvider } from '#components/modal_provider/modal_provider';
import { useModalStore } from '#stores/modal_store/modal_store';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ModalStoreDemo() {
	const open = useModalStore((s) => s.open);
	const openConfirm = useModalStore((s) => s.openConfirm);
	const closeAll = useModalStore((s) => s.closeAll);
	const modals = useModalStore((s) => s.modals);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-3">
				<Button
					onClick={() =>
						open({
							title: 'Standard modal',
							children: 'Opened via useModalStore().open()',
							size: 'md',
						})
					}
				>
					open()
				</Button>
				<Button
					variant="secondary"
					onClick={() =>
						openConfirm({
							title: 'Confirm',
							confirmLabel: 'OK',
							cancelLabel: 'Cancel',
							onConfirm: async () => {},
						})
					}
				>
					openConfirm()
				</Button>
				<Button
					variant="danger"
					onClick={closeAll}
					disabled={modals.length === 0}
				>
					closeAll()
				</Button>
			</div>
			<p className="text-sm text-gray-500 dark:text-gray-400">
				Open modals: {modals.length}
			</p>
		</div>
	);
}

const meta = {
	title: 'Stores/ModalStore',
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	render: () => (
		<>
			<ModalProvider />
			<ModalStoreDemo />
		</>
	),
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
