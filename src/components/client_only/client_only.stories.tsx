import { ClientOnly } from '#components/client_only/client_only';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Example/ClientOnly',
	component: ClientOnly,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		children: {
			control: 'text',
			description: 'Content rendered only after client mount',
		},
		fallback: {
			description: 'Optional content shown before mount (SSR / first paint)',
		},
	},
	args: {
		children: 'Rendered on client only.',
	},
} satisfies Meta<typeof ClientOnly>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-gray-700 dark:text-gray-300">
				This content is rendered only after the component has mounted on the
				client (avoids hydration mismatch for client-only APIs).
			</div>
		),
	},
};

export const WithFallback: Story = {
	args: {
		fallback: (
			<div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-amber-800 dark:text-amber-200 animate-pulse">
				Loading…
			</div>
		),
		children: (
			<div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 text-green-800 dark:text-green-200">
				Client-only content (e.g. window width:{' '}
				{typeof window !== 'undefined' ? window.innerWidth : 'N/A'}).
			</div>
		),
	},
};
