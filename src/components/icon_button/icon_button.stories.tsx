import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '#components/button/button';
import { IconButton } from '#components/icon_button/icon_button';

const meta = {
	title: 'Example/IconButton',
	component: IconButton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		icon: {
			control: 'text',
			description: 'UnoCSS icon class (e.g. i-mdi-close)',
		},
		'aria-label': {
			control: 'text',
			description: 'Accessible label for screen readers',
		},
		variant: {
			control: 'select',
			options: ['solid', 'outline', 'ghost', 'subtle'],
			description: 'Visual shape of the button.',
		},
		unstyled: {
			control: 'boolean',
			description:
				'Strips all built-in styling. Mutually exclusive with variant/color/radius.',
		},
		color: {
			control: 'select',
			options: ['primary', 'neutral', 'danger', 'success', 'warning'],
			description: 'Color intent of the button',
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
			description: 'Button size',
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
			description: 'Border radius',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable the button',
		},
	},
	args: {
		icon: 'i-mdi-close',
		'aria-label': 'Close',
	},
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SizeXS: Story = {
	args: {
		size: 'xs',
		'aria-label': 'Extra small',
	},
};

export const SizeSM: Story = {
	args: {
		size: 'sm',
		'aria-label': 'Small',
	},
};

export const SizeMD: Story = {
	args: {
		size: 'md',
		'aria-label': 'Medium',
	},
};

export const SizeLG: Story = {
	args: {
		size: 'lg',
		'aria-label': 'Large',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		'aria-label': 'Disabled',
	},
};

export const WithChildren: Story = {
	args: {
		icon: 'i-mdi-heart',
		'aria-label': 'Like',
		children: ' Like',
	},
};

export const VariantColorMatrix: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			{(['solid', 'outline', 'ghost', 'subtle'] as const).map((variant) => (
				<div key={variant} className="flex flex-wrap items-center gap-3">
					{(
						['primary', 'neutral', 'danger', 'success', 'warning'] as const
					).map((color) => (
						<IconButton
							key={color}
							variant={variant}
							color={color}
							icon={color === 'danger' ? 'i-mdi-delete' : 'i-mdi-cog'}
							aria-label={`${variant} / ${color}`}
						/>
					))}
				</div>
			))}
		</div>
	),
};

export const AllSizes: Story = {
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
				<IconButton key={size} {...args} size={size} aria-label={size} />
			))}
		</div>
	),
};

export const RadiusMatrix: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			{(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((radius) => (
				<IconButton
					key={radius}
					icon="i-mdi-cog"
					radius={radius}
					aria-label={radius}
					variant="outline"
				/>
			))}
		</div>
	),
};

export const Unstyled: Story = {
	args: {
		unstyled: true,
		icon: 'i-mdi-heart',
		'aria-label': 'Unstyled',
		className: 'text-fuchsia-600 hover:text-fuchsia-700 p-2',
	},
};

export const SameHeightAsButton: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			{(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
				<div key={size} className="flex items-center gap-3">
					<Button size={size} variant="outline" color="neutral">
						{size}
					</Button>
					<IconButton icon="i-mdi-cog" size={size} aria-label={size} />
				</div>
			))}
		</div>
	),
};
