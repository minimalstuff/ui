import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tabs } from '#components/tabs/tabs';
import { expectFocusOn } from '../../../.storybook/play_helpers';

const panelText = (text: string) => (
	<p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
);

const meta = {
	title: 'Example/Tabs',
	component: Tabs,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		defaultIndex: {
			control: 'number',
			min: 0,
			description: 'Index of the tab selected by default',
		},
		className: {
			control: 'text',
			description: 'Class name for the root wrapper',
		},
		tabListClassName: {
			control: 'text',
			description: 'Class name for the tab list',
		},
		panelClassName: {
			control: 'text',
			description: 'Class name for the tab panel',
		},
		variant: {
			control: 'select',
			options: ['line', 'segmented'],
			description: 'Visual style of the tab list',
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
			description: 'Size of the tabs',
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
			description:
				"Border radius applied to the segmented variant's track and tabs (no effect on the line variant)",
		},
		fullWidth: {
			control: 'boolean',
			description: 'Stretch tabs to fill the available width',
		},
		unstyled: {
			control: 'boolean',
			description: 'Strip built-in tab list, tab, and panel styling',
		},
		animated: {
			control: 'boolean',
			description: 'Animate the sliding indicator and panel transition',
		},
	},
	args: {
		items: [
			{ title: 'Tab 1', content: panelText('Content for tab 1.') },
			{ title: 'Tab 2', content: panelText('Content for tab 2.') },
			{ title: 'Tab 3', content: panelText('Content for tab 3.') },
		],
	},
	decorators: [
		(Story) => (
			<div style={{ width: 400 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step(
			'Tab into the tablist focuses and selects the first tab',
			async () => {
				await userEvent.tab();
				const firstTab = canvas.getByRole('tab', { name: 'Tab 1' });
				await expectFocusOn(firstTab);
				await expect(firstTab).toHaveAttribute('aria-selected', 'true');
			}
		);

		await step(
			'ArrowRight moves focus and selection to the second tab',
			async () => {
				await userEvent.keyboard('{ArrowRight}');
				const secondTab = canvas.getByRole('tab', { name: 'Tab 2' });
				await expectFocusOn(secondTab);
				await expect(secondTab).toHaveAttribute('aria-selected', 'true');
				await expect(
					canvas.getByRole('tabpanel', { name: 'Tab 2' })
				).toBeInTheDocument();
			}
		);

		await step('End moves focus and selection to the last tab', async () => {
			await userEvent.keyboard('{End}');
			const lastTab = canvas.getByRole('tab', { name: 'Tab 3' });
			await expectFocusOn(lastTab);
			await expect(lastTab).toHaveAttribute('aria-selected', 'true');
		});

		await step(
			'Home moves focus and selection back to the first tab',
			async () => {
				await userEvent.keyboard('{Home}');
				const firstTab = canvas.getByRole('tab', { name: 'Tab 1' });
				await expectFocusOn(firstTab);
				await expect(firstTab).toHaveAttribute('aria-selected', 'true');
			}
		);
	},
};

export const DefaultIndex: Story = {
	args: {
		defaultIndex: 1,
		items: [
			{ title: 'First', content: panelText('First tab content.') },
			{
				title: 'Second',
				content: panelText('Second tab content (selected by default).'),
			},
			{ title: 'Third', content: panelText('Third tab content.') },
		],
	},
};

export const WithDisabledTab: Story = {
	args: {
		items: [
			{ title: 'Active', content: panelText('This tab is active.') },
			{
				title: 'Disabled',
				content: panelText('You cannot select this tab.'),
				disabled: true,
			},
			{ title: 'Another', content: panelText('Another tab content.') },
		],
	},
};

export const WithRichContent: Story = {
	args: {
		items: [
			{
				title: 'Summary',
				content: (
					<div>
						<h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
							Summary
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							This panel can contain any React content: lists, forms, or
							components.
						</p>
					</div>
				),
			},
			{
				title: 'Details',
				content: (
					<ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
						<li>Detail one</li>
						<li>Detail two</li>
						<li>Detail three</li>
					</ul>
				),
			},
		],
	},
};

export const ManyTabs: Story = {
	args: {
		items: [
			{ title: 'One', content: panelText('Content 1') },
			{ title: 'Two', content: panelText('Content 2') },
			{ title: 'Three', content: panelText('Content 3') },
			{ title: 'Four', content: panelText('Content 4') },
			{ title: 'Five', content: panelText('Content 5') },
		],
	},
	decorators: [
		(Story) => (
			<div style={{ width: 480 }}>
				<Story />
			</div>
		),
	],
};

export const Unstyled: Story = {
	args: {
		unstyled: true,
		tabListClassName: 'gap-4',
	},
};

export const Segmented: Story = {
	args: {
		variant: 'segmented',
	},
};

const SIZE_ITEMS = [
	{ title: 'One', content: panelText('Content 1') },
	{ title: 'Two', content: panelText('Content 2') },
	{ title: 'Three', content: panelText('Content 3') },
];

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Tabs size="xs" items={SIZE_ITEMS} />
			<Tabs size="sm" items={SIZE_ITEMS} />
			<Tabs size="md" items={SIZE_ITEMS} />
			<Tabs size="lg" items={SIZE_ITEMS} />
		</div>
	),
};

export const FullWidth: Story = {
	args: {
		fullWidth: true,
	},
};

export const WithIcons: Story = {
	args: {
		items: [
			{
				title: 'Home',
				content: panelText('Home content.'),
				icon: 'i-lucide-home',
			},
			{
				title: 'Settings',
				content: panelText('Settings content.'),
				icon: 'i-lucide-settings',
			},
		],
	},
};

const CONTROLLED_ITEMS = [
	{
		slug: 'overview',
		title: 'Overview',
		content: panelText('Overview content.'),
	},
	{
		slug: 'settings',
		title: 'Settings',
		content: panelText('Settings content.'),
	},
	{ slug: 'billing', title: 'Billing', content: panelText('Billing content.') },
];

function ControlledTabsExample() {
	const [currentSlug, setCurrentSlug] = useState('overview');
	const value = Math.max(
		0,
		CONTROLLED_ITEMS.findIndex((item) => item.slug === currentSlug)
	);

	const handleChange = (targetIndex: number) => {
		setCurrentSlug(CONTROLLED_ITEMS[targetIndex].slug);
	};

	return (
		<div>
			<Tabs items={CONTROLLED_ITEMS} value={value} onChange={handleChange} />
			<p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
				?tab={currentSlug}
			</p>
		</div>
	);
}

export const Controlled: Story = {
	render: () => <ControlledTabsExample />,
};

export const NoAnimation: Story = {
	args: {
		animated: false,
	},
};
