import type { Meta, StoryObj } from '@storybook/react-vite';

import { OVERVIEW_GROUPS } from './overview_groups.js';
import { OverviewSection } from './overview_section.js';

function OverviewPage() {
	return (
		<div className="mx-auto flex max-w-6xl flex-col gap-10 p-6 sm:p-10">
			<header className="flex flex-col gap-2">
				<h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
					Overview
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Every component of the library at a glance, rendered from its own
					story.
				</p>
			</header>
			{OVERVIEW_GROUPS.map((group) => (
				<OverviewSection key={group.label} group={group} />
			))}
		</div>
	);
}

const meta = {
	title: 'Overview',
	component: OverviewPage,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof OverviewPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
