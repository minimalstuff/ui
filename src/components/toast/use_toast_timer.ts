import {
	useEffect,
	useEffectEvent,
	useRef,
	useState,
	useSyncExternalStore,
} from 'react';

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

const visibilitySubscribers = new Set<() => void>();

function notifyVisibilitySubscribers(): void {
	for (const subscriber of visibilitySubscribers) subscriber();
}

function subscribeToVisibility(subscriber: () => void): () => void {
	if (visibilitySubscribers.size === 0)
		document.addEventListener('visibilitychange', notifyVisibilitySubscribers);
	visibilitySubscribers.add(subscriber);
	return () => {
		visibilitySubscribers.delete(subscriber);
		if (visibilitySubscribers.size > 0) return;
		document.removeEventListener(
			'visibilitychange',
			notifyVisibilitySubscribers
		);
	};
}

function getServerHiddenSnapshot(): boolean {
	return false;
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
	const isHidden = useSyncExternalStore(
		subscribeToVisibility,
		isDocumentHidden,
		getServerHiddenSnapshot
	);
	const hasElapsed = elapsedRevision === revision;
	const handleElapsed = useEffectEvent(onElapsed);

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
