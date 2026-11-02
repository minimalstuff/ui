import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { ContextMenu } from '#components/context_menu/context_menu';
import { MenuItem } from '#components/menu_item/menu_item';

describe('ContextMenu', () => {
	test('is closed by default', () => {
		render(
			<ContextMenu
				items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
			>
				<div>Right-click area</div>
			</ContextMenu>
		);
		expect(screen.queryByText('Edit')).not.toBeInTheDocument();
	});

	test('opens on right-click', async () => {
		render(
			<ContextMenu
				items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
			>
				<div>Right-click area</div>
			</ContextMenu>
		);

		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 100,
			clientY: 200,
		});

		await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());
	});

	test('closes when the backdrop is clicked', async () => {
		render(
			<ContextMenu
				items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
			>
				<div>Right-click area</div>
			</ContextMenu>
		);

		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 100,
			clientY: 200,
		});
		await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());

		const backdrop = document.querySelector('[aria-hidden="true"]');
		fireEvent.click(backdrop as Element);

		await waitFor(() =>
			expect(screen.queryByText('Edit')).not.toBeInTheDocument()
		);
	});

	test('reopens at a new position on a second right-click', async () => {
		render(
			<ContextMenu
				items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
			>
				<div>Right-click area</div>
			</ContextMenu>
		);

		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 10,
			clientY: 10,
		});
		await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());

		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 300,
			clientY: 300,
		});
		await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());
	});

	test('closes when a menu item is clicked', async () => {
		render(
			<ContextMenu
				items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
			>
				<div>Right-click area</div>
			</ContextMenu>
		);

		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 100,
			clientY: 200,
		});
		await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());

		fireEvent.click(screen.getByText('Edit'));

		await waitFor(() =>
			expect(screen.queryByText('Edit')).not.toBeInTheDocument()
		);
	});

	test('focuses the first menu item when opened', async () => {
		render(
			<ContextMenu
				items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
			>
				<div>Right-click area</div>
			</ContextMenu>
		);

		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 100,
			clientY: 200,
		});

		await waitFor(() => expect(screen.getByText('Edit')).toHaveFocus());
	});

	test('returns focus to the original element on Escape after a second right-click while open', async () => {
		render(
			<>
				<button type="button">Elsewhere</button>
				<ContextMenu
					items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
				>
					<div>Right-click area</div>
				</ContextMenu>
			</>
		);
		const elsewhere = screen.getByText('Elsewhere');
		elsewhere.focus();
		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 100,
			clientY: 200,
		});
		await waitFor(() => expect(screen.getByText('Edit')).toHaveFocus());

		fireEvent.contextMenu(screen.getByText('Edit'), {
			clientX: 120,
			clientY: 220,
		});
		fireEvent.keyDown(screen.getByText('Edit'), { key: 'Escape' });

		await waitFor(() => expect(elsewhere).toHaveFocus());
	});

	test('closes and returns focus to the previously focused element on Escape', async () => {
		render(
			<>
				<button>Elsewhere</button>
				<ContextMenu
					items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
				>
					<div>Right-click area</div>
				</ContextMenu>
			</>
		);
		const elsewhere = screen.getByText('Elsewhere');
		elsewhere.focus();

		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 100,
			clientY: 200,
		});
		await waitFor(() => expect(screen.getByText('Edit')).toHaveFocus());

		fireEvent.keyDown(screen.getByText('Edit'), { key: 'Escape' });

		await waitFor(() =>
			expect(screen.queryByText('Edit')).not.toBeInTheDocument()
		);
		expect(elsewhere).toHaveFocus();
	});

	test('returns focus without scrolling the page', async () => {
		render(
			<>
				<button>Elsewhere</button>
				<ContextMenu
					items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
				>
					<div>Right-click area</div>
				</ContextMenu>
			</>
		);
		const elsewhere = screen.getByText('Elsewhere');
		elsewhere.focus();
		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 100,
			clientY: 200,
		});
		await waitFor(() => expect(screen.getByText('Edit')).toHaveFocus());
		const focusSpy = vi.spyOn(elsewhere, 'focus');

		fireEvent.keyDown(screen.getByText('Edit'), { key: 'Escape' });

		await waitFor(() =>
			expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
		);
	});

	test('forwards a custom className to the wrapper', () => {
		render(
			<ContextMenu
				items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
				className="custom"
			>
				<div>Right-click area</div>
			</ContextMenu>
		);
		expect(screen.getByText('Right-click area').parentElement).toHaveClass(
			'custom'
		);
	});

	test('names the menu via the aria-label prop', async () => {
		render(
			<ContextMenu
				items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
				aria-label="File actions"
			>
				<div>Right-click area</div>
			</ContextMenu>
		);

		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 100,
			clientY: 200,
		});

		await waitFor(() =>
			expect(
				screen.getByRole('menu', { name: 'File actions' })
			).toBeInTheDocument()
		);
	});

	test('forwards a ref to the wrapper', () => {
		const ref = { current: null as HTMLDivElement | null };
		render(
			<ContextMenu
				items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
				ref={ref}
			>
				<div>Right-click area</div>
			</ContextMenu>
		);
		expect(ref.current).toBe(
			screen.getByText('Right-click area').parentElement
		);
	});

	test('renders the menu inside the dialog containing the area', async () => {
		render(
			<div role="dialog" aria-label="Settings">
				<ContextMenu
					items={<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>}
				>
					<div>Right-click area</div>
				</ContextMenu>
			</div>
		);

		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 100,
			clientY: 200,
		});

		const menu = await screen.findByRole('menu');
		expect(screen.getByRole('dialog').contains(menu)).toBe(true);
	});

	describe('unstyled', () => {
		const openUnstyledMenu = async () => {
			render(
				<ContextMenu
					unstyled
					panelClassName="custom-panel"
					items={
						<>
							<MenuItem onClick={vi.fn<() => void>()}>Edit</MenuItem>
							<MenuItem onClick={vi.fn<() => void>()}>Copy</MenuItem>
						</>
					}
				>
					<div>Right-click area</div>
				</ContextMenu>
			);
			fireEvent.contextMenu(screen.getByText('Right-click area'), {
				clientX: 100,
				clientY: 200,
			});
			await waitFor(() => expect(screen.getByText('Edit')).toHaveFocus());
			return screen.getByRole('menu');
		};

		test('should drop the visual classes and keep the layout of the panel', async () => {
			const menu = await openUnstyledMenu();

			for (const token of ['border', 'py-1', 'shadow-lg', 'min-w-40']) {
				expect(menu).not.toHaveClass(token);
			}
			expect(menu).toHaveClass('w-max');
			expect(menu).toHaveAttribute('data-state', 'open');
		});

		test('should apply panelClassName to the menu element', async () => {
			const menu = await openUnstyledMenu();
			expect(menu).toHaveClass('custom-panel');
		});

		test('should navigate with the arrow keys and close on Escape', async () => {
			await openUnstyledMenu();

			fireEvent.keyDown(screen.getByText('Edit'), { key: 'ArrowDown' });
			expect(screen.getByText('Copy')).toHaveFocus();

			fireEvent.keyDown(screen.getByText('Copy'), { key: 'Escape' });
			await waitFor(() =>
				expect(screen.queryByRole('menu')).not.toBeInTheDocument()
			);
		});
	});
});
