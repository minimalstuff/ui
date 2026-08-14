import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { MenuSurface } from './menu_surface';

function renderSurface(
	overrides: Partial<React.ComponentProps<typeof MenuSurface>> = {}
) {
	return render(
		<MenuSurface
			setFloating={vi.fn()}
			floatingStyles={{}}
			isVisible={true}
			isPositioned={true}
			radius="md"
			onClose={vi.fn()}
			{...overrides}
		>
			<button role="menuitem">First</button>
			<button role="menuitem">Second</button>
			<button role="menuitem">Third</button>
		</MenuSurface>
	);
}

describe('MenuSurface', () => {
	test('renders children inside a menu role', () => {
		renderSurface();
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getByText('First')).toBeInTheDocument();
	});

	test('reflects isVisible via data-state', () => {
		renderSurface({ isVisible: false });
		expect(screen.getByRole('menu')).toHaveAttribute('data-state', 'closed');
	});

	test('does not focus a menu item until positioned', () => {
		renderSurface({ isPositioned: false });
		expect(screen.getByText('First')).not.toHaveFocus();
	});

	test('focuses the first menu item once positioned', () => {
		renderSurface({ isPositioned: true });
		expect(screen.getByText('First')).toHaveFocus();
	});

	test('ArrowDown moves focus to the next item', () => {
		renderSurface();
		screen.getByText('First').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
		expect(screen.getByText('Second')).toHaveFocus();
	});

	test('ArrowDown wraps from the last item to the first', () => {
		renderSurface();
		screen.getByText('Third').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
		expect(screen.getByText('First')).toHaveFocus();
	});

	test('ArrowUp wraps from the first item to the last', () => {
		renderSurface();
		screen.getByText('First').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowUp' });
		expect(screen.getByText('Third')).toHaveFocus();
	});

	test('Home focuses the first item', () => {
		renderSurface();
		screen.getByText('Third').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Home' });
		expect(screen.getByText('First')).toHaveFocus();
	});

	test('End focuses the last item', () => {
		renderSurface();
		screen.getByText('First').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'End' });
		expect(screen.getByText('Third')).toHaveFocus();
	});

	test('skips disabled menu items when navigating', () => {
		render(
			<MenuSurface
				setFloating={vi.fn()}
				floatingStyles={{}}
				isVisible={true}
				isPositioned={true}
				radius="md"
				onClose={vi.fn()}
			>
				<button role="menuitem">First</button>
				<button role="menuitem" disabled>
					Second
				</button>
				<button role="menuitem">Third</button>
			</MenuSurface>
		);
		screen.getByText('First').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
		expect(screen.getByText('Third')).toHaveFocus();
	});

	test('skips aria-disabled menu items when navigating', () => {
		render(
			<MenuSurface
				setFloating={vi.fn()}
				floatingStyles={{}}
				isVisible={true}
				isPositioned={true}
				radius="md"
				onClose={vi.fn()}
			>
				<button role="menuitem">First</button>
				<a role="menuitem" aria-disabled="true" tabIndex={-1}>
					Second
				</a>
				<button role="menuitem">Third</button>
			</MenuSurface>
		);
		screen.getByText('First').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
		expect(screen.getByText('Third')).toHaveFocus();
	});

	test('Escape calls onClose', () => {
		const handleClose = vi.fn();
		renderSurface({ onClose: handleClose });
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	test('Tab calls onClose', () => {
		const handleClose = vi.fn();
		renderSurface({ onClose: handleClose });
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' });
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	test('clicking the backdrop calls onClose', () => {
		const handleClose = vi.fn();
		renderSurface({ onClose: handleClose });
		fireEvent.click(document.querySelector('[aria-hidden="true"]') as Element);
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	test('clicking inside the panel does not call onClose', () => {
		const handleClose = vi.fn();
		renderSurface({ onClose: handleClose });
		fireEvent.click(screen.getByRole('menu'));
		expect(handleClose).not.toHaveBeenCalled();
	});
});
