import '@testing-library/jest-dom/vitest';

import {
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, test, vi } from 'vitest';

import { MenuItem } from '#components/menu_item/menu_item';
import { SplitButton } from '#components/split_button/split_button';

function renderSplitButton(
	props: Partial<React.ComponentProps<typeof SplitButton>> = {}
) {
	const onClick = vi.fn<() => void>();
	const onItemClick = vi.fn<() => void>();
	render(
		<SplitButton
			onClick={onClick}
			menuLabel="Other ways to create"
			menu={<MenuItem onClick={onItemClick}>Temporary</MenuItem>}
			{...props}
		>
			Create
		</SplitButton>
	);
	return { onClick, onItemClick };
}

const getTrigger = () =>
	screen.getByRole('button', { name: 'Other ways to create' });

describe('SplitButton', () => {
	test('should name the group when aria-label is given', () => {
		renderSplitButton({ 'aria-label': 'Create actions' });
		expect(
			screen.getByRole('group', { name: 'Create actions' })
		).toBeInTheDocument();
	});

	test('should expose the two buttons inside a group', () => {
		renderSplitButton();
		const group = screen.getByRole('group');
		expect(within(group).getByRole('button', { name: 'Create' })).toBeVisible();
		expect(
			within(group).getByRole('button', { name: 'Other ways to create' })
		).toBeVisible();
	});

	test('should call onClick when the main button is clicked', () => {
		const { onClick } = renderSplitButton();
		fireEvent.click(screen.getByRole('button', { name: 'Create' }));
		expect(onClick).toHaveBeenCalledOnce();
	});

	test('should forward the ref to the main button', () => {
		const ref = createRef<HTMLButtonElement>();
		renderSplitButton({ ref });
		expect(ref.current).toBe(screen.getByRole('button', { name: 'Create' }));
	});

	test('should name the trigger with menuLabel', () => {
		renderSplitButton();
		expect(getTrigger()).toHaveAttribute('aria-haspopup', 'menu');
	});

	test('should open the menu and call the item onClick when the item is clicked', async () => {
		const { onItemClick, onClick } = renderSplitButton();
		fireEvent.click(getTrigger());
		fireEvent.click(await screen.findByRole('menuitem', { name: 'Temporary' }));
		expect(onItemClick).toHaveBeenCalledOnce();
		expect(onClick).not.toHaveBeenCalled();
	});

	test('should keep the menu closed and disable both halves when disabled', () => {
		renderSplitButton({ disabled: true });
		fireEvent.click(getTrigger());
		expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
		expect(getTrigger()).toBeDisabled();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	test('should keep the trigger focused and aria-disabled when loading starts', () => {
		const props = {
			menuLabel: 'Other ways to create',
			menu: <MenuItem onClick={vi.fn<() => void>()}>Temporary</MenuItem>,
		};
		const { rerender } = render(<SplitButton {...props}>Create</SplitButton>);
		getTrigger().focus();
		rerender(
			<SplitButton {...props} loading>
				Create
			</SplitButton>
		);
		expect(getTrigger()).toHaveFocus();
		expect(getTrigger()).toHaveAttribute('aria-disabled', 'true');
		expect(getTrigger()).not.toBeDisabled();
	});

	test('should keep the menu closed on click and ArrowDown when loading', () => {
		const { onClick } = renderSplitButton({ loading: true });
		fireEvent.click(getTrigger());
		fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
		fireEvent.click(screen.getByRole('button', { name: 'Create Loading' }));
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(onClick).not.toHaveBeenCalled();
	});

	test('should keep both halves in the tab order', () => {
		renderSplitButton();
		const halves = [
			screen.getByRole('button', { name: 'Create' }),
			getTrigger(),
		];
		for (const half of halves) {
			expect(half).toBeEnabled();
			expect(half).not.toHaveAttribute('tabindex', '-1');
		}
	});

	test('should open the menu when ArrowDown is pressed on the trigger', async () => {
		renderSplitButton();
		fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
		await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
	});

	test('should square the inner corners and keep the outer ones', () => {
		renderSplitButton({ radius: 'xl' });
		expect(screen.getByRole('button', { name: 'Create' })).toHaveClass(
			'rounded-xl',
			'!rounded-r-none'
		);
		expect(getTrigger()).toHaveClass('rounded-xl', '!rounded-l-none');
	});

	test('should drop the library styling when unstyled', () => {
		renderSplitButton({ unstyled: true });
		expect(screen.getByRole('button', { name: 'Create' })).not.toHaveClass(
			'!rounded-r-none'
		);
	});
});
