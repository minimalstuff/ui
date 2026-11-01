import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Input } from '#components/input/input';
import { CharacterCount } from './character_count';

describe('CharacterCount', () => {
	test('shows a plain current/max count when showMin/showMax are unset', () => {
		render(<CharacterCount current={5} max={20} />);
		expect(screen.getByText('5/20')).toBeInTheDocument();
	});

	test('shows a plain current (min N) count when only min is set', () => {
		render(<CharacterCount current={3} min={5} />);
		expect(screen.getByText('3 (min 5)')).toBeInTheDocument();
	});

	test('shows separate min and max labels when both showMin and showMax are set', () => {
		render(<CharacterCount current={8} min={3} max={20} showMin showMax />);
		expect(screen.getByText('8/3 min')).toBeInTheDocument();
		expect(screen.getByText('8/20 max')).toBeInTheDocument();
	});

	test('flags the max label amber at the max boundary', () => {
		render(<CharacterCount current={20} max={20} />);
		expect(screen.getByText('20/20')).toHaveClass('text-amber-700');
	});

	test('flags the max label red past the max boundary', () => {
		render(<CharacterCount current={25} max={20} />);
		expect(screen.getByText('25/20')).toHaveClass('text-red-600');
	});

	test('flags the min label amber at the min boundary', () => {
		render(<CharacterCount current={5} min={5} />);
		expect(screen.getByText('5 (min 5)')).toHaveClass('text-amber-700');
	});

	test('does not flag counts within bounds', () => {
		render(<CharacterCount current={10} max={20} />);
		const count = screen.getByText('10/20');
		expect(count).not.toHaveClass('text-amber-700');
		expect(count).not.toHaveClass('text-red-600');
	});

	test('unstyled drops the default text styling, even past the max boundary', () => {
		render(<CharacterCount current={25} max={20} unstyled />);
		const count = screen.getByText('25/20');
		expect(count.parentElement).not.toHaveClass('text-gray-500');
		expect(count).not.toHaveClass('text-red-600');
	});

	test('merges a custom className on the wrapper', () => {
		render(<CharacterCount current={5} max={20} className="mt-4" />);
		expect(screen.getByText('5/20').parentElement).toHaveClass('mt-4');
	});

	test('should announce when the remaining count crosses the threshold', () => {
		const { container, rerender } = render(
			<CharacterCount current={80} max={100} />
		);
		const liveRegion = container.querySelector('[aria-live="polite"]');
		expect(liveRegion).toBeEmptyDOMElement();

		rerender(<CharacterCount current={90} max={100} />);

		expect(liveRegion).toHaveTextContent('10 characters remaining');
	});

	test('should not announce on other keystrokes when the threshold is not crossed', () => {
		const { container, rerender } = render(
			<CharacterCount current={80} max={100} />
		);
		const liveRegion = container.querySelector('[aria-live="polite"]');

		rerender(<CharacterCount current={85} max={100} />);
		expect(liveRegion).toBeEmptyDOMElement();

		rerender(<CharacterCount current={90} max={100} />);
		rerender(<CharacterCount current={92} max={100} />);
		expect(liveRegion).toHaveTextContent('10 characters remaining');
	});

	test('should announce when the limit is reached', () => {
		const { container, rerender } = render(
			<CharacterCount current={95} max={100} />
		);
		const liveRegion = container.querySelector('[aria-live="polite"]');

		rerender(<CharacterCount current={100} max={100} />);

		expect(liveRegion).toHaveTextContent('0 characters remaining');
	});

	test('should not include the announcement in the field accessible description when the threshold is crossed', () => {
		render(<Input label="Name" showCharCount maxLength={100} />);
		const input = screen.getByRole('textbox');

		fireEvent.change(input, { target: { value: 'a'.repeat(95) } });

		expect(screen.getByText('5 characters remaining')).toBeInTheDocument();
		expect(input).toHaveAccessibleDescription('95/100 max');
	});

	test('should use the singular form in the default label when one character remains', () => {
		const { container, rerender } = render(
			<CharacterCount current={50} max={100} />
		);
		rerender(<CharacterCount current={99} max={100} />);
		expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent(
			'1 character remaining'
		);
	});
});
