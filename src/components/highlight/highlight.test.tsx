import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Highlight } from './highlight';

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
