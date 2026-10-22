import '@testing-library/jest-dom/vitest';

import { axe } from 'vitest-axe';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

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

	test('defaultIndex on a disabled tab moves the tab stop to the first enabled tab', () => {
		render(<Tabs items={ITEMS} defaultIndex={2} />);

		expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
			'tabindex',
			'0'
		);
		expect(screen.getByRole('tab', { name: 'Third' })).toHaveAttribute(
			'tabindex',
			'-1'
		);
		expect(screen.getByRole('tab', { name: 'Third' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
	});

	test('the fallback tab stop is reachable and keeps the disabled tab active', () => {
		render(<Tabs items={ITEMS} defaultIndex={2} />);

		screen.getByRole('tab', { name: 'First' }).focus();

		expect(screen.getByRole('tab', { name: 'First' })).toHaveFocus();
		expect(screen.getByRole('tab', { name: 'Third' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
	});

	test('a controlled value pointing at a disabled tab also falls the tab stop back', () => {
		render(<Tabs items={ITEMS} value={2} onChange={vi.fn()} />);

		expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
			'tabindex',
			'0'
		);
		expect(screen.getByRole('tab', { name: 'Third' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
	});

	test('ArrowRight from the fallback tab stop moves to the next enabled tab', () => {
		render(<Tabs items={ITEMS} defaultIndex={2} />);
		const firstTab = screen.getByRole('tab', { name: 'First' });
		firstTab.focus();

		fireEvent.keyDown(firstTab, { key: 'ArrowRight' });

		const secondTab = screen.getByRole('tab', { name: 'Second' });
		expect(secondTab).toHaveAttribute('aria-selected', 'true');
		expect(secondTab).toHaveFocus();
	});

	test('only the active tab carries aria-controls, pointing at the rendered tabpanel', () => {
		render(<Tabs items={ITEMS} />);
		const panel = screen.getByRole('tabpanel');

		expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
			'aria-controls',
			panel.id
		);
		expect(screen.getByRole('tab', { name: 'Second' })).not.toHaveAttribute(
			'aria-controls'
		);
		expect(screen.getByRole('tab', { name: 'Third' })).not.toHaveAttribute(
			'aria-controls'
		);
	});

	test('the tab icon is hidden from assistive technology', () => {
		const itemsWithIcon = [
			{ title: 'First', content: 'First content', icon: 'i-lucide-home' },
			{ title: 'Second', content: 'Second content' },
		];
		const { container } = render(<Tabs items={itemsWithIcon} />);
		expect(container.querySelector('.i-lucide-home')).toHaveAttribute(
			'aria-hidden',
			'true'
		);
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

describe('Tabs vertical orientation', () => {
	const originalAnimateDescriptor = Object.getOwnPropertyDescriptor(
		Element.prototype,
		'animate'
	);

	afterEach(() => {
		if (!originalAnimateDescriptor) {
			Reflect.deleteProperty(Element.prototype, 'animate');
		} else {
			Object.defineProperty(
				Element.prototype,
				'animate',
				originalAnimateDescriptor
			);
		}
		vi.restoreAllMocks();
		cleanup();
	});

	const pressKey = (tabName: string, key: string) => {
		const tab = screen.getByRole('tab', { name: tabName });
		tab.focus();
		fireEvent.keyDown(tab, { key });
	};

	test('should set aria-orientation to horizontal by default', () => {
		render(<Tabs items={ITEMS} />);
		expect(screen.getByRole('tablist')).toHaveAttribute(
			'aria-orientation',
			'horizontal'
		);
	});

	test('should use an inset focus outline on vertical tabs and panel', () => {
		render(<Tabs items={ITEMS} orientation="vertical" />);
		const insetOffset = 'focus-visible:-outline-offset-2';
		expect(screen.getByRole('tab', { name: 'First' })).toHaveClass(insetOffset);
		expect(screen.getByRole('tabpanel')).toHaveClass(insetOffset);
	});

	test('should keep the outward focus outline on horizontal tabs', () => {
		render(<Tabs items={ITEMS} />);
		expect(screen.getByRole('tab', { name: 'First' })).toHaveClass(
			'focus-visible:outline-offset-2'
		);
	});

	test('should not overlap the list border or scroll horizontally when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" />);
		expect(screen.getByRole('tab', { name: 'First' })).not.toHaveClass(
			'-mr-px'
		);
		expect(screen.getByRole('tablist')).toHaveClass('overflow-x-hidden');
	});

	test('should set aria-orientation to vertical when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" />);
		expect(screen.getByRole('tablist')).toHaveAttribute(
			'aria-orientation',
			'vertical'
		);
	});

	test('should move to the next tab on ArrowDown when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" />);

		pressKey('First', 'ArrowDown');

		const second = screen.getByRole('tab', { name: 'Second' });
		expect(second).toHaveAttribute('aria-selected', 'true');
		expect(second).toHaveFocus();
	});

	test('should wrap to the first enabled tab on ArrowDown from the last when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" defaultIndex={1} />);

		pressKey('Second', 'ArrowDown');

		expect(screen.getByRole('tab', { name: 'First' })).toHaveFocus();
	});

	test('should wrap to the last enabled tab on ArrowUp from the first when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" />);

		pressKey('First', 'ArrowUp');

		const second = screen.getByRole('tab', { name: 'Second' });
		expect(second).toHaveAttribute('aria-selected', 'true');
		expect(second).toHaveFocus();
	});

	test('should ignore ArrowRight and ArrowLeft when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" />);
		const first = screen.getByRole('tab', { name: 'First' });
		first.focus();

		const wasRightPrevented = !fireEvent.keyDown(first, { key: 'ArrowRight' });
		const wasLeftPrevented = !fireEvent.keyDown(first, { key: 'ArrowLeft' });

		expect(wasRightPrevented).toBe(false);
		expect(wasLeftPrevented).toBe(false);
		expect(first).toHaveAttribute('aria-selected', 'true');
		expect(first).toHaveFocus();
	});

	test('should ignore ArrowDown and ArrowUp when horizontal', () => {
		render(<Tabs items={ITEMS} />);
		const first = screen.getByRole('tab', { name: 'First' });
		first.focus();

		const wasDownPrevented = !fireEvent.keyDown(first, { key: 'ArrowDown' });
		const wasUpPrevented = !fireEvent.keyDown(first, { key: 'ArrowUp' });

		expect(wasDownPrevented).toBe(false);
		expect(wasUpPrevented).toBe(false);
		expect(first).toHaveAttribute('aria-selected', 'true');
	});

	test('should move to the last enabled tab on End when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" />);

		pressKey('First', 'End');

		expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus();
	});

	test('should move to the first enabled tab on Home when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" defaultIndex={1} />);

		pressKey('Second', 'Home');

		expect(screen.getByRole('tab', { name: 'First' })).toHaveFocus();
	});

	test('should skip disabled tabs on ArrowDown when vertical', () => {
		const items = [
			{ title: 'First', content: 'First content' },
			{ title: 'Second', content: 'Second content', disabled: true },
			{ title: 'Third', content: 'Third content' },
		];
		render(<Tabs items={items} orientation="vertical" />);

		pressKey('First', 'ArrowDown');

		expect(screen.getByRole('tab', { name: 'Third' })).toHaveFocus();
	});

	test('should lay the root out as a row when vertical', () => {
		const { container } = render(
			<Tabs items={ITEMS} orientation="vertical" className="custom-root" />
		);
		expect(container.firstChild).toHaveClass('flex', 'min-h-0', 'custom-root');
	});

	test('should stack the tablist in a column that scrolls on its own when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" />);
		expect(screen.getByRole('tablist')).toHaveClass(
			'flex-col',
			'min-h-0',
			'overflow-y-auto',
			'w-48'
		);
	});

	test('should let tabListClassName override the tablist width when vertical', () => {
		render(
			<Tabs items={ITEMS} orientation="vertical" tabListClassName="w-64" />
		);
		expect(screen.getByRole('tablist').className.endsWith('w-64')).toBe(true);
	});

	test('should scroll the panel on its own and drop the top margin when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" />);
		const panel = screen.getByRole('tabpanel');
		expect(panel).toHaveClass(
			'flex-1',
			'min-w-0',
			'min-h-0',
			'overflow-y-auto'
		);
		expect(panel).not.toHaveClass('mt-4');
	});

	test('should let tabs wrap and align left when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" />);
		expect(screen.getByRole('tab', { name: 'First' })).toHaveClass(
			'whitespace-normal',
			'justify-start',
			'text-left'
		);
	});

	test('should ignore fullWidth when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" fullWidth />);
		expect(screen.getByRole('tab', { name: 'First' })).not.toHaveClass(
			'flex-1'
		);
		expect(screen.getByRole('tablist')).not.toHaveClass('w-full');
	});

	test('should put the line variant border on the side when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" />);
		expect(screen.getByRole('tablist')).toHaveClass('border-r');
		expect(screen.getByRole('tablist')).not.toHaveClass('border-b');
		expect(
			screen
				.getByRole('tab', { name: 'First' })
				.querySelector('.tabs-indicator')
		).toHaveClass('w-0.5', '-right-0.5');
	});

	test('should keep the segmented track padding when vertical', () => {
		render(<Tabs items={ITEMS} orientation="vertical" variant="segmented" />);
		expect(screen.getByRole('tablist')).toHaveClass('p-1', 'bg-gray-100');
	});

	test('should animate the indicator along the Y axis when vertical', () => {
		const animate = vi.fn();
		Object.defineProperty(Element.prototype, 'animate', {
			value: animate,
			configurable: true,
			writable: true,
		});
		const rects = [
			{ top: 0, height: 40 },
			{ top: 48, height: 40 },
		];
		let rectCallCount = 0;
		vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
			() => {
				const rect = rects[Math.min(rectCallCount, rects.length - 1)];
				rectCallCount += 1;
				return rect as DOMRect;
			}
		);
		render(<Tabs items={ITEMS} orientation="vertical" />);

		fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

		expect(animate).toHaveBeenCalledWith(
			[
				{ transform: 'translateY(-48px)', height: '40px' },
				{ transform: 'none', height: '40px' },
			],
			expect.any(Object)
		);
	});

	test('should have no axe violations for the vertical line variant', async () => {
		const { container } = render(<Tabs items={ITEMS} orientation="vertical" />);
		expect(await axe(container)).toHaveNoViolations();
	});

	test('should have no axe violations for the vertical segmented variant', async () => {
		const { container } = render(
			<Tabs items={ITEMS} orientation="vertical" variant="segmented" />
		);
		expect(await axe(container)).toHaveNoViolations();
	});
});
