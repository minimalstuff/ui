import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { isPersistentDuration } from '#components/toast/toast_styles';

interface UseToastTimerOptions {
	duration: number;
	isPaused: boolean;
	onElapsed: () => void;
	/** When it changes, the remaining time resets to the full duration. */
	revision?: number;
}

interface UseToastTimerReturn {
	/** Whether the countdown is currently advancing. */
	isRunning: boolean;
}

function isDocumentHidden(): boolean {
	return document.visibilityState === 'hidden';
}

/**
 * Calls `onElapsed` once `duration` ms have run while not paused. A pause
 * (or a hidden document) keeps the time already spent, so resuming continues
 * rather than restarts. A new `revision` restarts the full duration.
 */
export function useToastTimer({
	duration,
	isPaused,
	onElapsed,
	revision = 0,
}: Readonly<UseToastTimerOptions>): UseToastTimerReturn {
	const remainingRef = useRef(duration);
	const revisionRef = useRef(revision);
	const [elapsedRevision, setElapsedRevision] = useState<number | null>(null);
	const [isHidden, setIsHidden] = useState(isDocumentHidden);
	const hasElapsed = elapsedRevision === revision;
	const handleElapsed = useEffectEvent(onElapsed);

	useEffect(() => {
		const handleVisibilityChange = () => setIsHidden(isDocumentHidden());
		handleVisibilityChange();
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () =>
			document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, []);

	useEffect(() => {
		if (revisionRef.current !== revision) {
			revisionRef.current = revision;
			remainingRef.current = duration;
		}
		if (hasElapsed || isPaused || isHidden || isPersistentDuration(duration))
			return;
		const startedAt = Date.now();
		const timeoutId = setTimeout(() => {
			setElapsedRevision(revision);
			handleElapsed();
		}, remainingRef.current);
		return () => {
			clearTimeout(timeoutId);
			remainingRef.current -= Date.now() - startedAt;
		};
	}, [duration, isPaused, isHidden, revision, hasElapsed]);

	const isRunning =
		!hasElapsed && !isPaused && !isHidden && !isPersistentDuration(duration);
	return { isRunning };
}
