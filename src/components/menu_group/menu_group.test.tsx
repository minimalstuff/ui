import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { MenuGroup } from './menu_group';
import { MenuItem } from '#components/menu_item/menu_item';
import { MenuSurface } from '#components/menu/menu_surface';

function renderThemeGroup() {
	return render(
		<MenuGroup label="Theme">
			<MenuItem onClick={vi.fn()}>Light</MenuItem>
			<MenuItem onClick={vi.fn()}>Dark</MenuItem>
		</MenuGroup>
	);
}

describe('MenuGroup', () => {
	test('renders its label', () => {
		renderThemeGroup();
		expect(screen.getByText('Theme')).toBeInTheDocument();
	});

	test('renders its items', () => {
		renderThemeGroup();
		expect(screen.getAllByRole('menuitem')).toHaveLength(2);
	});

	test('names the group after its label', () => {
		renderThemeGroup();
		expect(screen.getByRole('group', { name: 'Theme' })).toBeInTheDocument();
	});

	test('does not expose the label as a menu item', () => {
		renderThemeGroup();
		expect(
			screen.queryByRole('menuitem', { name: 'Theme' })
		).not.toBeInTheDocument();
	});

	test('applies its own label classes by default', () => {
		renderThemeGroup();
		expect(screen.getByText('Theme')).toHaveClass('uppercase');
	});

	test('drops its label classes when unstyled', () => {
		render(
			<MenuGroup label="Theme" unstyled>
				<MenuItem onClick={vi.fn()}>Light</MenuItem>
			</MenuGroup>
		);
		expect(screen.getByText('Theme')).not.toHaveClass('uppercase');
	});

	test('forwards a custom className to the label', () => {
		render(
			<MenuGroup label="Theme" className="custom">
				<MenuItem onClick={vi.fn()}>Light</MenuItem>
			</MenuGroup>
		);
		expect(screen.getByText('Theme')).toHaveClass('custom');
	});

	test('forwards a custom wrapperClassName to the group', () => {
		render(
			<MenuGroup label="Theme" wrapperClassName="custom">
				<MenuItem onClick={vi.fn()}>Light</MenuItem>
			</MenuGroup>
		);
		expect(screen.getByRole('group')).toHaveClass('custom');
	});

	test('leaves the group unstyled when no wrapperClassName is given', () => {
		renderThemeGroup();
		expect(screen.getByRole('group')).not.toHaveAttribute('class');
	});

	test('keeps its items reachable by the enclosing menu keyboard navigation', () => {
		render(
			<MenuSurface
				setFloating={vi.fn()}
				floatingStyles={{}}
				isVisible={true}
				isPositioned={true}
				radius="md"
				onClose={vi.fn()}
			>
				<MenuItem onClick={vi.fn()}>Rename</MenuItem>
				<MenuGroup label="Theme">
					<MenuItem onClick={vi.fn()}>Light</MenuItem>
					<MenuItem onClick={vi.fn()}>Dark</MenuItem>
				</MenuGroup>
			</MenuSurface>
		);

		expect(screen.getByText('Rename')).toHaveFocus();

		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
		expect(screen.getByText('Light')).toHaveFocus();

		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
		expect(screen.getByText('Dark')).toHaveFocus();
	});

	test('closes the enclosing menu when one of its items is selected', () => {
		const handleClose = vi.fn();
		render(
			<MenuSurface
				setFloating={vi.fn()}
				floatingStyles={{}}
				isVisible={true}
				isPositioned={true}
				radius="md"
				onClose={handleClose}
			>
				<MenuGroup label="Theme">
					<MenuItem onClick={vi.fn()}>Light</MenuItem>
				</MenuGroup>
			</MenuSurface>
		);

		fireEvent.click(screen.getByText('Light'));

		expect(handleClose).toHaveBeenCalledTimes(1);
	});
});
