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

	test('active tabpanel is labelled by and controlled by the active tab', () => {
		render(<Tabs items={ITEMS} />);
		const tab = screen.getByRole('tab', { name: 'First' });
		const panel = screen.getByRole('tabpanel');

		expect(tab).toHaveAttribute('aria-controls', panel.id);
		expect(panel).toHaveAttribute('aria-labelledby', tab.id);
	});

	test('only the active tab is in the roving tab order', () => {
		render(<Tabs items={ITEMS} />);
		expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
			'tabindex',
			'0'
		);
		expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute(
			'tabindex',
			'-1'
		);
	});

	test('ArrowRight moves focus and activation to the next enabled tab', () => {
		render(<Tabs items={ITEMS} />);
		screen.getByRole('tab', { name: 'First' }).focus();

		fireEvent.keyDown(screen.getByRole('tab', { name: 'First' }), {
			key: 'ArrowRight',
		});

		const second = screen.getByRole('tab', { name: 'Second' });
		expect(second).toHaveAttribute('aria-selected', 'true');
		expect(second).toHaveFocus();
	});

	test('ArrowRight skips the disabled tab and wraps around', () => {
		render(<Tabs items={ITEMS} defaultIndex={1} />);
		screen.getByRole('tab', { name: 'Second' }).focus();

		fireEvent.keyDown(screen.getByRole('tab', { name: 'Second' }), {
			key: 'ArrowRight',
		});

		const first = screen.getByRole('tab', { name: 'First' });
		expect(first).toHaveAttribute('aria-selected', 'true');
		expect(first).toHaveFocus();
	});

	test('End moves focus and activation to the last enabled tab', () => {
		render(<Tabs items={ITEMS} />);
		screen.getByRole('tab', { name: 'First' }).focus();

		fireEvent.keyDown(screen.getByRole('tab', { name: 'First' }), {
			key: 'End',
		});

		const second = screen.getByRole('tab', { name: 'Second' });
		expect(second).toHaveAttribute('aria-selected', 'true');
		expect(second).toHaveFocus();
	});

	test('unstyled drops the default tablist and panel styling', () => {
		render(<Tabs items={ITEMS} unstyled />);
		expect(screen.getByRole('tablist')).not.toHaveClass('bg-gray-100');
		expect(screen.getByRole('tabpanel')).not.toHaveClass('bg-white');
		expect(screen.getByRole('tab', { name: 'First' })).not.toHaveClass(
			'bg-white'
		);
	});

	test('disabled tabs stay visually flagged even when unstyled', () => {
		render(<Tabs items={ITEMS} unstyled />);
		expect(screen.getByRole('tab', { name: 'Third' })).toHaveClass(
			'opacity-50',
			'cursor-not-allowed'
		);
	});

	test('stays on the caller value when controlled', () => {
		render(<Tabs items={ITEMS} value={0} onChange={vi.fn()} />);

		fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

		expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
	});

	test('still calls onChange when controlled', () => {
		const handleChange = vi.fn();
		render(<Tabs items={ITEMS} value={0} onChange={handleChange} />);

		fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

		expect(handleChange).toHaveBeenCalledWith(1);
	});

	test('renders the panel for the caller-controlled index', () => {
		render(<Tabs items={ITEMS} value={1} onChange={vi.fn()} />);
		expect(screen.getByText('Second content')).toBeInTheDocument();
	});
});
