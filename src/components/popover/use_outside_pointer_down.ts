import { useEffect, type RefObject } from 'react';

import { useStableCallback } from '#components/shared/use_stable_callback';

/**
 * Calls `onOutsidePointerDown` when a pointer goes down outside every element
 * in `insideRefs`, while `isActive`. Listens in the capture phase so a
 * `stopPropagation` elsewhere on the page can't hide the event.
 */
export function useOutsidePointerDown(
	isActive: boolean,
	insideRefs: readonly RefObject<HTMLElement | null>[],
	onOutsidePointerDown: () => void
): void {
	const handleOutsidePointerDown = useStableCallback(onOutsidePointerDown);

	useEffect(() => {
		if (!isActive) return;
		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			const isInside = insideRefs.some((ref) => ref.current?.contains(target));
			if (!isInside) handleOutsidePointerDown();
		};
		document.addEventListener('pointerdown', handlePointerDown, true);
		return () =>
			document.removeEventListener('pointerdown', handlePointerDown, true);
	}, [isActive, insideRefs, handleOutsidePointerDown]);
}
