import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { CharacterCount } from './char_count';

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
		expect(screen.getByText('20/20')).toHaveClass('text-amber-600');
	});

	test('flags the max label red past the max boundary', () => {
		render(<CharacterCount current={25} max={20} />);
		expect(screen.getByText('25/20')).toHaveClass('text-red-600');
	});

	test('flags the min label amber at the min boundary', () => {
		render(<CharacterCount current={5} min={5} />);
		expect(screen.getByText('5 (min 5)')).toHaveClass('text-amber-600');
	});

	test('does not flag counts within bounds', () => {
		render(<CharacterCount current={10} max={20} />);
		const count = screen.getByText('10/20');
		expect(count).not.toHaveClass('text-amber-600');
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
});
