import '@testing-library/jest-dom/vitest';

import { renderToString } from 'react-dom/server';
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
		expect(screen.getByRole('tablist')).not.toHaveClass('border-b');
		expect(screen.getByRole('tabpanel')).not.toHaveClass('mt-4');
		expect(screen.getByRole('tab', { name: 'First' })).not.toHaveClass(
			'border-blue-600'
		);
	});

	test('disabled tabs stay visually flagged even when unstyled', () => {
		render(<Tabs items={ITEMS} unstyled />);
		expect(screen.getByRole('tab', { name: 'Third' })).toHaveClass(
			'opacity-50',
			'cursor-not-allowed'
		);
	});

	test('line variant is the default', () => {
		render(<Tabs items={ITEMS} />);
		expect(screen.getByRole('tablist')).toHaveClass('border-b');
	});

	test('segmented variant renders the track', () => {
		render(<Tabs items={ITEMS} variant="segmented" />);
		expect(screen.getByRole('tablist')).toHaveClass('bg-gray-100');
	});

	test('segmented variant rounds the track', () => {
		render(<Tabs items={ITEMS} variant="segmented" radius="lg" />);
		expect(screen.getByRole('tablist')).toHaveClass('rounded-lg');
	});

	test('line variant leaves the track unrounded', () => {
		render(<Tabs items={ITEMS} radius="lg" />);
		expect(screen.getByRole('tablist')).not.toHaveClass('rounded-lg');
	});

	test('tabs carry a focus-visible outline when styled', () => {
		render(<Tabs items={ITEMS} />);
		expect(screen.getByRole('tab', { name: 'First' })).toHaveClass(
			'focus-visible:outline-2'
		);
	});

	test('fullWidth stretches the tabs', () => {
		render(<Tabs items={ITEMS} fullWidth />);
		expect(screen.getByRole('tab', { name: 'First' })).toHaveClass('flex-1');
	});

	test('size drives the tab padding', () => {
		render(<Tabs items={ITEMS} size="sm" />);
		expect(screen.getByRole('tab', { name: 'First' })).toHaveClass('px-3');
	});

	test('icons render', () => {
		const itemsWithIcon = [
			{ title: 'First', content: 'First content', icon: 'i-lucide-home' },
			{ title: 'Second', content: 'Second content' },
		];
		const { container } = render(<Tabs items={itemsWithIcon} />);
		expect(container.querySelector('.i-lucide-home')).toBeInTheDocument();
	});

	test('renders the indicator in server-rendered markup', () => {
		expect(renderToString(<Tabs items={ITEMS} />)).toContain('tabs-indicator');
	});

	test('renders the active panel content in server-rendered markup', () => {
		expect(renderToString(<Tabs items={ITEMS} />)).toContain('First content');
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

	test('indicator renders inside the active tab by default', () => {
		render(<Tabs items={ITEMS} />);
		const activeTab = screen.getByRole('tab', { name: 'First' });
		expect(activeTab.querySelector('.tabs-indicator')).toBeInTheDocument();
	});

	test('indicator moves with the active tab', () => {
		render(<Tabs items={ITEMS} />);

		fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

		const secondTab = screen.getByRole('tab', { name: 'Second' });
		expect(secondTab.querySelector('.tabs-indicator')).toBeInTheDocument();
	});

	test('indicator leaves the previously active tab', () => {
		render(<Tabs items={ITEMS} />);

		fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

		const firstTab = screen.getByRole('tab', { name: 'First' });
		expect(firstTab.querySelector('.tabs-indicator')).not.toBeInTheDocument();
	});

	test('no indicator when unstyled', () => {
		const { container } = render(<Tabs items={ITEMS} unstyled />);
		expect(container.querySelector('.tabs-indicator')).not.toBeInTheDocument();
	});

	test('animated={false} still renders the indicator', () => {
		render(<Tabs items={ITEMS} animated={false} />);
		const activeTab = screen.getByRole('tab', { name: 'First' });
		expect(activeTab.querySelector('.tabs-indicator')).toBeInTheDocument();
	});

	test('animated={false} drops the panel animation', () => {
		const { container } = render(<Tabs items={ITEMS} animated={false} />);
		expect(
			container.querySelector('.tabs-panel-inner')
		).not.toBeInTheDocument();
	});

	test('segmented indicator is rounded', () => {
		render(<Tabs items={ITEMS} variant="segmented" radius="lg" />);
		const activeTab = screen.getByRole('tab', { name: 'First' });
		const indicator = activeTab.querySelector('.tabs-indicator');
		expect(indicator).toBeInTheDocument();
		expect(indicator).toHaveClass('rounded-lg');
	});
});
