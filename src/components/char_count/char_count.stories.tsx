import type { Meta, StoryObj } from '@storybook/react-vite';
import { CharacterCount } from './char_count';

const meta = {
	title: 'Example/CharacterCount',
	component: CharacterCount,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		current: {
			control: 'number',
			description: 'Current character count',
		},
		min: {
			control: 'number',
			description: 'Minimum length',
		},
		max: {
			control: 'number',
			description: 'Maximum length',
		},
		showMin: {
			control: 'boolean',
			description: 'Show min label (e.g. "x/y min")',
		},
		showMax: {
			control: 'boolean',
			description: 'Show max label (e.g. "x/y max")',
		},
	},
	args: {
		current: 5,
	},
	decorators: [
		(Story) => (
			<div style={{ width: 200, textAlign: 'right' }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof CharacterCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		current: 5,
		max: 20,
	},
};

export const WithMaxOnly: Story = {
	args: {
		current: 12,
		max: 100,
	},
};

export const WithMinOnly: Story = {
	args: {
		current: 3,
		min: 5,
		showMin: false,
		showMax: false,
	},
};

export const WithMinAndMaxLabels: Story = {
	args: {
		current: 8,
		min: 3,
		max: 20,
		showMin: true,
		showMax: true,
	},
};

export const AtMin: Story = {
	args: {
		current: 3,
		min: 3,
		max: 20,
		showMin: true,
		showMax: true,
	},
};

export const AtMax: Story = {
	args: {
		current: 20,
		min: 3,
		max: 20,
		showMin: true,
		showMax: true,
	},
};

export const OverMax: Story = {
	args: {
		current: 25,
		min: 3,
		max: 20,
		showMin: true,
		showMax: true,
	},
};

export const BelowMin: Story = {
	args: {
		current: 1,
		min: 5,
		showMin: false,
		showMax: false,
	},
};
