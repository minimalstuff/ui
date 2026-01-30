import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
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

	test('applies variant class', () => {
		render(<Button variant="danger">Delete</Button>);
		expect(screen.getByRole('button')).toHaveClass('bg-red-600');
	});

	test('forwards disabled', () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole('button')).toBeDisabled();
	});
});
