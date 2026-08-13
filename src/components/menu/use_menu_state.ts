import { useCallback, useEffect, useRef, useState } from 'react';

const EXIT_ANIMATION_DURATION_MS = 150;

/**
 * Mount/visible state machine shared by `Menu` and `ContextMenu`. `open`
 * takes floating-ui's `isPositioned` as a call-time argument rather than a
 * hook dependency, since the caller must call `useFloating({ open: isMounted })`
 * *after* this hook to get `isMounted` in the first place: threading
 * `isPositioned` back in as a constructor argument would be circular.
 *
 * Re-showing before the delayed unmount fires must re-apply `isVisible`
 * directly (via the `isPositioned` check in `open`), since `isMounted` won't
 * change value in that case and `useEnterOnPositioned` alone won't re-fire.
 */
export function useMenuState() {
	const [isMounted, setIsMounted] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => () => clearTimeout(hideTimeoutRef.current), []);

	const open = useCallback((isPositioned: boolean) => {
		clearTimeout(hideTimeoutRef.current);
		setIsMounted(true);
		if (isPositioned) setIsVisible(true);
	}, []);

	const close = useCallback(() => {
		clearTimeout(hideTimeoutRef.current);
		setIsVisible(false);
		hideTimeoutRef.current = setTimeout(
			() => setIsMounted(false),
			EXIT_ANIMATION_DURATION_MS
		);
	}, []);

	return { isMounted, isVisible, setIsVisible, open, close };
}

/**
 * Starts the enter transition only once floating-ui has computed a real
 * position: animating before that would use a stale (0, 0) position or
 * skip the transition's "closed" frame entirely (see Tooltip).
 */
export function useEnterOnPositioned(
	isMounted: boolean,
	isPositioned: boolean,
	setIsVisible: (visible: boolean) => void
) {
	useEffect(() => {
		if (!isMounted || !isPositioned) return;
		const frameId = requestAnimationFrame(() => setIsVisible(true));
		return () => cancelAnimationFrame(frameId);
	}, [isMounted, isPositioned, setIsVisible]);
}
