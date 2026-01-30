import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';

const meta = {
	title: 'Example/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		primary: true,
	},
};

export const Default: Story = {
	args: {},
};
