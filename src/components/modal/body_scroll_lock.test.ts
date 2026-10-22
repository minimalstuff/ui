import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { useBodyScrollLock } from './body_scroll_lock';

const SCROLLBAR_WIDTH = 15;
const VIEWPORT_WIDTH = 1024;

function mockViewportWidth(widthWhenLocked: number, widthWhenUnlocked: number) {
	Object.defineProperty(document.documentElement, 'clientWidth', {
		configurable: true,
		get: () =>
			document.documentElement.style.overflow === 'hidden'
				? widthWhenLocked
				: widthWhenUnlocked,
	});
}

describe('useBodyScrollLock', () => {
	beforeEach(() => {
		mockViewportWidth(VIEWPORT_WIDTH, VIEWPORT_WIDTH - SCROLLBAR_WIDTH);
	});

	afterEach(() => {
		cleanup();
		Reflect.deleteProperty(document.documentElement, 'clientWidth');
		document.documentElement.removeAttribute('style');
	});

	test('should pad the page by the scrollbar width while locked and restore it on unlock', () => {
		const { unmount } = renderHook(() => useBodyScrollLock());

		expect(document.documentElement.style.overflow).toBe('hidden');
		expect(document.documentElement.style.paddingRight).toBe(
			`${SCROLLBAR_WIDTH}px`
		);

		unmount();

		expect(document.documentElement.style.overflow).toBe('');
		expect(document.documentElement.style.paddingRight).toBe('');
	});

	test('should add the scrollbar width on top of the existing page padding and restore it on unlock', () => {
		document.documentElement.style.paddingRight = '8px';
		const { unmount } = renderHook(() => useBodyScrollLock());

		expect(document.documentElement.style.paddingRight).toBe(
			`${8 + SCROLLBAR_WIDTH}px`
		);

		unmount();

		expect(document.documentElement.style.paddingRight).toBe('8px');
	});

	test('should not pad the page when locking does not widen the viewport', () => {
		mockViewportWidth(VIEWPORT_WIDTH, VIEWPORT_WIDTH);
		document.documentElement.style.paddingRight = '8px';

		renderHook(() => useBodyScrollLock());

		expect(document.documentElement.style.overflow).toBe('hidden');
		expect(document.documentElement.style.paddingRight).toBe('8px');
	});

	test('should apply the padding once and release it only after the last nested lock', () => {
		const first = renderHook(() => useBodyScrollLock());
		const second = renderHook(() => useBodyScrollLock());

		expect(document.documentElement.style.paddingRight).toBe(
			`${SCROLLBAR_WIDTH}px`
		);

		second.unmount();

		expect(document.documentElement.style.overflow).toBe('hidden');
		expect(document.documentElement.style.paddingRight).toBe(
			`${SCROLLBAR_WIDTH}px`
		);

		first.unmount();

		expect(document.documentElement.style.overflow).toBe('');
		expect(document.documentElement.style.paddingRight).toBe('');
	});

	test('should expose the scrollbar width as a CSS variable while locked and remove it on unlock', () => {
		const { unmount } = renderHook(() => useBodyScrollLock());

		expect(
			document.documentElement.style.getPropertyValue(
				'--scrollbar-compensation'
			)
		).toBe(`${SCROLLBAR_WIDTH}px`);

		unmount();

		expect(
			document.documentElement.style.getPropertyValue(
				'--scrollbar-compensation'
			)
		).toBe('');
	});

	test('should lock the page and restore the original overflow longhands when the root already sets an inline overflow', () => {
		document.documentElement.style.overflowY = 'scroll';
		const { unmount } = renderHook(() => useBodyScrollLock());

		expect(document.documentElement.style.overflow).toBe('hidden');

		unmount();

		expect(document.documentElement.style.overflowY).toBe('scroll');
		expect(document.documentElement.style.overflowX).toBe('');
	});
});
