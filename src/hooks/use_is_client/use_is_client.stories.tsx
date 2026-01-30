import { useIsClient } from '#hooks/use_is_client/use_is_client';
import type { Meta, StoryObj } from '@storybook/react-vite';

function DemoHook() {
	const isClient = useIsClient();

	if (!isClient) {
		return (
			<div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-200">
				<code>useIsClient()</code> is false (before requestAnimationFrame).
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-800 dark:text-green-200">
			<code>useIsClient()</code> is true. Client ready (e.g. window width:{' '}
			{typeof window !== 'undefined' ? window.innerWidth : 'N/A'}).
		</div>
	);
}

const meta = {
	title: 'Hooks/useIsClient',
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <DemoHook />,
};
