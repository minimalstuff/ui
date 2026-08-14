import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ModalBody } from './modal_body';

describe('ModalBody', () => {
	test('renders children', () => {
		render(<ModalBody>Scrollable content</ModalBody>);
		expect(screen.getByText('Scrollable content')).toBeInTheDocument();
	});

	test('forwards a custom className alongside its own classes', () => {
		render(<ModalBody className="custom">Content</ModalBody>);
		const body = screen.getByText('Content');
		expect(body).toHaveClass('custom');
		expect(body).toHaveClass('overflow-y-auto');
	});
});
