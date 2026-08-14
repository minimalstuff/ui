import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { ClientOnly } from './client_only';

describe('ClientOnly', () => {
	test('renders nothing before the client has mounted', () => {
		render(<ClientOnly>Client content</ClientOnly>);
		expect(screen.queryByText('Client content')).not.toBeInTheDocument();
	});

	test('renders children once the client has mounted', async () => {
		render(<ClientOnly>Client content</ClientOnly>);
		await waitFor(() => {
			expect(screen.getByText('Client content')).toBeInTheDocument();
		});
	});

	test('renders the fallback before the client has mounted', () => {
		render(<ClientOnly fallback="Loading…">Client content</ClientOnly>);
		expect(screen.getByText('Loading…')).toBeInTheDocument();
	});

	test('replaces the fallback with children once mounted', async () => {
		render(<ClientOnly fallback="Loading…">Client content</ClientOnly>);
		await waitFor(() => {
			expect(screen.getByText('Client content')).toBeInTheDocument();
		});
		expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
	});
});
