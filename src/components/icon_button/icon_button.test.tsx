import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { IconButton } from './icon_button';

describe('IconButton', () => {
	test('exposes the aria-label as the accessible name', () => {
		render(<IconButton icon="i-mdi-close" aria-label="Close" />);
		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
	});

	test('applies the default outline/neutral color classes', () => {
		render(<IconButton icon="i-mdi-close" aria-label="Close" />);
		expect(screen.getByRole('button')).toHaveClass('border-gray-300');
	});

	test('applies color class', () => {
		render(
			<IconButton icon="i-mdi-delete" aria-label="Delete" color="danger" />
		);
		expect(screen.getByRole('button')).toHaveClass('border-red-300');
	});

	test('applies size class', () => {
		render(<IconButton icon="i-mdi-cog" aria-label="Settings" size="lg" />);
		expect(screen.getByRole('button')).toHaveClass('p-3');
	});

	test('renders children next to the icon', () => {
		render(
			<IconButton icon="i-mdi-heart" aria-label="Like">
				{' '}
				Like
			</IconButton>
		);
		expect(screen.getByRole('button')).toHaveTextContent('Like');
	});

	test('forwards disabled', () => {
		render(<IconButton icon="i-mdi-close" aria-label="Close" disabled />);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	test('calls onClick when clicked', () => {
		const handleClick = vi.fn();
		render(
			<IconButton icon="i-mdi-close" aria-label="Close" onClick={handleClick} />
		);

		fireEvent.click(screen.getByRole('button'));

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test('unstyled variant drops the default button styling', () => {
		render(
			<IconButton icon="i-mdi-close" aria-label="Close" variant="unstyled" />
		);
		expect(screen.getByRole('button')).not.toHaveClass('border-gray-300');
	});
});
