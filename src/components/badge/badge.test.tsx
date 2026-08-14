import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Badge } from './badge';

describe('Badge', () => {
	test('renders children', () => {
		render(<Badge>New</Badge>);
		expect(screen.getByText('New')).toBeInTheDocument();
	});

	test('applies default color, variant and size', () => {
		render(<Badge>New</Badge>);
		const badge = screen.getByText('New');
		expect(badge).toHaveClass('bg-blue-50', 'text-sm', 'px-2.5', 'py-1');
	});

	test('applies color class', () => {
		render(<Badge color="danger">Error</Badge>);
		expect(screen.getByText('Error')).toHaveClass('bg-red-50');
	});

	test('applies solid variant', () => {
		render(
			<Badge color="danger" variant="solid">
				Error
			</Badge>
		);
		expect(screen.getByText('Error')).toHaveClass('bg-red-600', 'text-white');
	});

	test('applies outline variant', () => {
		render(
			<Badge color="danger" variant="outline">
				Error
			</Badge>
		);
		expect(screen.getByText('Error')).toHaveClass('border-red-300');
	});

	test('applies size classes', () => {
		render(<Badge size="xs">Small</Badge>);
		expect(screen.getByText('Small')).toHaveClass('text-xs', 'px-1.5');
	});

	test('applies text-base (not text-md) for the md size', () => {
		render(<Badge size="md">Medium</Badge>);
		expect(screen.getByText('Medium')).toHaveClass('text-base');
	});

	test('applies radius class', () => {
		render(<Badge radius="full">Pill</Badge>);
		expect(screen.getByText('Pill')).toHaveClass('rounded-full');
	});

	test('forwards a custom className alongside its own classes', () => {
		render(<Badge className="custom">Pill</Badge>);
		const badge = screen.getByText('Pill');
		expect(badge).toHaveClass('custom');
		expect(badge).toHaveClass('inline-flex');
	});

	test('forwards a ref to the underlying span', () => {
		const ref = { current: null as HTMLSpanElement | null };
		render(<Badge ref={ref}>Pill</Badge>);
		expect(ref.current).toBe(screen.getByText('Pill'));
	});
});
