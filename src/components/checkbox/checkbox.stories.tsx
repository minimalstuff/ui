import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from './checkbox';
import { expectFocusOn } from '../../../.storybook/play_helpers';

const meta = {
	title: 'Example/Checkbox',
	component: Checkbox,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
			description: 'Label next to the checkbox',
		},
		description: {
			control: 'text',
			description: 'Helper text below the label',
		},
		error: {
			control: 'text',
			description: 'Error message below the checkbox',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable the checkbox',
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
			description: 'Border radius of the box',
		},
		unstyled: {
			control: 'boolean',
			description: 'Strip built-in border/background styling from the box',
		},
		fullWidth: {
			control: 'boolean',
			description: 'Stretch the wrapper to the full width of its container',
		},
		variant: {
			control: 'radio',
			options: ['inline', 'card'],
			description: 'Renders the checkbox as a plain inline control or a card',
		},
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		'aria-label': 'Accept terms and conditions',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const checkbox = canvas.getByRole('checkbox', {
			name: 'Accept terms and conditions',
		});

		await step(
			'Tab focuses the checkbox and shows the focus ring',
			async () => {
				await userEvent.tab();
				await expectFocusOn(checkbox);
				const ring = checkbox.parentElement;
				if (!ring) throw new Error('expected a focus-ring wrapper element');
				await expect(getComputedStyle(ring).boxShadow).not.toBe('none');
			}
		);
	},
};

export const WithLabel: Story = {
	args: {
		label: 'Accept terms and conditions',
	},
};

export const WithDescription: Story = {
	args: {
		label: 'Subscribe to newsletter',
		description: 'We will send you updates about new features and tips.',
	},
};

export const Checked: Story = {
	args: {
		label: 'Subscribe to newsletter',
		defaultChecked: true,
	},
};

export const WithError: Story = {
	args: {
		label: 'Accept terms and conditions',
		error: 'You must accept the terms to continue',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Disabled option',
		disabled: true,
	},
};

export const DisabledChecked: Story = {
	args: {
		label: 'Disabled and checked',
		disabled: true,
		defaultChecked: true,
	},
};

export const Required: Story = {
	args: {
		label: 'I agree to the privacy policy',
		required: true,
	},
};

export const RequiredWithError: Story = {
	args: {
		label: 'I agree to the privacy policy',
		required: true,
		error: 'This field is required',
	},
};

export const Controlled: Story = {
	args: {
		label: 'Controlled checkbox',
		checked: true,
	},
};

export const Card: Story = {
	args: {
		label: 'Email notifications',
		description: 'Receive updates about your account activity',
		variant: 'card',
	},
};

export const CardChecked: Story = {
	args: {
		label: 'Email notifications',
		description: 'Receive updates about your account activity',
		variant: 'card',
		defaultChecked: true,
	},
};

export const CardWithError: Story = {
	args: {
		label: 'Accept terms and conditions',
		variant: 'card',
		error: 'You must accept the terms to continue',
	},
};
