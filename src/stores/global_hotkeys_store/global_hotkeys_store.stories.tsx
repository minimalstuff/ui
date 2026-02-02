import { useGlobalHotkeysStore } from '#stores/global_hotkeys_store/global_hotkeys_store';
import type { Meta, StoryObj } from '@storybook/react-vite';

function GlobalHotkeysStoreDemo() {
	const globalHotkeysEnabled = useGlobalHotkeysStore(
		(s) => s.globalHotkeysEnabled
	);
	const setGlobalHotkeysEnabled = useGlobalHotkeysStore(
		(s) => s.setGlobalHotkeysEnabled
	);

	return (
		<div className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
			<label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
				<input
					type="checkbox"
					checked={globalHotkeysEnabled}
					onChange={(e) => setGlobalHotkeysEnabled(e.target.checked)}
					className="rounded border-gray-300"
				/>
				Global hotkeys enabled
			</label>
			<span className="text-sm text-gray-500 dark:text-gray-400">
				{globalHotkeysEnabled ? 'true' : 'false'}
			</span>
		</div>
	);
}

const meta = {
	title: 'Stores/GlobalHotkeysStore',
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	render: () => <GlobalHotkeysStoreDemo />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
