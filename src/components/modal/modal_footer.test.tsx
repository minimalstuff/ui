import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ModalFooter } from './modal_footer';

describe('ModalFooter', () => {
	test('renders children', () => {
		render(<ModalFooter>Actions</ModalFooter>);
		expect(screen.getByText('Actions')).toBeInTheDocument();
	});

	test('forwards a custom className alongside its own classes', () => {
		render(<ModalFooter className="custom">Actions</ModalFooter>);
		const footer = screen.getByText('Actions');
		expect(footer).toHaveClass('custom');
		expect(footer).toHaveClass('justify-end');
	});
});
