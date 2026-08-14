import { describe, expect, test, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

import { useEnterOnPositioned, useOverlayState } from './use_overlay_state';

describe('useOverlayState', () => {
	test('starts unmounted and hidden', () => {
		const { result } = renderHook(() => useOverlayState());
		expect(result.current.isMounted).toBe(false);
		expect(result.current.isVisible).toBe(false);
	});

	test('open(true) mounts and shows immediately when already positioned', () => {
		const { result } = renderHook(() => useOverlayState());

		act(() => {
			result.current.open(true);
		});

		expect(result.current.isMounted).toBe(true);
		expect(result.current.isVisible).toBe(true);
	});

	test('open(false) mounts but stays hidden until positioned', () => {
		const { result } = renderHook(() => useOverlayState());

		act(() => {
			result.current.open(false);
		});

		expect(result.current.isMounted).toBe(true);
		expect(result.current.isVisible).toBe(false);
	});

	test('close hides immediately but keeps mounted during the exit fade', () => {
		vi.useFakeTimers();
		const { result } = renderHook(() => useOverlayState());

		act(() => {
			result.current.open(true);
		});
		act(() => {
			result.current.close();
		});

		expect(result.current.isVisible).toBe(false);
		expect(result.current.isMounted).toBe(true);

		vi.useRealTimers();
	});

	test('unmounts after the exit fade completes', () => {
		vi.useFakeTimers();
		const { result } = renderHook(() => useOverlayState());

		act(() => {
			result.current.open(true);
		});
		act(() => {
			result.current.close();
		});
		act(() => {
			vi.advanceTimersByTime(150);
		});

		expect(result.current.isMounted).toBe(false);

		vi.useRealTimers();
	});

	test('reopening during the exit fade cancels the pending unmount', () => {
		vi.useFakeTimers();
		const { result } = renderHook(() => useOverlayState());

		act(() => {
			result.current.open(true);
		});
		act(() => {
			result.current.close();
		});
		act(() => {
			result.current.open(true);
		});
		act(() => {
			vi.advanceTimersByTime(150);
		});

		expect(result.current.isMounted).toBe(true);
		expect(result.current.isVisible).toBe(true);

		vi.useRealTimers();
	});
});

describe('useEnterOnPositioned', () => {
	test('does nothing when not mounted', async () => {
		const setIsVisible = vi.fn();
		renderHook(() => useEnterOnPositioned(false, true, setIsVisible));

		await new Promise((resolve) => requestAnimationFrame(resolve));
		expect(setIsVisible).not.toHaveBeenCalled();
	});

	test('does nothing when mounted but not yet positioned', async () => {
		const setIsVisible = vi.fn();
		renderHook(() => useEnterOnPositioned(true, false, setIsVisible));

		await new Promise((resolve) => requestAnimationFrame(resolve));
		expect(setIsVisible).not.toHaveBeenCalled();
	});

	test('shows once mounted and positioned', async () => {
		const setIsVisible = vi.fn();
		renderHook(() => useEnterOnPositioned(true, true, setIsVisible));

		await waitFor(() => expect(setIsVisible).toHaveBeenCalledWith(true));
	});
});
