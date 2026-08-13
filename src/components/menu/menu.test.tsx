import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Menu } from './menu';
import { MenuItem } from '#components/menu_item/menu_item';

describe('Menu', () => {
	test('is closed by default', () => {
		render(
			<Menu trigger={<button>Options</button>}>
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
			</Menu>
		);
		expect(screen.queryByText('Move up')).not.toBeInTheDocument();
	});

	test('opens on trigger click', async () => {
		render(
			<Menu trigger={<button>Options</button>}>
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
			</Menu>
		);

		fireEvent.click(screen.getByText('Options'));

		await waitFor(() =>
			expect(screen.getByText('Move up')).toBeInTheDocument()
		);
	});

	test('closes on a second trigger click', async () => {
		render(
			<Menu trigger={<button>Options</button>}>
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
			</Menu>
		);

		fireEvent.click(screen.getByText('Options'));
		await waitFor(() =>
			expect(screen.getByRole('menu')).toHaveAttribute('data-state', 'open')
		);

		fireEvent.click(screen.getByText('Options'));
		await waitFor(() =>
			expect(screen.queryByText('Move up')).not.toBeInTheDocument()
		);
	});

	test('closes when the backdrop is clicked', async () => {
		render(
			<Menu trigger={<button>Options</button>}>
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
			</Menu>
		);

		fireEvent.click(screen.getByText('Options'));
		await waitFor(() =>
			expect(screen.getByText('Move up')).toBeInTheDocument()
		);

		const backdrop = document.querySelector('[aria-hidden="true"]');
		expect(backdrop).not.toBeNull();
		fireEvent.click(backdrop as Element);

		await waitFor(() =>
			expect(screen.queryByText('Move up')).not.toBeInTheDocument()
		);
	});

	test('calls a menu item onClick without closing the trigger click handler twice', async () => {
		const handleItemClick = vi.fn();
		const handleTriggerClick = vi.fn();
		render(
			<Menu trigger={<button onClick={handleTriggerClick}>Options</button>}>
				<MenuItem onClick={handleItemClick}>Move up</MenuItem>
			</Menu>
		);

		fireEvent.click(screen.getByText('Options'));
		await waitFor(() =>
			expect(screen.getByText('Move up')).toBeInTheDocument()
		);
		expect(handleTriggerClick).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByText('Move up'));
		expect(handleItemClick).toHaveBeenCalledTimes(1);
	});

	test('closes when a menu item is clicked', async () => {
		render(
			<Menu trigger={<button>Options</button>}>
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
			</Menu>
		);

		fireEvent.click(screen.getByText('Options'));
		await waitFor(() =>
			expect(screen.getByText('Move up')).toBeInTheDocument()
		);

		fireEvent.click(screen.getByText('Move up'));

		await waitFor(() =>
			expect(screen.queryByText('Move up')).not.toBeInTheDocument()
		);
	});

	test('focuses the first menu item when opened', async () => {
		render(
			<Menu trigger={<button>Options</button>}>
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
				<MenuItem onClick={vi.fn()}>Move down</MenuItem>
			</Menu>
		);

		fireEvent.click(screen.getByText('Options'));

		await waitFor(() => expect(screen.getByText('Move up')).toHaveFocus());
	});

	test('ArrowDown moves focus to the next menu item', async () => {
		render(
			<Menu trigger={<button>Options</button>}>
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
				<MenuItem onClick={vi.fn()}>Move down</MenuItem>
			</Menu>
		);

		fireEvent.click(screen.getByText('Options'));
		await waitFor(() => expect(screen.getByText('Move up')).toHaveFocus());

		fireEvent.keyDown(screen.getByText('Move up'), { key: 'ArrowDown' });

		expect(screen.getByText('Move down')).toHaveFocus();
	});

	test('closes and returns focus to the trigger on Escape', async () => {
		render(
			<Menu trigger={<button>Options</button>}>
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
			</Menu>
		);

		fireEvent.click(screen.getByText('Options'));
		await waitFor(() => expect(screen.getByText('Move up')).toHaveFocus());

		fireEvent.keyDown(screen.getByText('Move up'), { key: 'Escape' });

		await waitFor(() =>
			expect(screen.queryByText('Move up')).not.toBeInTheDocument()
		);
		expect(screen.getByText('Options')).toHaveFocus();
	});

	test('reopens on a trigger click during the exit fade instead of re-closing', async () => {
		render(
			<Menu trigger={<button>Options</button>}>
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
			</Menu>
		);

		fireEvent.click(screen.getByText('Options'));
		await waitFor(() =>
			expect(screen.getByRole('menu')).toHaveAttribute('data-state', 'open')
		);

		// Start closing (mid-exit-fade, isMounted still true) then click again.
		fireEvent.click(screen.getByText('Options'));
		fireEvent.click(screen.getByText('Options'));

		await waitFor(() =>
			expect(screen.getByRole('menu')).toHaveAttribute('data-state', 'open')
		);
	});

	test('exposes aria-haspopup and aria-expanded on the trigger', async () => {
		render(
			<Menu trigger={<button>Options</button>}>
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
			</Menu>
		);
		const trigger = screen.getByText('Options');

		expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');

		fireEvent.click(trigger);

		await waitFor(() =>
			expect(trigger).toHaveAttribute('aria-expanded', 'true')
		);
	});
});
