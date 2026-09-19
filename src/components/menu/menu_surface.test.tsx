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

	test('navigates onto radio menu items', () => {
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
				<button role="menuitemradio" aria-checked="true">
					Second
				</button>
			</MenuSurface>
		);
		screen.getByText('First').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
		expect(screen.getByText('Second')).toHaveFocus();
	});

	test('Escape calls onClose', () => {
		const handleClose = vi.fn();
		renderSurface({ onClose: handleClose });
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	test('Escape is defaultPrevented, so a parent Modal ignores it', () => {
		renderSurface();
		const isDefaultAllowed = fireEvent.keyDown(screen.getByRole('menu'), {
			key: 'Escape',
		});
		expect(isDefaultAllowed).toBe(false);
	});

	test('Tab calls onClose', () => {
		const handleClose = vi.fn();
		renderSurface({ onClose: handleClose });
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' });
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	test('Tab is not defaultPrevented, so native focus movement still happens', () => {
		renderSurface();
		const event = fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' });
		expect(event).toBe(true);
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

	test('applies the id prop to the menu role element', () => {
		renderSurface({ id: 'options-menu' });
		expect(screen.getByRole('menu')).toHaveAttribute('id', 'options-menu');
	});

	test('applies aria-label to the menu role element', () => {
		renderSurface({ 'aria-label': 'Options' });
		expect(screen.getByRole('menu', { name: 'Options' })).toBeInTheDocument();
	});

	test('applies aria-labelledby to the menu role element', () => {
		render(
			<>
				<span id="trigger-id">Options</span>
				<MenuSurface
					setFloating={vi.fn()}
					floatingStyles={{}}
					isVisible={true}
					isPositioned={true}
					radius="md"
					onClose={vi.fn()}
					labelledBy="trigger-id"
				>
					<button role="menuitem">First</button>
				</MenuSurface>
			</>
		);
		expect(screen.getByRole('menu', { name: 'Options' })).toBeInTheDocument();
	});

	test('focuses the last menu item once positioned when initialFocus is last', () => {
		renderSurface({ initialFocus: 'last' });
		expect(screen.getByText('Third')).toHaveFocus();
	});

	test('focuses the first menu item once positioned when initialFocus is first', () => {
		renderSurface({ initialFocus: 'first' });
		expect(screen.getByText('First')).toHaveFocus();
	});

	test('typing a character focuses the next item whose label starts with it', () => {
		render(
			<MenuSurface
				setFloating={vi.fn()}
				floatingStyles={{}}
				isVisible={true}
				isPositioned={true}
				radius="md"
				onClose={vi.fn()}
			>
				<button role="menuitem">Move up</button>
				<button role="menuitem">Move down</button>
				<button role="menuitem">Delete</button>
			</MenuSurface>
		);
		screen.getByText('Move up').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'd' });
		expect(screen.getByText('Delete')).toHaveFocus();
	});

	test('typing a character wraps around and is case-insensitive', () => {
		renderSurface();
		screen.getByText('Second').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'F' });
		expect(screen.getByText('First')).toHaveFocus();
	});

	test('typing a character with no match keeps focus where it was', () => {
		renderSurface();
		screen.getByText('First').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'z' });
		expect(screen.getByText('First')).toHaveFocus();
	});

	test('Space does not trigger typeahead, so it can activate the item natively', () => {
		renderSurface();
		screen.getByText('First').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: ' ' });
		expect(screen.getByText('First')).toHaveFocus();
	});

	test('a character with a ctrl modifier does not trigger typeahead', () => {
		renderSurface();
		screen.getByText('First').focus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'd', ctrlKey: true });
		expect(screen.getByText('First')).toHaveFocus();
	});
});
