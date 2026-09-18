import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CheckboxOptions } from './checkbox_options';

const meta = {
	title: 'Example/CheckboxOptions',
	component: CheckboxOptions,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		orientation: {
			control: 'radio',
			options: ['vertical', 'horizontal'],
			description: 'Layout direction',
		},
		label: {
			control: 'text',
			description: 'Group label rendered in the legend',
		},
		error: {
			control: 'text',
			description: 'Error message below the group',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable all options',
		},
		required: {
			control: 'boolean',
			description: 'Mark group as required',
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
			description: 'Border radius of the option cards',
		},
		unstyled: {
			control: 'boolean',
			description: 'Strip built-in border/background styling from option cards',
		},
	},
} satisfies Meta<typeof CheckboxOptions>;

export default meta;
type Story = StoryObj<typeof meta>;

const narrow: Story['decorators'] = [
	(Story) => (
		<div style={{ width: 360 }}>
			<Story />
		</div>
	),
];

const wide: Story['decorators'] = [
	(Story) => (
		<div style={{ width: 560 }}>
			<Story />
		</div>
	),
];

export const StringOptions: Story = {
	decorators: narrow,
	args: {
		label: 'Pick fruits',
		options: ['Apple', 'Banana', 'Cherry'],
	},
};

export const ObjectOptions: Story = {
	decorators: narrow,
	args: {
		label: 'Toppings',
		options: [
			{ value: 'cheese', label: 'Cheese' },
			{ value: 'pepperoni', label: 'Pepperoni' },
			{ value: 'mushroom', label: 'Mushroom' },
		],
	},
};

export const WithDescriptions: Story = {
	decorators: narrow,
	args: {
		label: 'Add-ons',
		options: [
			{
				value: 'priority-support',
				label: 'Priority support',
				description: 'Get responses within one hour',
			},
			{
				value: 'extra-storage',
				label: 'Extra storage',
				description: '+100GB of storage',
			},
			{
				value: 'custom-domain',
				label: 'Custom domain',
				description: 'Use your own domain name',
			},
		],
	},
};

export const WithIcons: Story = {
	decorators: narrow,
	args: {
		label: 'Notification channels',
		options: [
			{
				value: 'email',
				label: 'Email',
				description: 'Receive updates in your inbox',
				icon: 'i-mdi-email-outline',
			},
			{
				value: 'push',
				label: 'Push',
				description: 'Instant browser notifications',
				icon: 'i-mdi-bell-outline',
			},
			{
				value: 'sms',
				label: 'SMS',
				description: 'Text message alerts',
				icon: 'i-mdi-message-outline',
			},
		],
	},
};

export const Horizontal: Story = {
	decorators: wide,
	args: {
		label: 'Size',
		orientation: 'horizontal',
		options: [
			{ value: 'sm', label: 'Small' },
			{ value: 'md', label: 'Medium' },
			{ value: 'lg', label: 'Large' },
		],
	},
};

export const WithDefault: Story = {
	decorators: narrow,
	args: {
		label: 'Permissions',
		defaultValues: ['read'],
		options: [
			{ value: 'read', label: 'Read' },
			{ value: 'write', label: 'Write' },
			{ value: 'admin', label: 'Admin' },
		],
	},
};

export const WithError: Story = {
	decorators: narrow,
	args: {
		label: 'Payment methods',
		error: 'Please select at least one payment method',
		options: [
			{
				value: 'card',
				label: 'Credit card',
				icon: 'i-mdi-credit-card-outline',
			},
			{ value: 'paypal', label: 'PayPal', icon: 'i-mdi-paypal' },
			{ value: 'bank', label: 'Bank transfer', icon: 'i-mdi-bank-outline' },
		],
	},
};

export const Disabled: Story = {
	decorators: narrow,
	args: {
		label: 'Region',
		disabled: true,
		defaultValues: ['eu'],
		options: [
			{ value: 'us', label: 'United States' },
			{ value: 'eu', label: 'Europe' },
			{ value: 'ap', label: 'Asia Pacific' },
		],
	},
};

export const PartiallyDisabled: Story = {
	decorators: narrow,
	args: {
		label: 'Plan add-ons',
		options: [
			{ value: 'free', label: 'Free tier', description: 'Always included' },
			{
				value: 'pro',
				label: 'Pro tier',
				description: 'Currently unavailable',
				disabled: true,
			},
			{
				value: 'enterprise',
				label: 'Enterprise tier',
				description: 'Contact sales',
			},
		],
	},
};

export const Required: Story = {
	decorators: narrow,
	args: {
		label: 'Consent',
		required: true,
		options: [
			{ value: 'terms', label: 'I agree to the terms of service' },
			{ value: 'privacy', label: 'I agree to the privacy policy' },
		],
	},
};

export const Controlled: Story = {
	decorators: narrow,
	args: {
		options: [
			{ value: 'a', label: 'Option A' },
			{ value: 'b', label: 'Option B' },
			{ value: 'c', label: 'Option C' },
		],
	},
	render: (args) => {
		const [selectedValues, setSelectedValues] = useState<readonly string[]>([
			'b',
		]);
		return (
			<div className="flex flex-col gap-4">
				<CheckboxOptions
					{...args}
					label="Controlled group"
					values={selectedValues}
					onChange={setSelectedValues}
				/>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Selected: {selectedValues.join(', ') || 'none'}
				</p>
			</div>
		);
	},
};
