import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { RadioOptions } from './radio_options';

const meta = {
	title: 'Example/RadioOptions',
	component: RadioOptions,
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
	},
} satisfies Meta<typeof RadioOptions>;

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
		label: 'Pick a fruit',
		options: ['Apple', 'Banana', 'Cherry'],
	},
};

export const WithDescriptions: Story = {
	decorators: narrow,
	args: {
		label: 'Subscription plan',
		options: [
			{
				value: 'free',
				label: 'Free',
				description: 'Up to 3 projects, community support',
			},
			{
				value: 'pro',
				label: 'Pro',
				description: 'Unlimited projects, priority support',
			},
			{
				value: 'enterprise',
				label: 'Enterprise',
				description: 'Custom limits, dedicated account manager',
			},
		],
	},
};

export const WithIcons: Story = {
	decorators: narrow,
	args: {
		label: 'Notification preference',
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
				value: 'none',
				label: 'None',
				description: 'No notifications',
				icon: 'i-mdi-bell-off-outline',
			},
		],
	},
};

export const HorizontalWithDescriptions: Story = {
	decorators: wide,
	args: {
		label: 'Subscription plan',
		orientation: 'horizontal',
		options: [
			{
				value: 'free',
				label: 'Free',
				description: 'Up to 3 projects',
				icon: 'i-mdi-sprout-outline',
			},
			{
				value: 'pro',
				label: 'Pro',
				description: 'Unlimited projects',
				icon: 'i-mdi-lightning-bolt',
			},
			{
				value: 'enterprise',
				label: 'Enterprise',
				description: 'Custom limits',
				icon: 'i-mdi-domain',
			},
		],
	},
};

export const Horizontal: Story = {
	decorators: narrow,
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

export const HorizontalWithIcons: Story = {
	decorators: narrow,
	args: {
		label: 'Theme',
		orientation: 'horizontal',
		options: [
			{ value: 'light', label: 'Light', icon: 'i-mdi-weather-sunny' },
			{ value: 'dark', label: 'Dark', icon: 'i-mdi-weather-night' },
			{ value: 'system', label: 'System', icon: 'i-mdi-laptop' },
		],
	},
};

export const WithDefault: Story = {
	decorators: narrow,
	args: {
		label: 'Priority',
		defaultValue: 'medium',
		options: [
			{ value: 'low', label: 'Low' },
			{ value: 'medium', label: 'Medium' },
			{ value: 'high', label: 'High' },
		],
	},
};

export const WithError: Story = {
	decorators: narrow,
	args: {
		label: 'Payment method',
		error: 'Please select a payment method',
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
		defaultValue: 'eu',
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
		label: 'Plan',
		options: [
			{ value: 'free', label: 'Free', description: 'Always free' },
			{
				value: 'pro',
				label: 'Pro',
				description: 'Currently unavailable',
				disabled: true,
			},
			{
				value: 'enterprise',
				label: 'Enterprise',
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
			{ value: 'yes', label: 'I agree to the terms of service' },
			{ value: 'no', label: 'I do not agree' },
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
		const [val, setVal] = useState('b');
		return (
			<div className="flex flex-col gap-4">
				<RadioOptions
					{...args}
					label="Controlled group"
					value={val}
					onChange={setVal}
				/>
				<p className="text-sm text-gray-500">Selected: {val}</p>
			</div>
		);
	},
};
