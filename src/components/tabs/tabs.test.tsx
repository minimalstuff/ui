import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Tabs } from './tabs';

const ITEMS = [
	{ title: 'First', content: 'First content' },
	{ title: 'Second', content: 'Second content' },
	{ title: 'Third', content: 'Third content', disabled: true },
];

describe('Tabs', () => {
	test('renders all tab titles', () => {
		render(<Tabs items={ITEMS} />);
		expect(screen.getByRole('tab', { name: 'First' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Second' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Third' })).toBeInTheDocument();
	});

	test('first tab is active by default', () => {
		render(<Tabs items={ITEMS} />);
		expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		expect(screen.getByText('First content')).toBeInTheDocument();
	});

	test('respects defaultIndex', () => {
		render(<Tabs items={ITEMS} defaultIndex={1} />);
		expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		expect(screen.getByText('Second content')).toBeInTheDocument();
	});

	test('clicking a tab switches the active panel', () => {
		render(<Tabs items={ITEMS} />);

		fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

		expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		expect(screen.getByText('Second content')).toBeInTheDocument();
	});

	test('calls onChange with the clicked index', () => {
		const handleChange = vi.fn();
		render(<Tabs items={ITEMS} onChange={handleChange} />);

		fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

		expect(handleChange).toHaveBeenCalledWith(1);
	});

	test('disabled tab cannot be activated', () => {
		const handleChange = vi.fn();
		render(<Tabs items={ITEMS} onChange={handleChange} />);

		fireEvent.click(screen.getByRole('tab', { name: 'Third' }));

		expect(handleChange).not.toHaveBeenCalled();
		expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
	});

	test('disabled tab is marked disabled', () => {
		render(<Tabs items={ITEMS} />);
		expect(screen.getByRole('tab', { name: 'Third' })).toBeDisabled();
	});
});
