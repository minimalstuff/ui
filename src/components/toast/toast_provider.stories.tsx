import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '#components/button/button';
import { ToastProvider } from '#components/toast/toast_provider';
import { useToast } from '#components/toast/use_toast';

function ToastDemo() {
	const { show } = useToast();

	return (
		<div className="flex flex-wrap gap-3">
			<Button
				color="neutral"
				onClick={() => show({ message: 'The list is up to date.' })}
			>
				Info
			</Button>
			<Button
				onClick={() =>
					show({
						message: 'The Apothecary Diaries: Plan to watch',
						tone: 'success',
						action: { label: 'Undo', onClick: () => undefined },
					})
				}
			>
				Success with action
			</Button>
			<Button
				color="danger"
				onClick={() =>
					show({ message: 'Could not update the list.', tone: 'error' })
				}
			>
				Error
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					show({ message: 'Stays until closed.', duration: Infinity })
				}
			>
				Persistent
			</Button>
		</div>
	);
}

function ToastStage() {
	return (
		<ToastProvider>
			<ToastDemo />
		</ToastProvider>
	);
}

const meta = {
	title: 'Components/Toast',
	component: ToastStage,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} satisfies Meta<typeof ToastStage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
