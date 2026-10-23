import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';
import type { SyntheticEvent } from 'react';
import { describe, expect, test, vi } from 'vitest';

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

	test('keeps a loading button natively enabled and marks it aria-disabled', () => {
		render(<Button loading>Submit</Button>);
		const button = screen.getByRole('button');
		expect(button).not.toBeDisabled();
		expect(button).toHaveAttribute('aria-disabled', 'true');
	});

	test('lets a loading button receive focus', () => {
		render(<Button loading>Submit</Button>);
		const button = screen.getByRole('button');
		button.focus();
		expect(button).toHaveFocus();
	});

	test('does not mark an idle button aria-disabled', () => {
		render(<Button>Submit</Button>);
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-disabled');
	});

	test('calls onClick when idle', () => {
		const onClick = vi.fn<() => void>();
		render(<Button onClick={onClick}>Submit</Button>);
		fireEvent.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	test('does not call onClick when a loading button is clicked', () => {
		const onClick = vi.fn<() => void>();
		render(
			<Button loading onClick={onClick}>
				Submit
			</Button>
		);
		fireEvent.click(screen.getByRole('button'));
		expect(onClick).not.toHaveBeenCalled();
	});

	test('does not submit the form when a loading submit button is clicked', () => {
		const onSubmit = vi.fn<
			(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void
		>((event) => {
			event.preventDefault();
		});
		render(
			<form onSubmit={onSubmit}>
				<Button type="submit" loading>
					Submit
				</Button>
			</form>
		);
		fireEvent.click(screen.getByRole('button'));
		expect(onSubmit).not.toHaveBeenCalled();
	});

	test('keeps an explicitly disabled button natively disabled while loading', () => {
		render(
			<Button disabled loading>
				Submit
			</Button>
		);
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

	test('unstyled drops the padding and typography classes', () => {
		render(<Button unstyled>Submit</Button>);
		expect(screen.getByRole('button')).not.toHaveClass('px-4');
	});

	test('unstyled keeps the icon layout classes', () => {
		render(<Button unstyled>Submit</Button>);
		expect(screen.getByRole('button')).toHaveClass('inline-flex');
	});
});
