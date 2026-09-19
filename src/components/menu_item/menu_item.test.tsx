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
		expect(screen.getByText('Delete')).toHaveClass('text-red-700');
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

	test('forwards a custom className alongside its own classes', () => {
		render(
			<MenuItem onClick={vi.fn()} className="custom">
				Move up
			</MenuItem>
		);
		const item = screen.getByRole('menuitem');
		expect(item).toHaveClass('custom');
		expect(item).toHaveClass('flex');
	});

	test('forwards a ref to the underlying button', () => {
		const ref = { current: null as HTMLButtonElement | null };
		render(
			<MenuItem onClick={vi.fn()} ref={ref}>
				Move up
			</MenuItem>
		);
		expect(ref.current).toBe(screen.getByRole('menuitem'));
	});

	describe('with trailing content', () => {
		test('renders it inside the row', () => {
			render(
				<MenuItem onClick={vi.fn()} trailing={<span>⌘K</span>}>
					Shortcuts
				</MenuItem>
			);
			expect(screen.getByRole('menuitem')).toHaveTextContent('⌘K');
		});

		test('dims it without dropping below readable contrast', () => {
			render(
				<MenuItem onClick={vi.fn()} trailing="Dark">
					Theme
				</MenuItem>
			);
			expect(screen.getByText('Dark')).toHaveClass('text-gray-500');
		});

		test('announces itself as part of the row', () => {
			render(
				<MenuItem onClick={vi.fn()} trailing="Dark">
					Theme
				</MenuItem>
			);
			expect(
				screen.getByRole('menuitem', { name: 'Theme Dark' })
			).toBeInTheDocument();
		});

		test('renders nothing extra when omitted', () => {
			const { container } = render(
				<MenuItem onClick={vi.fn()}>Shortcuts</MenuItem>
			);
			expect(container.querySelector('.ml-auto')).not.toBeInTheDocument();
		});

		test('leaves the row as the only control', () => {
			render(
				<MenuItem onClick={vi.fn()} trailing="Dark">
					Theme
				</MenuItem>
			);
			expect(screen.getAllByRole('menuitem')).toHaveLength(1);
			expect(
				screen.queryByRole('button', { name: 'Dark' })
			).not.toBeInTheDocument();
		});

		test('works on a link too', () => {
			render(
				<MenuItem href="/docs" trailing={<span>↗</span>}>
					Documentation
				</MenuItem>
			);
			expect(screen.getByRole('menuitem')).toHaveTextContent('↗');
		});

		test('coexists with the selected check mark', () => {
			const { container } = render(
				<MenuItem onClick={vi.fn()} selected trailing="⌘D">
					Dark
				</MenuItem>
			);

			expect(screen.getByText('⌘D')).toBeInTheDocument();
			expect(container.querySelector('.i-mdi-check')).toBeInTheDocument();
		});

		test('groups with the check mark behind a single auto margin', () => {
			const { container } = render(
				<MenuItem onClick={vi.fn()} selected trailing="⌘D">
					Dark
				</MenuItem>
			);

			// Flexbox splits free space evenly across every auto margin on the
			// axis, so a second one would scatter the end content instead of
			// pinning it as one block.
			expect(container.querySelectorAll('.ml-auto')).toHaveLength(1);
		});

		test('pins the check mark on its own when there is no trailing content', () => {
			const { container } = render(
				<MenuItem onClick={vi.fn()} selected>
					Dark
				</MenuItem>
			);
			expect(container.querySelectorAll('.ml-auto')).toHaveLength(1);
		});
	});

	describe('as one option of a choice', () => {
		test('reports as a radio menu item when selected is given', () => {
			render(
				<MenuItem onClick={vi.fn()} selected={false}>
					Light
				</MenuItem>
			);
			expect(screen.getByRole('menuitemradio')).toBeInTheDocument();
		});

		test('stays a plain menu item when selected is omitted', () => {
			render(<MenuItem onClick={vi.fn()}>Move up</MenuItem>);
			expect(screen.queryByRole('menuitemradio')).not.toBeInTheDocument();
			expect(screen.getByRole('menuitem')).toBeInTheDocument();
		});

		test('reports itself as checked when selected', () => {
			render(
				<MenuItem onClick={vi.fn()} selected>
					Light
				</MenuItem>
			);
			expect(screen.getByRole('menuitemradio')).toBeChecked();
		});

		test('reports itself as unchecked when not selected', () => {
			render(
				<MenuItem onClick={vi.fn()} selected={false}>
					Light
				</MenuItem>
			);
			expect(screen.getByRole('menuitemradio')).not.toBeChecked();
		});

		test('shows a check mark when selected', () => {
			const { container } = render(
				<MenuItem onClick={vi.fn()} selected>
					Light
				</MenuItem>
			);
			expect(container.querySelector('.i-mdi-check')).not.toHaveClass(
				'invisible'
			);
		});

		test('keeps the check mark space when not selected', () => {
			const { container } = render(
				<MenuItem onClick={vi.fn()} selected={false}>
					Light
				</MenuItem>
			);
			expect(container.querySelector('.i-mdi-check')).toHaveClass('invisible');
		});

		test('renders no check mark for a plain action', () => {
			const { container } = render(
				<MenuItem onClick={vi.fn()}>Move up</MenuItem>
			);
			expect(container.querySelector('.i-mdi-check')).not.toBeInTheDocument();
		});

		test('still calls onClick and closes the menu', () => {
			const handleClick = vi.fn();
			const closeMenu = vi.fn();
			render(
				<MenuCloseContext.Provider value={closeMenu}>
					<MenuItem onClick={handleClick} selected={false}>
						Light
					</MenuItem>
				</MenuCloseContext.Provider>
			);

			fireEvent.click(screen.getByRole('menuitemradio'));

			expect(handleClick).toHaveBeenCalledTimes(1);
			expect(closeMenu).toHaveBeenCalledTimes(1);
		});
	});

	describe('as a link', () => {
		test('renders an anchor with the given href', () => {
			render(<MenuItem href="/settings">Settings</MenuItem>);

			const item = screen.getByRole('menuitem');
			expect(item.tagName).toBe('A');
			expect(item).toHaveAttribute('href', '/settings');
		});

		test('adds a safe rel when opening in a new tab', () => {
			render(
				<MenuItem href="https://example.com" target="_blank">
					Docs
				</MenuItem>
			);
			expect(screen.getByRole('menuitem')).toHaveAttribute(
				'rel',
				'noopener noreferrer'
			);
		});

		test('keeps an explicit rel over the default one', () => {
			render(
				<MenuItem href="https://example.com" target="_blank" rel="external">
					Docs
				</MenuItem>
			);
			expect(screen.getByRole('menuitem')).toHaveAttribute('rel', 'external');
		});

		test('closes the enclosing menu when followed', () => {
			const closeMenu = vi.fn();
			render(
				<MenuCloseContext.Provider value={closeMenu}>
					<MenuItem href="/settings">Settings</MenuItem>
				</MenuCloseContext.Provider>
			);

			fireEvent.click(screen.getByRole('menuitem'));

			expect(closeMenu).toHaveBeenCalledTimes(1);
		});

		test('stops click propagation', () => {
			const handleParentClick = vi.fn();
			render(
				<div onClick={handleParentClick}>
					<MenuItem href="/settings">Settings</MenuItem>
				</div>
			);

			fireEvent.click(screen.getByRole('menuitem'));

			expect(handleParentClick).not.toHaveBeenCalled();
		});

		test('drops the href when disabled', () => {
			render(
				<MenuItem href="/settings" disabled>
					Settings
				</MenuItem>
			);
			expect(screen.getByRole('menuitem')).not.toHaveAttribute('href');
		});

		test('marks itself aria-disabled when disabled', () => {
			render(
				<MenuItem href="/settings" disabled>
					Settings
				</MenuItem>
			);
			expect(screen.getByRole('menuitem')).toHaveAttribute(
				'aria-disabled',
				'true'
			);
		});

		test('applies danger color', () => {
			render(
				<MenuItem href="/settings" danger>
					Settings
				</MenuItem>
			);
			expect(screen.getByRole('menuitem')).toHaveClass('text-red-700');
		});

		test('renders the icon', () => {
			const { container } = render(
				<MenuItem href="/settings" icon="i-mdi-cog">
					Settings
				</MenuItem>
			);
			expect(container.querySelector('.i-mdi-cog')).toBeInTheDocument();
		});

		test('forwards a ref to the underlying anchor', () => {
			const ref = { current: null as HTMLAnchorElement | null };
			render(
				<MenuItem href="/settings" ref={ref}>
					Settings
				</MenuItem>
			);
			expect(ref.current).toBe(screen.getByRole('menuitem'));
		});
	});
});
