import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Button } from './button';

describe('Button', () => {
	test('renders children', () => {
		render(<Button>Click me</Button>);
		expect(
			screen.getByRole('button', { name: 'Click me' })
		).toBeInTheDocument();
	});

	test('applies default variant and size', () => {
		render(<Button>Submit</Button>);
		const btn = screen.getByRole('button');
		expect(btn).toHaveClass('bg-blue-600');
		expect(btn).toHaveClass('px-4', 'py-2');
	});

	test('applies color class', () => {
		render(<Button color="danger">Delete</Button>);
		expect(screen.getByRole('button')).toHaveClass('bg-red-600');
	});

	test('applies variant class', () => {
		render(
			<Button variant="outline" color="neutral">
				Cancel
			</Button>
		);
		expect(screen.getByRole('button')).toHaveClass('border-gray-300');
	});

	test('forwards disabled', () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	test('marks the button busy while loading', () => {
		render(<Button loading>Submit</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
	});

	test('is not marked busy when not loading', () => {
		render(<Button>Submit</Button>);
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
	});

	test('unstyled variant drops the padding and typography classes', () => {
		render(<Button variant="unstyled">Submit</Button>);
		expect(screen.getByRole('button')).not.toHaveClass('px-4');
	});

	test('unstyled variant keeps the icon layout classes', () => {
		render(<Button variant="unstyled">Submit</Button>);
		expect(screen.getByRole('button')).toHaveClass('inline-flex');
	});
});
