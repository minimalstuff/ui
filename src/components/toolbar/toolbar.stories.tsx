import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { IconButton } from '#components/icon_button/icon_button';
import { Toolbar } from '#components/toolbar/toolbar';
import { expectFocusOn } from '../../../.storybook/play_helpers';

const meta = {
	title: 'Components/Toolbar',
	component: Toolbar,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description: 'Layout direction; also decides which arrow keys move focus',
		},
		unstyled: {
			control: 'boolean',
			description: 'Strip the built-in layout classes',
		},
		className: {
			control: 'text',
			description: 'Class name appended to the toolbar',
		},
	},
	args: {
		'aria-label': 'Formatting',
		children: (
			<>
				<IconButton icon="i-mdi-format-bold" aria-label="Bold" />
				<IconButton icon="i-mdi-format-italic" aria-label="Italic" />
				<IconButton icon="i-mdi-format-underline" aria-label="Underline" />
			</>
		),
	},
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Tab focuses the first item', async () => {
			await userEvent.tab();
			await expectFocusOn(canvas.getByRole('button', { name: 'Bold' }));
		});

		await step('ArrowRight moves focus to the next item', async () => {
			await userEvent.keyboard('{ArrowRight}');
			await expectFocusOn(canvas.getByRole('button', { name: 'Italic' }));
		});

		await step('End moves focus to the last item', async () => {
			await userEvent.keyboard('{End}');
			await expectFocusOn(canvas.getByRole('button', { name: 'Underline' }));
		});

		await step('ArrowRight wraps around to the first item', async () => {
			await userEvent.keyboard('{ArrowRight}');
			await expectFocusOn(canvas.getByRole('button', { name: 'Bold' }));
		});

		await expect(canvas.getByRole('toolbar')).toHaveAttribute(
			'aria-orientation',
			'horizontal'
		);
	},
};

export const Vertical: Story = {
	args: { orientation: 'vertical' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.tab();
		await userEvent.keyboard('{ArrowDown}');
		await expectFocusOn(canvas.getByRole('button', { name: 'Italic' }));
	},
};

export const WithDisabledItems: Story = {
	args: {
		children: (
			<>
				<IconButton icon="i-mdi-format-bold" aria-label="Bold" />
				<IconButton icon="i-mdi-format-italic" aria-label="Italic" disabled />
				<IconButton icon="i-mdi-format-underline" aria-label="Underline" />
			</>
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.tab();
		await userEvent.keyboard('{ArrowRight}');
		await expectFocusOn(canvas.getByRole('button', { name: 'Underline' }));
	},
};

export const Unstyled: Story = {
	args: {
		unstyled: true,
		className: 'flex gap-4 rounded border border-dashed border-gray-400 p-2',
	},
};
