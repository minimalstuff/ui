import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MenuSeparator } from './menu_separator';

describe('MenuSeparator', () => {
	test('renders a horizontal separator', () => {
		render(<MenuSeparator />);
		expect(screen.getByRole('separator')).toHaveAttribute(
			'aria-orientation',
			'horizontal'
		);
	});

	test('is not exposed as a menu item', () => {
		render(<MenuSeparator />);
		expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
	});

	test('applies its own border classes by default', () => {
		render(<MenuSeparator />);
		expect(screen.getByRole('separator')).toHaveClass('border-t');
	});

	test('drops its border classes when unstyled', () => {
		render(<MenuSeparator unstyled />);
		expect(screen.getByRole('separator')).not.toHaveClass('border-t');
	});

	test('forwards a custom className', () => {
		render(<MenuSeparator className="custom" />);
		expect(screen.getByRole('separator')).toHaveClass('custom');
	});
});
