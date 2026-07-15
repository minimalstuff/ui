import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '#components/button/button';

const meta = {
	title: 'Example/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['solid', 'outline', 'ghost', 'subtle'],
			description: 'Visual shape of the button',
		},
		color: {
			control: 'select',
			options: ['primary', 'neutral', 'danger', 'success'],
			description: 'Color intent of the button',
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
			description: 'Button size',
		},
		children: {
			control: 'text',
			description: 'Button label or content',
		},
		fullWidth: {
			control: 'boolean',
			description: 'Stretch button to full container width',
		},
		loading: {
			control: 'boolean',
			description: 'Show spinner and disable the button',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable the button',
		},
	},
	args: {
		children: 'Button',
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const States: Story = {
	render: () => {
		const [loading, setLoading] = useState(false);
		useEffect(() => {
			if (!loading) return;
			const id = setTimeout(() => setLoading(false), 2000);
			return () => clearTimeout(id);
		}, [loading]);

		return (
			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-3">
					<Button>Default</Button>
					<Button loading={loading} onClick={() => setLoading(true)}>
						{loading ? 'Submitting…' : 'Loading'}
					</Button>
					<Button disabled>Disabled</Button>
				</div>
				<div style={{ width: 320 }}>
					<Button fullWidth>Full width</Button>
				</div>
			</div>
		);
	},
	args: {
		children: '',
	},
};

export const VariantColorMatrix: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			{(['solid', 'outline', 'ghost', 'subtle'] as const).map((variant) => (
				<div key={variant} className="flex flex-wrap items-center gap-3">
					{(['primary', 'neutral', 'danger', 'success'] as const).map(
						(color) => (
							<Button key={color} variant={variant} color={color} size="sm">
								{variant} / {color}
							</Button>
						)
					)}
				</div>
			))}
		</div>
	),
	args: {
		children: '',
	},
};

export const AllSizes: Story = {
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
				<Button key={size} {...args} size={size}>
					{size}
				</Button>
			))}
		</div>
	),
	args: {
		children: '',
	},
};
