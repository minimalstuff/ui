import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Highlight, splitIntoHighlightSegments } from './highlight';

describe('splitIntoHighlightSegments', () => {
	test('returns a single unmatched segment when there are no ranges', () => {
		expect(splitIntoHighlightSegments('hello', [])).toEqual([
			{ text: 'hello', isMatch: false },
		]);
	});

	test('splits matched and unmatched segments around a range', () => {
		expect(splitIntoHighlightSegments('hello world', [6, 11])).toEqual([
			{ text: 'hello ', isMatch: false },
			{ text: 'world', isMatch: true },
		]);
	});

	test('handles multiple non-overlapping ranges', () => {
		expect(splitIntoHighlightSegments('abcdef', [0, 1, 3, 4])).toEqual([
			{ text: 'a', isMatch: true },
			{ text: 'bc', isMatch: false },
			{ text: 'd', isMatch: true },
			{ text: 'ef', isMatch: false },
		]);
	});
});

describe('Highlight', () => {
	test('renders plain text when there are no ranges', () => {
		render(<Highlight text="hello" ranges={[]} />);
		expect(screen.getByText('hello')).toBeInTheDocument();
	});

	test('wraps matched ranges in a mark element', () => {
		render(<Highlight text="hello world" ranges={[6, 11]} />);
		expect(screen.getByText('world').tagName).toBe('MARK');
	});
});
