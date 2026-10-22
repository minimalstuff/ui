import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { useBodyScrollLock } from './body_scroll_lock';

const SCROLLBAR_WIDTH = 15;
const VIEWPORT_WIDTH = 1024;

function mockViewportWidth(widthWhenLocked: number, widthWhenUnlocked: number) {
	Object.defineProperty(document.documentElement, 'clientWidth', {
		configurable: true,
		get: () =>
			document.body.style.overflow === 'hidden'
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
		document.body.removeAttribute('style');
	});

	test('should pad the body by the scrollbar width while locked and restore it on unlock', () => {
		const { unmount } = renderHook(() => useBodyScrollLock());

		expect(document.body.style.overflow).toBe('hidden');
		expect(document.body.style.paddingRight).toBe(`${SCROLLBAR_WIDTH}px`);

		unmount();

		expect(document.body.style.overflow).toBe('');
		expect(document.body.style.paddingRight).toBe('');
	});

	test('should add the scrollbar width on top of the existing body padding and restore it on unlock', () => {
		document.body.style.paddingRight = '8px';
		const { unmount } = renderHook(() => useBodyScrollLock());

		expect(document.body.style.paddingRight).toBe(`${8 + SCROLLBAR_WIDTH}px`);

		unmount();

		expect(document.body.style.paddingRight).toBe('8px');
	});

	test('should not pad the body when locking does not widen the viewport', () => {
		mockViewportWidth(VIEWPORT_WIDTH, VIEWPORT_WIDTH);
		document.body.style.paddingRight = '8px';

		renderHook(() => useBodyScrollLock());

		expect(document.body.style.overflow).toBe('hidden');
		expect(document.body.style.paddingRight).toBe('8px');
	});

	test('should apply the padding once and release it only after the last nested lock', () => {
		const first = renderHook(() => useBodyScrollLock());
		const second = renderHook(() => useBodyScrollLock());

		expect(document.body.style.paddingRight).toBe(`${SCROLLBAR_WIDTH}px`);

		second.unmount();

		expect(document.body.style.overflow).toBe('hidden');
		expect(document.body.style.paddingRight).toBe(`${SCROLLBAR_WIDTH}px`);

		first.unmount();

		expect(document.body.style.overflow).toBe('');
		expect(document.body.style.paddingRight).toBe('');
	});
});
