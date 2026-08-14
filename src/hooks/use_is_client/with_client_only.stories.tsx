import type { Meta, StoryObj } from '@storybook/react-vite';

import { withClientOnly } from '#hooks/use_is_client/with_client_only';

const ClientOnlyMessage = () => (
	<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-gray-700 dark:text-gray-300">
		Rendered only after client mount via <code>withClientOnly</code>.
	</div>
);

const ClientOnlyWrapped = withClientOnly(ClientOnlyMessage);

const meta = {
	title: 'Hooks/withClientOnly',
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <ClientOnlyWrapped />,
};
