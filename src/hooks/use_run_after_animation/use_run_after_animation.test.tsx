import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useRunAfterAnimation } from './use_run_after_animation';

describe('useRunAfterAnimation', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test('calls callback after duration', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useRunAfterAnimation(100));
		result.current(callback);
		expect(callback).not.toHaveBeenCalled();
		vi.advanceTimersByTime(99);
		expect(callback).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	test('cleanup cancels the timeout', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useRunAfterAnimation(100));
		const cleanup = result.current(callback);
		cleanup();
		vi.advanceTimersByTime(100);
		expect(callback).not.toHaveBeenCalled();
	});
});
