import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { MenuItem } from './menu_item';
import { MenuCloseContext } from '#components/menu/menu_context';

describe('MenuItem', () => {
	test('renders children', () => {
		render(<MenuItem onClick={vi.fn()}>Move up</MenuItem>);
		expect(screen.getByText('Move up')).toBeInTheDocument();
	});

	test('calls onClick and stops propagation', () => {
		const handleClick = vi.fn();
		const handleParentClick = vi.fn();
		render(
			<div onClick={handleParentClick}>
				<MenuItem onClick={handleClick}>Move up</MenuItem>
			</div>
		);

		fireEvent.click(screen.getByRole('menuitem'));

		expect(handleClick).toHaveBeenCalledTimes(1);
		expect(handleParentClick).not.toHaveBeenCalled();
	});

	test('applies danger color', () => {
		render(
			<MenuItem onClick={vi.fn()} danger>
				Delete
			</MenuItem>
		);
		expect(screen.getByText('Delete')).toHaveClass('text-red-600');
	});

	test('disables the button', () => {
		render(
			<MenuItem onClick={vi.fn()} disabled>
				Move up
			</MenuItem>
		);
		expect(screen.getByRole('menuitem')).toBeDisabled();
	});

	test('calls the enclosing menu close callback when provided', () => {
		const closeMenu = vi.fn();
		render(
			<MenuCloseContext.Provider value={closeMenu}>
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
			</MenuCloseContext.Provider>
		);

		fireEvent.click(screen.getByRole('menuitem'));

		expect(closeMenu).toHaveBeenCalledTimes(1);
	});

	test('works standalone without a menu close callback', () => {
		render(<MenuItem onClick={vi.fn()}>Move up</MenuItem>);
		expect(() => fireEvent.click(screen.getByRole('menuitem'))).not.toThrow();
	});
});
