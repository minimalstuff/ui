import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Kbd } from './kbd';

describe('Kbd', () => {
	test('renders children inside a kbd element', () => {
		render(<Kbd>Ctrl</Kbd>);
		const kbd = screen.getByText('Ctrl');
		expect(kbd.tagName).toBe('KBD');
	});

	test('merges custom className', () => {
		render(<Kbd className="ml-1">K</Kbd>);
		expect(screen.getByText('K')).toHaveClass('ml-1');
	});

	test('applies default size', () => {
		render(<Kbd>Ctrl</Kbd>);
		expect(screen.getByText('Ctrl')).toHaveClass('text-xs', 'px-2');
	});

	test('applies size classes', () => {
		render(<Kbd size="lg">Ctrl</Kbd>);
		expect(screen.getByText('Ctrl')).toHaveClass('text-base', 'px-3');
	});

	test('unstyled drops the default box styling', () => {
		render(<Kbd unstyled>Ctrl</Kbd>);
		expect(screen.getByText('Ctrl')).not.toHaveClass('bg-gray-100');
	});
});
