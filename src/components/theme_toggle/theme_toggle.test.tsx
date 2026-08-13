import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, test } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ThemeToggle } from './theme_toggle';
import { useThemeStore } from '#stores/theme_store/theme_store';

describe('ThemeToggle', () => {
	afterEach(() => {
		useThemeStore.setState({ theme: 'system' });
		localStorage.clear();
	});

	test('exposes the current theme via aria-label', () => {
		render(<ThemeToggle />);
		expect(screen.getByRole('button')).toHaveAttribute(
			'aria-label',
			'Thème actuel: system'
		);
	});

	test('clicking cycles to the next theme', async () => {
		render(<ThemeToggle />);

		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(useThemeStore.getState().theme).toBe('light');
		});
	});

	test('forwards size to the underlying icon button', () => {
		render(<ThemeToggle size="lg" />);
		expect(screen.getByRole('button')).toHaveClass('p-3');
	});

	test('forwards variant to the underlying icon button', () => {
		render(<ThemeToggle variant="unstyled" />);
		expect(screen.getByRole('button')).not.toHaveClass('border');
	});
});
