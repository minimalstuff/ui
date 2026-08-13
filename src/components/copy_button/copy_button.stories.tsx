import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '#components/button/button';
import { CopyButton } from '#components/copy_button/copy_button';

const meta = {
	title: 'Example/CopyButton',
	component: CopyButton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		value: {
			control: 'text',
			description: 'The string copied to the clipboard',
		},
	},
	args: {
		value: 'npm install @minimalstuff/ui',
		children: ({ copied, copy }) => (
			<Button
				variant={copied ? 'outline' : 'solid'}
				color={copied ? 'success' : 'primary'}
				onClick={() => void copy()}
			>
				{copied ? 'Copied' : 'Copy'}
			</Button>
		),
	},
} satisfies Meta<typeof CopyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
