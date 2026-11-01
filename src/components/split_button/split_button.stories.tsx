import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	expect,
	fn,
	userEvent,
	waitForElementToBeRemoved,
	within,
} from 'storybook/test';

import { MenuItem } from '#components/menu_item/menu_item';
import { MenuSeparator } from '#components/menu_separator/menu_separator';
import { SplitButton } from '#components/split_button/split_button';
import { expectFocusOn, getPortalScope } from '#storybook/play_helpers';

const meta = {
	title: 'Components/SplitButton',
	component: SplitButton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['solid', 'outline', 'ghost', 'subtle'],
		},
		color: {
			control: 'select',
			options: ['primary', 'neutral', 'danger', 'success', 'warning'],
		},
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
		},
		menuAlign: { control: 'select', options: ['start', 'center', 'end'] },
		loading: { control: 'boolean' },
		disabled: { control: 'boolean' },
		unstyled: {
			control: 'boolean',
			description:
				'Strips all built-in styling. Mutually exclusive with variant/color/radius.',
		},
	},
	args: {
		children: 'Save',
		startIcon: 'i-mdi-content-save-outline',
		menuLabel: 'More save options',
		onClick: fn(),
		menu: (
			<>
				<MenuItem icon="i-mdi-file-document-outline" onClick={fn()}>
					Save as draft
				</MenuItem>
				<MenuItem icon="i-mdi-content-copy" onClick={fn()}>
					Save a copy
				</MenuItem>
			</>
		),
	},
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement, args, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const main = canvas.getByRole('button', { name: 'Save' });
		const trigger = canvas.getByRole('button', {
			name: 'More save options',
		});

		await step('Tab reaches both halves', async () => {
			await userEvent.tab();
			await expectFocusOn(main);
			await userEvent.tab();
			await expectFocusOn(trigger);
		});

		await step('Enter on the trigger opens the menu', async () => {
			await userEvent.keyboard('{Enter}');
			await body.findByRole('menu');
		});

		await step('choosing an item closes the menu', async () => {
			await userEvent.click(body.getByText('Save as draft'));
			await waitForElementToBeRemoved(() => body.queryByRole('menu'));
		});

		await step('the main button calls onClick', async () => {
			await userEvent.click(main);
			await expect(args.onClick).toHaveBeenCalledOnce();
		});
	},
};

export const Variants: Story = {
	render: (args) => (
		<div className="flex flex-col gap-4">
			{(['solid', 'outline', 'ghost', 'subtle'] as const).map((variant) => (
				<div key={variant} className="flex flex-wrap items-center gap-3">
					{(
						['primary', 'neutral', 'danger', 'success', 'warning'] as const
					).map((color) => (
						<SplitButton
							key={color}
							{...args}
							variant={variant}
							color={color}
							unstyled={false}
						>
							{variant}
						</SplitButton>
					))}
				</div>
			))}
		</div>
	),
};

export const Subtle: Story = {
	args: {
		variant: 'subtle',
		children: 'Export',
		startIcon: 'i-mdi-export',
		menuLabel: 'Export options',
	},
};

export const WithSeparator: Story = {
	args: {
		variant: 'subtle',
		children: 'Export',
		startIcon: 'i-mdi-export',
		menuLabel: 'Export options',
		menu: (
			<>
				<MenuItem onClick={fn()}>Export as PDF</MenuItem>
				<MenuItem onClick={fn()}>Export as CSV</MenuItem>
				<MenuSeparator />
				<MenuItem icon="i-mdi-cog-outline" onClick={fn()}>
					Export settings…
				</MenuItem>
			</>
		),
	},
};

export const Loading: Story = {
	args: { loading: true },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', {
			name: 'More save options',
		});
		await userEvent.click(trigger);
		await expect(body.queryByRole('menu')).toBeNull();
	},
};

export const Disabled: Story = {
	args: { disabled: true },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button', { name: 'Save' })).toBeDisabled();
		await expect(
			canvas.getByRole('button', { name: 'More save options' })
		).toBeDisabled();
	},
};

export const Radius: Story = {
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{(['none', 'md', 'full'] as const).map((radius) => (
				<SplitButton key={radius} {...args} radius={radius} unstyled={false}>
					{radius}
				</SplitButton>
			))}
		</div>
	),
};
