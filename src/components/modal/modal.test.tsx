import '@testing-library/jest-dom/vitest';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Modal } from './modal';
import { ModalFooter } from './modal_footer';

const MAX_RENDERS_BEFORE_LOOP_DETECTED = 50;

describe('Modal', () => {
	test('renders nothing when no call is active', () => {
		render(<Modal />);
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
	});

	test('renders title and children when called', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({ title: 'Hello', children: 'Body text' });
		});

		expect(await screen.findByText('Hello')).toBeInTheDocument();
		expect(screen.getByText('Body text')).toBeInTheDocument();
	});

	test('clicking the close button resolves the call', async () => {
		render(<Modal />);

		let result: Promise<void> = Promise.resolve();
		act(() => {
			result = Modal.call({ title: 'Hello', children: 'Body' });
		});
		await screen.findByText('Hello');

		fireEvent.click(screen.getByRole('button', { name: 'Close' }));

		await expect(result).resolves.toBeUndefined();
	});

	test('pressing Escape resolves the call', async () => {
		render(<Modal />);

		let result: Promise<void> = Promise.resolve();
		act(() => {
			result = Modal.call({ title: 'Hello', children: 'Body' });
		});
		await screen.findByText('Hello');

		fireEvent.keyDown(document, { key: 'Escape' });

		await expect(result).resolves.toBeUndefined();
	});

	test('hides the close button when dismissible is false', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({ title: 'Hello', children: 'Body', dismissible: false });
		});
		await screen.findByText('Hello');

		expect(
			screen.queryByRole('button', { name: 'Close' })
		).not.toBeInTheDocument();
	});

	test('ignores Escape when dismissible is false', async () => {
		render(<Modal />);

		let ended = false;
		act(() => {
			void Modal.call({
				title: 'Hello',
				children: 'Body',
				dismissible: false,
			}).then(() => {
				ended = true;
			});
		});
		await screen.findByText('Hello');

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(ended).toBe(false);
		expect(screen.getByText('Hello')).toBeInTheDocument();
	});

	test('ignores backdrop click when dismissible is false', async () => {
		render(<Modal />);

		let ended = false;
		act(() => {
			void Modal.call({
				title: 'Hello',
				children: 'Body',
				dismissible: false,
			}).then(() => {
				ended = true;
			});
		});
		await screen.findByText('Hello');

		fireEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);

		expect(ended).toBe(false);
		expect(screen.getByText('Hello')).toBeInTheDocument();
	});

	test('exposes dialog semantics wired to the title', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({ title: 'Hello', children: 'Body' });
		});
		await screen.findByText('Hello');

		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
		expect(dialog).toHaveAttribute(
			'aria-labelledby',
			screen.getByText('Hello').id
		);
	});

	test('moves focus into the dialog when there is nothing focusable inside', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({
				title: 'Hello',
				children: 'Body',
				dismissible: false,
			});
		});
		await screen.findByText('Hello');

		expect(screen.getByRole('dialog')).toHaveFocus();
	});

	test('focuses the first focusable field in the content instead of the close button', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({
				title: 'Hello',
				children: <input type="text" aria-label="Name" />,
			});
		});
		await screen.findByText('Hello');

		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
	});

	test('does not steal focus back from a field with autoFocus', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({
				title: 'Hello',
				children: <input type="text" aria-label="Name" autoFocus />,
			});
		});
		await screen.findByText('Hello');

		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
	});

	test('restores focus to the previously focused element on close', async () => {
		render(
			<>
				<button type="button">Open</button>
				<Modal />
			</>
		);
		const trigger = screen.getByRole('button', { name: 'Open' });
		trigger.focus();

		let result: Promise<void> = Promise.resolve();
		act(() => {
			result = Modal.call({ title: 'Hello', children: 'Body' });
		});
		await screen.findByText('Hello');

		fireEvent.click(screen.getByRole('button', { name: 'Close' }));
		await result;

		expect(trigger).toHaveFocus();
	});

	test('renders a ModalFooter as a pinned footer, outside the scrollable content region', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({
				title: 'Hello',
				children: (
					<>
						Body text
						<ModalFooter>Footer text</ModalFooter>
					</>
				),
			});
		});

		const body = await screen.findByText('Body text');
		const footer = screen.getByText('Footer text');
		expect(footer).toBeInTheDocument();
		expect(body.closest('[role="dialog"]')).toContainElement(footer);
		// The footer's own container must not be the scrollable body region.
		expect(footer.closest('.overflow-y-auto')).not.toBeInTheDocument();
	});

	test('renders a ModalFooter declared inside a nested content component', async () => {
		const NestedContent = () => (
			<>
				Body text
				<ModalFooter>Footer text</ModalFooter>
			</>
		);

		render(<Modal />);

		act(() => {
			void Modal.call({ title: 'Hello', children: <NestedContent /> });
		});

		expect(await screen.findByText('Body text')).toBeInTheDocument();
		const footer = screen.getByText('Footer text');
		expect(footer.closest('.overflow-y-auto')).not.toBeInTheDocument();
	});

	test('should not loop when a render-prop child declares a ModalFooter with fresh children', async () => {
		let renderCount = 0;

		render(<Modal />);

		act(() => {
			void Modal.call({
				title: 'Hello',
				children: () => {
					renderCount += 1;
					if (renderCount > MAX_RENDERS_BEFORE_LOOP_DETECTED) {
						throw new Error('Modal render prop re-invoked in a loop');
					}
					return (
						<>
							Body text
							<ModalFooter>
								<button type="button">Save {renderCount}</button>
							</ModalFooter>
						</>
					);
				},
			});
		});

		expect(await screen.findByText('Body text')).toBeInTheDocument();
		expect(renderCount).toBeLessThan(MAX_RENDERS_BEFORE_LOOP_DETECTED);
	});

	test('should render footer content declared via ModalFooter inside the dialog', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({
				title: 'Hello',
				children: (
					<>
						Body text
						<ModalFooter>Footer text</ModalFooter>
					</>
				),
			});
		});

		const footer = await screen.findByText('Footer text');
		expect(screen.getByRole('dialog')).toContainElement(footer);
	});

	test('should not render an empty footer bar when no ModalFooter is declared', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({ title: 'Hello', children: 'Body text' });
		});
		const body = await screen.findByText('Body text');

		const footerSlot = body.nextElementSibling as HTMLElement;
		expect(footerSlot).toBeEmptyDOMElement();
		expect(footerSlot).toHaveClass('empty:hidden');
	});

	test('should expose role alertdialog when role is alertdialog', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({
				title: 'Hello',
				children: 'Body text',
				role: 'alertdialog',
			});
		});
		await screen.findByText('Body text');

		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	test('should have no axe violations when an alertdialog modal is open', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({
				title: 'Delete everything?',
				children: (
					<>
						This cannot be undone.
						<ModalFooter>
							<button type="button">Delete</button>
						</ModalFooter>
					</>
				),
				role: 'alertdialog',
				dismissible: false,
			});
		});
		await screen.findByText('This cannot be undone.');

		expect(await axe(document.body)).toHaveNoViolations();
	});

	test('should focus initialFocusRef on open when it is in the content', async () => {
		const rejectRef = createRef<HTMLButtonElement>();
		render(<Modal />);

		act(() => {
			void Modal.call({
				title: 'Unknown host',
				initialFocusRef: rejectRef,
				children: (
					<>
						<button type="button">Copy</button>
						<button type="button" ref={rejectRef}>
							Reject
						</button>
					</>
				),
			});
		});
		await screen.findByText('Unknown host');

		expect(screen.getByRole('button', { name: 'Reject' })).toHaveFocus();
	});

	test('should focus initialFocusRef on open when it is in a ModalFooter', async () => {
		const rejectRef = createRef<HTMLButtonElement>();
		render(<Modal />);

		act(() => {
			void Modal.call({
				title: 'Unknown host',
				initialFocusRef: rejectRef,
				children: (
					<>
						<button type="button">Copy</button>
						<ModalFooter>
							<button type="button" ref={rejectRef}>
								Reject
							</button>
							<button type="button">Accept</button>
						</ModalFooter>
					</>
				),
			});
		});
		await screen.findByText('Unknown host');

		expect(screen.getByRole('button', { name: 'Reject' })).toHaveFocus();
	});

	test('should focus the first tabbable footer button when the content has none', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({
				children: (
					<>
						Body text
						<ModalFooter>
							<button type="button">Accept</button>
						</ModalFooter>
					</>
				),
				'aria-label': 'Notice',
				dismissible: false,
			});
		});
		await screen.findByText('Body text');

		expect(screen.getByRole('button', { name: 'Accept' })).toHaveFocus();
	});

	test('throws when calling without a mounted Modal root', () => {
		expect(() => {
			void Modal.call({ title: 'Hello', children: 'Body' });
		}).toThrow('No <Root> found!');
	});

	test('throws when more than one Modal root is mounted', () => {
		render(
			<>
				<Modal />
				<Modal />
			</>
		);

		expect(() => {
			void Modal.call({ title: 'Hello', children: 'Body' });
		}).toThrow('Multiple instances of <Root> found!');
	});

	test('accepts a custom close label', async () => {
		render(<Modal />);

		act(() => {
			void Modal.call({
				title: 'Hello',
				children: 'Body',
				closeLabel: 'Fermer',
			});
		});

		expect(await screen.findByLabelText('Fermer')).toBeInTheDocument();
	});
});
