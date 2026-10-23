import '@testing-library/jest-dom/vitest';

import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Tooltip } from './tooltip';

const EXIT_ANIMATION_DURATION_MS = 150;

describe('Tooltip', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test('is hidden by default', () => {
		render(
			<Tooltip content="Helpful text">
				<button>Hover me</button>
			</Tooltip>
		);
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	test('shows on mouse enter and hides after the exit animation on mouse leave', () => {
		render(
			<Tooltip content="Helpful text">
				<button>Hover me</button>
			</Tooltip>
		);
		const wrapper = screen.getByText('Hover me').parentElement as HTMLElement;

		act(() => {
			fireEvent.mouseEnter(wrapper);
		});
		expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful text');

		act(() => {
			fireEvent.mouseLeave(wrapper);
		});
		expect(screen.getByRole('tooltip')).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(EXIT_ANIMATION_DURATION_MS);
		});
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	test('shows on focus and hides after the exit animation on blur', () => {
		render(
			<Tooltip content="Helpful text">
				<button>Focus me</button>
			</Tooltip>
		);
		const wrapper = screen.getByText('Focus me').parentElement as HTMLElement;

		act(() => {
			fireEvent.focus(wrapper);
		});
		expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful text');

		act(() => {
			fireEvent.blur(wrapper);
			vi.advanceTimersByTime(EXIT_ANIMATION_DURATION_MS);
		});
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	test('links the trigger to the tooltip via aria-describedby', () => {
		render(
			<Tooltip content="Helpful text">
				<button>Hover me</button>
			</Tooltip>
		);
		const trigger = screen.getByRole('button');
		const wrapper = trigger.parentElement as HTMLElement;

		act(() => {
			fireEvent.mouseEnter(wrapper);
		});

		const tooltip = screen.getByRole('tooltip');
		expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
	});

	test('never shows when disabled', () => {
		render(
			<Tooltip content="Helpful text" disabled>
				<button>Hover me</button>
			</Tooltip>
		);
		const wrapper = screen.getByText('Hover me').parentElement as HTMLElement;

		act(() => {
			fireEvent.mouseEnter(wrapper);
		});

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	test('shows temporary content on click when showOnClick is set', () => {
		render(
			<Tooltip content="Copy" temporaryContent="Copied!" showOnClick>
				<button>Copy link</button>
			</Tooltip>
		);

		act(() => {
			fireEvent.click(screen.getByRole('button'));
		});

		expect(screen.getByRole('tooltip')).toHaveTextContent('Copied!');
	});

	test('reverts to the base content after temporaryDuration', () => {
		render(
			<Tooltip
				content="Copy"
				temporaryContent="Copied!"
				temporaryDuration={2000}
				showOnClick
			>
				<button>Copy link</button>
			</Tooltip>
		);

		act(() => {
			fireEvent.click(screen.getByRole('button'));
		});
		expect(screen.getByRole('tooltip')).toHaveTextContent('Copied!');

		act(() => {
			vi.advanceTimersByTime(2000 + EXIT_ANIMATION_DURATION_MS);
		});
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	test('calls the child element onClick alongside the temporary content trigger', () => {
		const handleClick = vi.fn<() => void>();
		render(
			<Tooltip content="Copy" temporaryContent="Copied!" showOnClick>
				<button onClick={handleClick}>Copy link</button>
			</Tooltip>
		);

		act(() => {
			fireEvent.click(screen.getByRole('button'));
		});

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test('stays visible after a fast leave-then-re-enter that cancels the pending unmount', async () => {
		vi.useRealTimers();
		render(
			<Tooltip content="Helpful text">
				<button>Hover me</button>
			</Tooltip>
		);
		const wrapper = screen.getByText('Hover me').parentElement as HTMLElement;

		fireEvent.mouseEnter(wrapper);
		await waitFor(() =>
			expect(screen.getByRole('tooltip')).toHaveAttribute('data-state', 'open')
		);

		fireEvent.mouseLeave(wrapper);
		fireEvent.mouseEnter(wrapper);

		// Wait past the exit-animation duration: if the unmount hadn't been
		// cancelled, or `isVisible` were stuck false, this would fail either by
		// the tooltip disappearing or by never reaching "open" again.
		await new Promise((resolve) =>
			setTimeout(resolve, EXIT_ANIMATION_DURATION_MS)
		);
		await waitFor(() =>
			expect(screen.getByRole('tooltip')).toHaveAttribute('data-state', 'open')
		);
	});

	test('carries a closed-state translate class matching the requested position', () => {
		render(
			<Tooltip content="Helpful text" position="right">
				<button>Hover me</button>
			</Tooltip>
		);
		const wrapper = screen.getByText('Hover me').parentElement as HTMLElement;

		act(() => {
			fireEvent.mouseEnter(wrapper);
		});

		expect(screen.getByRole('tooltip')).toHaveClass(
			'data-[state=closed]:-translate-x-1'
		);
	});

	test('forwards a custom className to the wrapper', () => {
		render(
			<Tooltip content="Helpful text" className="custom">
				<button>Hover me</button>
			</Tooltip>
		);
		expect(screen.getByText('Hover me').parentElement).toHaveClass('custom');
	});

	test('forwards a ref to the wrapper alongside its own', () => {
		const ref = { current: null as HTMLSpanElement | null };
		render(
			<Tooltip content="Helpful text" ref={ref}>
				<button>Hover me</button>
			</Tooltip>
		);
		expect(ref.current).toBe(screen.getByText('Hover me').parentElement);
	});

	test('still shows on hover when a consumer ref is passed', () => {
		const ref = { current: null as HTMLSpanElement | null };
		render(
			<Tooltip content="Helpful text" ref={ref}>
				<button>Hover me</button>
			</Tooltip>
		);
		const wrapper = screen.getByText('Hover me').parentElement as HTMLElement;

		fireEvent.mouseEnter(wrapper);

		expect(screen.getByRole('tooltip')).toBeInTheDocument();
	});

	test('Escape hides a tooltip shown via focus', () => {
		render(
			<Tooltip content="Helpful text">
				<button>Focus me</button>
			</Tooltip>
		);
		const wrapper = screen.getByText('Focus me').parentElement as HTMLElement;

		act(() => {
			fireEvent.focus(wrapper);
		});
		expect(screen.getByRole('tooltip')).toBeInTheDocument();

		act(() => {
			fireEvent.keyDown(document, { key: 'Escape' });
		});
		act(() => {
			vi.advanceTimersByTime(EXIT_ANIMATION_DURATION_MS);
		});
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	test('Escape hides a tooltip shown via mouse hover', () => {
		render(
			<Tooltip content="Helpful text">
				<button>Hover me</button>
			</Tooltip>
		);
		const wrapper = screen.getByText('Hover me').parentElement as HTMLElement;

		act(() => {
			fireEvent.mouseEnter(wrapper);
		});
		expect(screen.getByRole('tooltip')).toBeInTheDocument();

		act(() => {
			fireEvent.keyDown(document, { key: 'Escape' });
		});
		act(() => {
			vi.advanceTimersByTime(EXIT_ANIMATION_DURATION_MS);
		});
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	test('does not prevent the default behavior of the Escape keydown event', () => {
		render(
			<Tooltip content="Helpful text">
				<button>Hover me</button>
			</Tooltip>
		);
		const wrapper = screen.getByText('Hover me').parentElement as HTMLElement;

		act(() => {
			fireEvent.mouseEnter(wrapper);
		});

		const escapeEvent = new KeyboardEvent('keydown', {
			key: 'Escape',
			cancelable: true,
		});
		act(() => {
			document.dispatchEvent(escapeEvent);
		});

		expect(escapeEvent.defaultPrevented).toBe(false);
	});

	test("keeps the child's own aria-describedby when the tooltip is not shown", () => {
		render(
			<Tooltip content="Helpful text">
				<button aria-describedby="hint-id">Hover me</button>
			</Tooltip>
		);

		expect(screen.getByRole('button')).toHaveAttribute(
			'aria-describedby',
			'hint-id'
		);
	});

	test("merges the child's own aria-describedby with the tooltip id when shown", () => {
		render(
			<Tooltip content="Helpful text">
				<button aria-describedby="hint-id">Hover me</button>
			</Tooltip>
		);
		const trigger = screen.getByRole('button');
		const wrapper = trigger.parentElement as HTMLElement;

		act(() => {
			fireEvent.mouseEnter(wrapper);
		});

		const tooltip = screen.getByRole('tooltip');
		const describedBy = trigger.getAttribute('aria-describedby');
		expect(describedBy).toContain('hint-id');
		expect(describedBy).toContain(tooltip.id);
	});

	test('announces temporaryContent through a status region', () => {
		render(
			<Tooltip content="Copy" temporaryContent="Copied!" showOnClick>
				<button>Copy link</button>
			</Tooltip>
		);

		expect(screen.getByRole('status')).toHaveTextContent('');

		act(() => {
			fireEvent.click(screen.getByRole('button'));
		});

		expect(screen.getByRole('status')).toHaveTextContent('Copied!');
	});

	test('renders no status region when temporaryContent is undefined', () => {
		render(
			<Tooltip content="Helpful text">
				<button>Hover me</button>
			</Tooltip>
		);

		expect(screen.queryByRole('status')).not.toBeInTheDocument();
	});

	describe('describeChild', () => {
		function showTooltip(label: string) {
			const trigger = screen.getByRole('button', { name: label });
			act(() => {
				fireEvent.mouseEnter(trigger.parentElement as HTMLElement);
			});
			return trigger;
		}

		test('should not describe the trigger when auto and the text equals its aria-label', () => {
			render(
				<Tooltip content="Delete">
					<button aria-label="Delete" />
				</Tooltip>
			);
			expect(showTooltip('Delete')).not.toHaveAttribute('aria-describedby');
		});

		test('should ignore whitespace differences when comparing with the name', () => {
			render(
				<Tooltip content="  Delete  item ">
					<button aria-label="Delete item" />
				</Tooltip>
			);
			expect(showTooltip('Delete item')).not.toHaveAttribute(
				'aria-describedby'
			);
		});

		test('should not describe the trigger when auto and the text equals its text content', () => {
			render(
				<Tooltip content="Save">
					<button>Save</button>
				</Tooltip>
			);
			expect(showTooltip('Save')).not.toHaveAttribute('aria-describedby');
		});

		test('should describe the trigger when auto and the text differs from its name', () => {
			render(
				<Tooltip content="Removes the item">
					<button aria-label="Delete" />
				</Tooltip>
			);
			const trigger = showTooltip('Delete');
			expect(trigger).toHaveAttribute(
				'aria-describedby',
				screen.getByRole('tooltip').id
			);
		});

		test('should describe the trigger when true even if the text equals its name', () => {
			render(
				<Tooltip content="Delete" describeChild>
					<button aria-label="Delete" />
				</Tooltip>
			);
			const trigger = showTooltip('Delete');
			expect(trigger).toHaveAttribute(
				'aria-describedby',
				screen.getByRole('tooltip').id
			);
		});

		test('should not describe the trigger when false even if the text differs from its name', () => {
			render(
				<Tooltip content="Removes the item" describeChild={false}>
					<button aria-label="Delete" />
				</Tooltip>
			);
			expect(showTooltip('Delete')).not.toHaveAttribute('aria-describedby');
		});

		test.each([
			['auto', undefined],
			['true', true],
			['false', false],
		])(
			"should keep the caller's aria-describedby when describeChild is %s",
			(_label, describeChild) => {
				render(
					<Tooltip content="Delete" describeChild={describeChild}>
						<button aria-label="Delete" aria-describedby="hint-id" />
					</Tooltip>
				);
				expect(
					showTooltip('Delete').getAttribute('aria-describedby')
				).toContain('hint-id');
			}
		);

		test('should compare ReactNode content by its text', () => {
			render(
				<Tooltip
					content={
						<span>
							Del<b>ete</b>
						</span>
					}
				>
					<button aria-label="Delete" />
				</Tooltip>
			);
			expect(showTooltip('Delete')).not.toHaveAttribute('aria-describedby');
		});
	});

	describe('portal target', () => {
		function hoverTrigger(label: string) {
			const trigger = screen.getByRole('button', { name: label });
			act(() => {
				fireEvent.mouseEnter(trigger.parentElement as HTMLElement);
			});
		}

		test('should render the tooltip inside the trigger landmark when there is one', () => {
			render(
				<main data-testid="landmark">
					<Tooltip content="Help">
						<button>Hover me</button>
					</Tooltip>
				</main>
			);
			hoverTrigger('Hover me');
			expect(screen.getByTestId('landmark')).toContainElement(
				screen.getByRole('tooltip')
			);
		});

		test('should render the tooltip in the portalContainer when given', () => {
			const portalContainer = document.createElement('div');
			document.body.append(portalContainer);
			render(
				<main>
					<Tooltip content="Help" portalContainer={portalContainer}>
						<button>Hover me</button>
					</Tooltip>
				</main>
			);
			hoverTrigger('Hover me');
			expect(portalContainer).toContainElement(screen.getByRole('tooltip'));
			portalContainer.remove();
		});

		test('should render the tooltip in the body when there is no landmark', () => {
			render(
				<div data-testid="plain">
					<Tooltip content="Help">
						<button>Hover me</button>
					</Tooltip>
				</div>
			);
			hoverTrigger('Hover me');
			expect(screen.getByRole('tooltip').closest('[data-testid]')).toBeNull();
		});

		test('should have no axe region violations while shown inside a landmark', async () => {
			vi.useRealTimers();
			render(
				<main>
					<Tooltip content="Help">
						<button>Hover me</button>
					</Tooltip>
				</main>
			);
			hoverTrigger('Hover me');
			expect(
				await axe(document.body, { runOnly: ['region'] })
			).toHaveNoViolations();
		});
	});
});
