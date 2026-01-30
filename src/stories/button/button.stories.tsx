import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

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
			options: ['primary', 'secondary', 'ghost', 'outline', 'subtle', 'danger'],
			description: 'Visual style of the button',
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

export const Primary: Story = {
	args: {
		variant: 'primary',
		children: 'Primary',
	},
};

export const Secondary: Story = {
	args: {
		variant: 'secondary',
		children: 'Secondary',
	},
};

export const Ghost: Story = {
	args: {
		variant: 'ghost',
		children: 'Ghost',
	},
};

export const Outline: Story = {
	args: {
		variant: 'outline',
		children: 'Outline',
	},
};

export const Subtle: Story = {
	args: {
		variant: 'subtle',
		children: 'Subtle',
	},
};

export const Danger: Story = {
	args: {
		variant: 'danger',
		children: 'Danger',
	},
};

export const SizeXS: Story = {
	args: {
		size: 'xs',
		children: 'Extra small',
	},
};

export const SizeSM: Story = {
	args: {
		size: 'sm',
		children: 'Small',
	},
};

export const SizeMD: Story = {
	args: {
		size: 'md',
		children: 'Medium',
	},
};

export const SizeLG: Story = {
	args: {
		size: 'lg',
		children: 'Large',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		children: 'Disabled',
	},
};

export const FullWidth: Story = {
	args: {
		fullWidth: true,
		children: 'Full width',
	},
	parameters: {
		layout: 'padded',
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
};

export const AllVariants: Story = {
	render: (args) => (
		<div className="flex flex-wrap gap-3">
			{(
				[
					'primary',
					'secondary',
					'ghost',
					'outline',
					'subtle',
					'danger',
				] as const
			).map((variant) => (
				<Button key={variant} {...args} variant={variant}>
					{variant}
				</Button>
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
