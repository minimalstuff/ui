import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ContextMenu } from './context_menu';
import { MenuItem } from '#components/menu_item/menu_item';

describe('ContextMenu', () => {
	test('is closed by default', () => {
		render(
			<ContextMenu items={<MenuItem onClick={vi.fn()}>Edit</MenuItem>}>
				<div>Right-click area</div>
			</ContextMenu>
		);
		expect(screen.queryByText('Edit')).not.toBeInTheDocument();
	});

	test('opens on right-click', async () => {
		render(
			<ContextMenu items={<MenuItem onClick={vi.fn()}>Edit</MenuItem>}>
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
			<ContextMenu items={<MenuItem onClick={vi.fn()}>Edit</MenuItem>}>
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
			<ContextMenu items={<MenuItem onClick={vi.fn()}>Edit</MenuItem>}>
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
			<ContextMenu items={<MenuItem onClick={vi.fn()}>Edit</MenuItem>}>
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
			<ContextMenu items={<MenuItem onClick={vi.fn()}>Edit</MenuItem>}>
				<div>Right-click area</div>
			</ContextMenu>
		);

		fireEvent.contextMenu(screen.getByText('Right-click area'), {
			clientX: 100,
			clientY: 200,
		});

		await waitFor(() => expect(screen.getByText('Edit')).toHaveFocus());
	});

	test('closes and returns focus to the previously focused element on Escape', async () => {
		render(
			<>
				<button>Elsewhere</button>
				<ContextMenu items={<MenuItem onClick={vi.fn()}>Edit</MenuItem>}>
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

	test('forwards a custom className to the wrapper', () => {
		render(
			<ContextMenu
				items={<MenuItem onClick={vi.fn()}>Edit</MenuItem>}
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
				items={<MenuItem onClick={vi.fn()}>Edit</MenuItem>}
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
				items={<MenuItem onClick={vi.fn()}>Edit</MenuItem>}
				ref={ref}
			>
				<div>Right-click area</div>
			</ContextMenu>
		);
		expect(ref.current).toBe(
			screen.getByText('Right-click area').parentElement
		);
	});
});
