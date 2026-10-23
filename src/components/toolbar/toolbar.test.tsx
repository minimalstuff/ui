import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState, type Ref } from 'react';
import { describe, expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Toolbar } from './toolbar';

type RenderToolbarOptions = {
	orientation?: 'horizontal' | 'vertical';
	unstyled?: boolean;
	className?: string;
	ref?: Ref<HTMLDivElement>;
};

function pressKey(key: string) {
	fireEvent.keyDown(document.activeElement ?? document.body, { key });
}

function renderToolbar(props: RenderToolbarOptions = {}) {
	return render(
		<Toolbar aria-label="Formatting" {...props}>
			<button type="button">Bold</button>
			<button type="button">Italic</button>
			<button type="button">Underline</button>
		</Toolbar>
	);
}

function getButton(name: string) {
	return screen.getByRole('button', { name });
}

describe('Toolbar', () => {
	test('should expose the toolbar role with its accessible name', () => {
		renderToolbar();
		expect(
			screen.getByRole('toolbar', { name: 'Formatting' })
		).toBeInTheDocument();
	});

	test('should name the toolbar from aria-labelledby when it is given', () => {
		render(
			<>
				<span id="toolbar-label">Actions</span>
				<Toolbar aria-labelledby="toolbar-label">
					<button type="button">Bold</button>
				</Toolbar>
			</>
		);
		expect(
			screen.getByRole('toolbar', { name: 'Actions' })
		).toBeInTheDocument();
	});

	test('should set aria-orientation to horizontal when no orientation is given', () => {
		renderToolbar();
		expect(screen.getByRole('toolbar')).toHaveAttribute(
			'aria-orientation',
			'horizontal'
		);
	});

	test('should set aria-orientation to vertical when orientation is vertical', () => {
		renderToolbar({ orientation: 'vertical' });
		expect(screen.getByRole('toolbar')).toHaveAttribute(
			'aria-orientation',
			'vertical'
		);
	});

	test('should forward the ref to the toolbar element', () => {
		let element: HTMLDivElement | null = null;
		renderToolbar({
			ref: (node) => {
				element = node;
			},
		});
		expect(element).toBe(screen.getByRole('toolbar'));
	});

	test('should make only the first item tabbable initially', () => {
		renderToolbar();
		expect(
			screen.getAllByRole('button').map((button) => button.tabIndex)
		).toEqual([0, -1, -1]);
	});

	test('should apply horizontal layout classes by default', () => {
		renderToolbar();
		expect(screen.getByRole('toolbar')).toHaveClass('flex', 'items-center');
	});

	test('should apply vertical layout classes when orientation is vertical', () => {
		renderToolbar({ orientation: 'vertical' });
		expect(screen.getByRole('toolbar')).toHaveClass('flex-col');
	});

	test('should strip layout classes when unstyled', () => {
		renderToolbar({ unstyled: true, className: 'custom' });
		expect(screen.getByRole('toolbar')).not.toHaveClass('flex');
	});

	test('should append className when provided', () => {
		renderToolbar({ className: 'custom' });
		expect(screen.getByRole('toolbar')).toHaveClass('flex', 'custom');
	});

	test('should move focus to the next item when ArrowRight is pressed', async () => {
		renderToolbar();
		getButton('Bold').focus();
		pressKey('ArrowRight');
		expect(getButton('Italic')).toHaveFocus();
	});

	test('should move focus to the previous item when ArrowLeft is pressed', async () => {
		renderToolbar();
		getButton('Italic').focus();
		pressKey('ArrowLeft');
		expect(getButton('Bold')).toHaveFocus();
	});

	test('should wrap to the first item when ArrowRight is pressed on the last item', async () => {
		renderToolbar();
		getButton('Underline').focus();
		pressKey('ArrowRight');
		expect(getButton('Bold')).toHaveFocus();
	});

	test('should wrap to the last item when ArrowLeft is pressed on the first item', async () => {
		renderToolbar();
		getButton('Bold').focus();
		pressKey('ArrowLeft');
		expect(getButton('Underline')).toHaveFocus();
	});

	test('should move focus with ArrowDown when the toolbar is vertical', async () => {
		renderToolbar({ orientation: 'vertical' });
		getButton('Bold').focus();
		pressKey('ArrowDown');
		expect(getButton('Italic')).toHaveFocus();
	});

	test('should move focus with ArrowUp when the toolbar is vertical', async () => {
		renderToolbar({ orientation: 'vertical' });
		getButton('Italic').focus();
		pressKey('ArrowUp');
		expect(getButton('Bold')).toHaveFocus();
	});

	test('should ignore ArrowRight when the toolbar is vertical', async () => {
		renderToolbar({ orientation: 'vertical' });
		getButton('Bold').focus();
		pressKey('ArrowRight');
		expect(getButton('Bold')).toHaveFocus();
	});

	test('should ignore ArrowDown when the toolbar is horizontal', async () => {
		renderToolbar();
		getButton('Bold').focus();
		pressKey('ArrowDown');
		expect(getButton('Bold')).toHaveFocus();
	});

	test('should focus the last item when End is pressed', async () => {
		renderToolbar();
		getButton('Bold').focus();
		pressKey('End');
		expect(getButton('Underline')).toHaveFocus();
	});

	test('should focus the first item when Home is pressed', async () => {
		renderToolbar();
		getButton('Underline').focus();
		pressKey('Home');
		expect(getButton('Bold')).toHaveFocus();
	});

	test('should skip disabled items when navigating', async () => {
		render(
			<Toolbar aria-label="Formatting">
				<button type="button">Bold</button>
				<button type="button" disabled>
					Italic
				</button>
				<button type="button" aria-disabled="true">
					Strike
				</button>
				<button type="button">Underline</button>
			</Toolbar>
		);
		getButton('Bold').focus();
		pressKey('ArrowRight');
		expect(getButton('Underline')).toHaveFocus();
	});

	test('should never make a disabled item the tab stop when it comes first', () => {
		render(
			<Toolbar aria-label="Formatting">
				<button type="button" disabled>
					Bold
				</button>
				<button type="button">Italic</button>
			</Toolbar>
		);
		expect(
			screen.getAllByRole('button').map((button) => button.tabIndex)
		).toEqual([-1, 0]);
	});

	test('should make an item the tab stop when it receives focus', () => {
		renderToolbar();
		fireEvent.focus(getButton('Underline'));
		expect(
			screen.getAllByRole('button').map((button) => button.tabIndex)
		).toEqual([-1, -1, 0]);
	});

	test('should fall back to the first enabled item when the tab stop becomes disabled', async () => {
		function Harness() {
			const [isItalicDisabled, setIsItalicDisabled] = useState(false);
			return (
				<>
					<button type="button" onClick={() => setIsItalicDisabled(true)}>
						Disable
					</button>
					<Toolbar aria-label="Formatting">
						<button type="button">Bold</button>
						<button type="button" disabled={isItalicDisabled}>
							Italic
						</button>
					</Toolbar>
				</>
			);
		}
		render(<Harness />);
		getButton('Italic').focus();
		fireEvent.click(getButton('Disable'));
		await waitFor(() => expect(getButton('Bold').tabIndex).toBe(0));
	});

	test('should not move focus when an arrow key is pressed inside a text input', async () => {
		render(
			<Toolbar aria-label="Formatting">
				<button type="button">Bold</button>
				<input type="text" aria-label="Font size" />
				<button type="button">Italic</button>
			</Toolbar>
		);
		screen.getByRole('textbox').focus();
		pressKey('ArrowRight');
		expect(screen.getByRole('textbox')).toHaveFocus();
	});

	test('should have no axe violations when rendered', async () => {
		const { container } = renderToolbar();
		expect(await axe(container)).toHaveNoViolations();
	});
});
