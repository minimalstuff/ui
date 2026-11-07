import { useEffect, useEffectEvent, useRef } from 'react';

import { isPersistentDuration } from '#components/toast/toast_styles';

interface UseToastTimerOptions {
	duration: number;
	isPaused: boolean;
	onElapsed: () => void;
}

/**
 * Calls `onElapsed` once `duration` ms have run while not paused. A pause
 * keeps the time already spent, so resuming continues rather than restarts.
 */
export function useToastTimer({
	duration,
	isPaused,
	onElapsed,
}: Readonly<UseToastTimerOptions>): void {
	const remainingRef = useRef(duration);
	const handleElapsed = useEffectEvent(onElapsed);

	useEffect(() => {
		if (isPaused || isPersistentDuration(duration)) return;
		const startedAt = Date.now();
		const timeoutId = setTimeout(handleElapsed, remainingRef.current);
		return () => {
			clearTimeout(timeoutId);
			remainingRef.current -= Date.now() - startedAt;
		};
	}, [duration, isPaused]);
}
