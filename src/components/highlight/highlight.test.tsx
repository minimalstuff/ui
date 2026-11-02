import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Highlight } from '#components/highlight/highlight';

describe('Highlight', () => {
	test('renders plain text when there are no ranges', () => {
		render(<Highlight text="hello" ranges={[]} />);
		expect(screen.getByText('hello')).toBeInTheDocument();
	});

	test('wraps matched ranges in a mark element', () => {
		render(<Highlight text="hello world" ranges={[6, 11]} />);
		expect(screen.getByText('world').tagName).toBe('MARK');
	});

	test('renders rounded-sm, equivalent to the former rounded, by default', () => {
		render(<Highlight text="hello world" ranges={[6, 11]} />);
		expect(screen.getByText('world')).toHaveClass(
			'rounded-sm',
			'bg-yellow-200',
			'text-yellow-900'
		);
	});

	test('applies the radius prop', () => {
		render(<Highlight text="hello world" ranges={[6, 11]} radius="full" />);
		expect(screen.getByText('world')).toHaveClass('rounded-full');
	});

	test('removes the library classes when unstyled', () => {
		render(<Highlight unstyled text="hello world" ranges={[6, 11]} />);
		const mark = screen.getByText('world');
		expect(mark).not.toHaveClass(
			'rounded-sm',
			'bg-yellow-200',
			'text-yellow-900'
		);
		expect(mark.className).toBe('');
	});

	test('applies markClassName to every mark, styled or not', () => {
		render(
			<Highlight
				unstyled
				text="aa bb cc"
				ranges={[0, 2, 6, 8]}
				markClassName="custom"
			/>
		);
		const marks = document.querySelectorAll('mark');
		expect(marks).toHaveLength(2);
		marks.forEach((mark) => {
			expect(mark).toHaveClass('custom');
		});
	});

	test('keeps markClassName alongside library classes when styled', () => {
		render(
			<Highlight text="hello world" ranges={[6, 11]} markClassName="custom" />
		);
		expect(screen.getByText('world')).toHaveClass('custom', 'bg-yellow-200');
	});
});
