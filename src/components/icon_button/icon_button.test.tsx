import '@testing-library/jest-dom/vitest';

import { axe } from 'vitest-axe';
import { describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { IconButton } from './icon_button';

describe('IconButton', () => {
	test('should have no axe violations when rendered with an aria-label', async () => {
		const { container } = render(
			<IconButton icon="i-mdi-close" aria-label="Close" />
		);
		expect(await axe(container)).toHaveNoViolations();
	});

	test('exposes the aria-label as the accessible name', () => {
		render(<IconButton icon="i-mdi-close" aria-label="Close" />);
		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
	});

	test('applies the default outline/neutral color classes', () => {
		render(<IconButton icon="i-mdi-close" aria-label="Close" />);
		expect(screen.getByRole('button')).toHaveClass('border-gray-300');
	});

	test('applies color class', () => {
		render(
			<IconButton icon="i-mdi-delete" aria-label="Delete" color="danger" />
		);
		expect(screen.getByRole('button')).toHaveClass('border-red-300');
	});

	test('applies size class', () => {
		render(<IconButton icon="i-mdi-cog" aria-label="Settings" size="lg" />);
		expect(screen.getByRole('button')).toHaveClass('p-3');
	});

	test('applies the xs size class', () => {
		render(<IconButton icon="i-mdi-cog" aria-label="Settings" size="xs" />);
		expect(screen.getByRole('button')).toHaveClass('p-1');
	});

	test('applies the sm size class', () => {
		render(<IconButton icon="i-mdi-cog" aria-label="Settings" size="sm" />);
		expect(screen.getByRole('button')).toHaveClass('p-2');
	});

	test('renders children next to the icon', () => {
		render(
			<IconButton icon="i-mdi-heart" aria-label="Like">
				{' '}
				Like
			</IconButton>
		);
		expect(screen.getByRole('button')).toHaveTextContent('Like');
	});

	test('forwards disabled', () => {
		render(<IconButton icon="i-mdi-close" aria-label="Close" disabled />);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	test('calls onClick when clicked', () => {
		const handleClick = vi.fn();
		render(
			<IconButton icon="i-mdi-close" aria-label="Close" onClick={handleClick} />
		);

		fireEvent.click(screen.getByRole('button'));

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test('unstyled drops the default button styling', () => {
		render(<IconButton icon="i-mdi-close" aria-label="Close" unstyled />);
		expect(screen.getByRole('button')).not.toHaveClass('border-gray-300');
	});

	describe('tooltip', () => {
		function hoverButton() {
			const button = screen.getByRole('button');
			act(() => {
				fireEvent.mouseEnter(button.parentElement as HTMLElement);
			});
			return button;
		}

		test('should render no wrapper when tooltip is not set', () => {
			render(<IconButton icon="i-mdi-close" aria-label="Close" />);
			expect(screen.getByRole('button').parentElement).toBe(
				document.body.firstElementChild
			);
		});

		test('should show the aria-label in a tooltip on hover when tooltip is true', () => {
			render(<IconButton icon="i-mdi-close" aria-label="Close" tooltip />);
			hoverButton();
			expect(screen.getByRole('tooltip')).toHaveTextContent('Close');
		});

		test('should show the tooltip on focus when tooltip is true', () => {
			render(<IconButton icon="i-mdi-close" aria-label="Close" tooltip />);
			act(() => {
				fireEvent.focus(
					screen.getByRole('button').parentElement as HTMLElement
				);
			});
			expect(screen.getByRole('tooltip')).toBeInTheDocument();
		});

		test('should not describe the button when the tooltip repeats the aria-label', () => {
			render(<IconButton icon="i-mdi-close" aria-label="Close" tooltip />);
			expect(hoverButton()).not.toHaveAttribute('aria-describedby');
		});

		test('should apply the position when tooltip is a position string', () => {
			render(
				<IconButton icon="i-mdi-close" aria-label="Close" tooltip="right" />
			);
			hoverButton();
			expect(screen.getByRole('tooltip')).toHaveClass(
				'data-[state=closed]:-translate-x-1'
			);
		});

		test('should apply the position when tooltip is an object', () => {
			render(
				<IconButton
					icon="i-mdi-close"
					aria-label="Close"
					tooltip={{ position: 'left' }}
				/>
			);
			hoverButton();
			expect(screen.getByRole('tooltip')).toHaveClass(
				'data-[state=closed]:translate-x-1'
			);
		});

		test('should describe the button when the tooltip has custom content', () => {
			render(
				<IconButton
					icon="i-mdi-close"
					aria-label="Close"
					tooltip={{ content: 'Closes the panel' }}
				/>
			);
			expect(hoverButton()).toHaveAttribute(
				'aria-describedby',
				screen.getByRole('tooltip').id
			);
		});

		test('should reach the button with the ref when tooltip is set', () => {
			const ref = { current: null as HTMLButtonElement | null };
			render(
				<IconButton icon="i-mdi-close" aria-label="Close" tooltip ref={ref} />
			);
			expect(ref.current).toBe(screen.getByRole('button'));
		});

		test('should show the tooltip when the button is unstyled', () => {
			render(
				<IconButton icon="i-mdi-close" aria-label="Close" tooltip unstyled />
			);
			hoverButton();
			expect(screen.getByRole('tooltip')).toHaveTextContent('Close');
		});

		test('should have no axe violations while the tooltip is shown', async () => {
			render(
				<main>
					<IconButton icon="i-mdi-close" aria-label="Close" tooltip />
				</main>
			);
			hoverButton();
			expect(await axe(document.body)).toHaveNoViolations();
		});
	});
});
