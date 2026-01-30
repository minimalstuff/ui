import {
	useClientOnly,
	withClientOnly,
} from '#hooks/use_client_only/use_client_only';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * This is not the best story because storybook will only render the story after the client has mounted.
 */

function DemoHook() {
	const hasMounted = useClientOnly();

	if (!hasMounted) {
		return (
			<div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-200">
				<code>useClientOnly()</code> is false (SSR or first paint).
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-800 dark:text-green-200">
			<code>useClientOnly()</code> is true. Mounted on client (e.g. window
			width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}).
		</div>
	);
}

const ClientOnlyMessage = () => (
	<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-gray-700 dark:text-gray-300">
		Rendered only after client mount via <code>withClientOnly</code>.
	</div>
);

const ClientOnlyWrapped = withClientOnly(ClientOnlyMessage);

const meta = {
	title: 'Hooks/useClientOnly',
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

export const WithHOC: Story = {
	render: () => <ClientOnlyWrapped />,
};
