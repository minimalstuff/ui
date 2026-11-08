import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useToastTimer } from '#components/toast/use_toast_timer';

const DURATION_MS = 1000;

interface TimerProps {
	duration: number;
	isPaused: boolean;
	revision: number;
}

function setVisibility(state: 'hidden' | 'visible') {
	vi.spyOn(document, 'visibilityState', 'get').mockReturnValue(state);
	act(() => {
		document.dispatchEvent(new Event('visibilitychange'));
	});
}

function renderTimer(onElapsed: () => void, initial: Partial<TimerProps> = {}) {
	return renderHook(
		(props: TimerProps) => useToastTimer({ ...props, onElapsed }),
		{
			initialProps: {
				duration: DURATION_MS,
				isPaused: false,
				revision: 0,
				...initial,
			},
		}
	);
}

describe('useToastTimer', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('should call onElapsed when the duration has passed', () => {
		const onElapsed = vi.fn<() => void>();
		renderTimer(onElapsed);

		vi.advanceTimersByTime(DURATION_MS - 1);
		expect(onElapsed).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(onElapsed).toHaveBeenCalledOnce();
	});

	it('should continue with the remaining time when resumed after a pause', () => {
		const onElapsed = vi.fn<() => void>();
		const { rerender } = renderTimer(onElapsed);

		vi.advanceTimersByTime(600);
		rerender({ duration: DURATION_MS, isPaused: true, revision: 0 });
		vi.advanceTimersByTime(5000);
		rerender({ duration: DURATION_MS, isPaused: false, revision: 0 });
		vi.advanceTimersByTime(399);
		expect(onElapsed).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(onElapsed).toHaveBeenCalledOnce();
	});

	it('should restart the full duration when the revision changes', () => {
		const onElapsed = vi.fn<() => void>();
		const { rerender } = renderTimer(onElapsed);

		vi.advanceTimersByTime(600);
		rerender({ duration: DURATION_MS, isPaused: false, revision: 1 });
		vi.advanceTimersByTime(DURATION_MS - 1);
		expect(onElapsed).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(onElapsed).toHaveBeenCalledOnce();
	});

	it('should pause while the document is hidden and resume with the remaining time', () => {
		const onElapsed = vi.fn<() => void>();
		renderTimer(onElapsed);

		vi.advanceTimersByTime(600);
		setVisibility('hidden');
		vi.advanceTimersByTime(5000);
		expect(onElapsed).not.toHaveBeenCalled();
		setVisibility('visible');
		vi.advanceTimersByTime(400);
		expect(onElapsed).toHaveBeenCalledOnce();
	});

	it('should not call onElapsed again when pause toggles after it elapsed', () => {
		const onElapsed = vi.fn<() => void>();
		const { rerender } = renderTimer(onElapsed);

		vi.advanceTimersByTime(DURATION_MS);
		rerender({ duration: DURATION_MS, isPaused: true, revision: 0 });
		rerender({ duration: DURATION_MS, isPaused: false, revision: 0 });
		vi.advanceTimersByTime(DURATION_MS);
		expect(onElapsed).toHaveBeenCalledOnce();
	});

	it('should arm again when the revision changes after it elapsed', () => {
		const onElapsed = vi.fn<() => void>();
		const { rerender } = renderTimer(onElapsed);

		vi.advanceTimersByTime(DURATION_MS);
		rerender({ duration: DURATION_MS, isPaused: false, revision: 1 });
		vi.advanceTimersByTime(DURATION_MS);
		expect(onElapsed).toHaveBeenCalledTimes(2);
	});

	it('should never call onElapsed when the duration exceeds the timeout limit', () => {
		const onElapsed = vi.fn<() => void>();
		renderTimer(onElapsed, { duration: 2 ** 31 });

		vi.advanceTimersByTime(100000);
		expect(onElapsed).not.toHaveBeenCalled();
	});

	it.each([0, Infinity])(
		'should never call onElapsed when the duration is %s',
		(duration) => {
			const onElapsed = vi.fn<() => void>();
			renderTimer(onElapsed, { duration });

			vi.advanceTimersByTime(100000);
			expect(onElapsed).not.toHaveBeenCalled();
		}
	);
});
