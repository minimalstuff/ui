import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { useKeyboardScrollable } from '#hooks/use_keyboard_scrollable/use_keyboard_scrollable';

const SHOW_DELAY_MS = 300;
const SHORT_ITEM_COUNT = 2;
const LONG_ITEM_COUNT = 40;

function createItems(count: number): string[] {
	return Array.from({ length: count }, (_, index) => `Item ${index + 1}`);
}

function ScrollList({ itemCount }: Readonly<{ itemCount: number }>) {
	const { scrollableProps, focusClassName } = useKeyboardScrollable({
		label: 'Items',
	});

	return (
		<div
			{...scrollableProps}
			data-testid="scroll-container"
			className={`h-32 w-64 overflow-y-auto rounded-lg border border-gray-300 p-2 text-sm ${focusClassName ?? ''}`}
		>
			{createItems(itemCount).map((item) => (
				<p key={item}>{item}</p>
			))}
		</div>
	);
}

function DelayedScrollList() {
	const [isShown, setIsShown] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => setIsShown(true), SHOW_DELAY_MS);
		return () => clearTimeout(timeoutId);
	}, []);

	if (!isShown) return <p className="text-sm">Loading...</p>;

	return <ScrollList itemCount={LONG_ITEM_COUNT} />;
}

const meta = {
	title: 'Hooks/useKeyboardScrollable',
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ShortList: Story = {
	render: () => <ScrollList itemCount={SHORT_ITEM_COUNT} />,
	play: async ({ canvasElement }) => {
		const container = within(canvasElement).getByTestId('scroll-container');

		await expect(container).not.toHaveAttribute('tabindex');
		await userEvent.tab();
		await expect(container).not.toHaveFocus();
	},
};

export const LongList: Story = {
	render: () => <ScrollList itemCount={LONG_ITEM_COUNT} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const region = await canvas.findByRole('region', { name: 'Items' });

		await userEvent.tab();
		await expect(region).toHaveFocus();
		await expect(getComputedStyle(region).outlineStyle).not.toBe('none');
	},
};

export const ShownAfterDelay: Story = {
	render: () => <DelayedScrollList />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const region = await canvas.findByRole('region', { name: 'Items' });

		await waitFor(async () => {
			await expect(region).toHaveAttribute('tabindex', '0');
		});
		await userEvent.tab();
		await expect(region).toHaveFocus();
	},
};
