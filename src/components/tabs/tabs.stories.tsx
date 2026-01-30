import { Tabs } from '#components/tabs/tabs';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
	},
	args: {
		items: [
			{ title: 'Tab 1', content: 'Content for tab 1.' },
			{ title: 'Tab 2', content: 'Content for tab 2.' },
			{ title: 'Tab 3', content: 'Content for tab 3.' },
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
};

export const DefaultIndex: Story = {
	args: {
		defaultIndex: 1,
		items: [
			{ title: 'First', content: 'First tab content.' },
			{ title: 'Second', content: 'Second tab content (selected by default).' },
			{ title: 'Third', content: 'Third tab content.' },
		],
	},
};

export const WithDisabledTab: Story = {
	args: {
		items: [
			{ title: 'Active', content: 'This tab is active.' },
			{
				title: 'Disabled',
				content: 'You cannot select this tab.',
				disabled: true,
			},
			{ title: 'Another', content: 'Another tab content.' },
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
						<h3 className="text-sm font-semibold mb-2">Summary</h3>
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
					<ul className="list-disc list-inside space-y-1 text-sm">
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
			{ title: 'One', content: 'Content 1' },
			{ title: 'Two', content: 'Content 2' },
			{ title: 'Three', content: 'Content 3' },
			{ title: 'Four', content: 'Content 4' },
			{ title: 'Five', content: 'Content 5' },
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
