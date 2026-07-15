import type { Meta, StoryObj } from '@storybook/react-vite';

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
			options: ['default', 'ghost', 'danger', 'outline', 'subtle', 'unstyled'],
			description: 'Visual style. "unstyled" strips all built-in styling.',
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
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

export const Ghost: Story = {
	args: {
		variant: 'ghost',
		'aria-label': 'Close',
	},
};

export const Danger: Story = {
	args: {
		variant: 'danger',
		icon: 'i-mdi-delete',
		'aria-label': 'Delete',
	},
};

export const Outline: Story = {
	args: {
		variant: 'outline',
		'aria-label': 'Settings',
		icon: 'i-mdi-cog',
	},
};

export const Subtle: Story = {
	args: {
		variant: 'subtle',
		'aria-label': 'More options',
		icon: 'i-mdi-dots-vertical',
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

export const AllVariants: Story = {
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{(['default', 'ghost', 'danger', 'outline', 'subtle'] as const).map(
				(variant) => (
					<IconButton
						key={variant}
						{...args}
						variant={variant}
						aria-label={variant}
						icon={variant === 'danger' ? 'i-mdi-delete' : 'i-mdi-close'}
					/>
				)
			)}
		</div>
	),
};

export const AllSizes: Story = {
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{(['sm', 'md', 'lg'] as const).map((size) => (
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
		variant: 'unstyled',
		icon: 'i-mdi-heart',
		'aria-label': 'Unstyled',
		className: 'text-fuchsia-600 hover:text-fuchsia-700 p-2',
	},
};
