import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { useDropdownViewportFit } from '#components/shared/use_dropdown_viewport_fit';

const VIEWPORT_WIDTH = 1000;

function Harness({ isOpen }: Readonly<{ isOpen: boolean }>) {
	const panelRef = useDropdownViewportFit(isOpen);
	return <div ref={panelRef} data-testid="panel" />;
}

function mockPanelRect(left: number, width: number) {
	vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
		left,
		right: left + width,
		width,
	} as DOMRect);
}

function renderPanel(isOpen = true): HTMLElement {
	const { getByTestId } = render(<Harness isOpen={isOpen} />);
	return getByTestId('panel');
}

describe('useDropdownViewportFit', () => {
	beforeEach(() => {
		vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(
			VIEWPORT_WIDTH
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	test('should leave no inline style when the panel fits', () => {
		mockPanelRect(100, 300);

		expect(renderPanel()).not.toHaveAttribute('style');
	});

	test('should move the panel left when it overflows the right edge', () => {
		mockPanelRect(800, 384);

		expect(renderPanel().style.left).toBe('-192px');
	});

	test('should cap the width and stop at the left gutter when wider than the viewport', () => {
		mockPanelRect(400, 1100);
		const panel = renderPanel();

		expect(panel.style.maxWidth).toBe('984px');
		expect(panel.style.minWidth).toBe('984px');
		expect(panel.style.left).toBe('-392px');
	});

	test('should not touch the panel while closed', () => {
		mockPanelRect(800, 384);

		expect(renderPanel(false)).not.toHaveAttribute('style');
	});

	test('should leave the panel untouched on resize when it still fits', () => {
		mockPanelRect(100, 300);
		const panel = renderPanel();

		window.dispatchEvent(new Event('resize'));

		expect(panel).not.toHaveAttribute('style');
	});

	test('should fit again when the panel is resized without a window resize', () => {
		const observers: (() => void)[] = [];
		vi.stubGlobal(
			'ResizeObserver',
			class {
				constructor(callback: () => void) {
					observers.push(callback);
				}
				observe() {}
				disconnect() {}
			}
		);
		mockPanelRect(100, 300);
		const panel = renderPanel();
		mockPanelRect(800, 384);

		observers[0]();

		expect(panel.style.left).toBe('-192px');
	});

	test('should not accumulate the offset across resizes', () => {
		mockPanelRect(800, 384);
		const panel = renderPanel();

		window.dispatchEvent(new Event('resize'));

		expect(panel.style.left).toBe('-192px');
	});
});
