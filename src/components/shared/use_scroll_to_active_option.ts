import { type RefObject, useLayoutEffect, useRef } from 'react';

import { getListboxOptionId } from '#components/shared/listbox_option_id';
import { computeNearestScrollTop } from '#components/shared/listbox_window';
import type { ListboxMetrics } from '#components/shared/use_listbox_metrics';
import { useStableCallback } from '#components/shared/use_stable_callback';

type UseScrollToActiveOptionParams = {
	listboxRef: RefObject<HTMLElement | null>;
	listboxId: string;
	activeIndex: number;
	initialVisibleIndex: number | undefined;
	isWindowed: boolean;
	metrics: ListboxMetrics;
	refreshWindow: () => void;
};

/**
 * Keeps the active option in view. On mount, when nothing is active yet, the
 * `initialVisibleIndex` row is revealed instead. A windowed listbox computes
 * the scroll offset from the row index (the row may not be mounted, and
 * `scrollIntoView` would also scroll ancestors); a plain one scrolls the row
 * itself.
 */
export function useScrollToActiveOption({
	listboxRef,
	listboxId,
	activeIndex,
	initialVisibleIndex,
	isWindowed,
	metrics,
	refreshWindow,
}: Readonly<UseScrollToActiveOptionParams>): void {
	const pendingInitialIndexRef = useRef(initialVisibleIndex);
	const hasRowHeight = metrics.rowHeight > 0;

	const scrollToIndex = useStableCallback((index: number) => {
		if (!isWindowed) {
			document
				.getElementById(getListboxOptionId(listboxId, index))
				?.scrollIntoView?.({ block: 'nearest' });
			return;
		}
		const listbox = listboxRef.current;
		if (!listbox) return;
		const mountedHeight =
			document
				.getElementById(getListboxOptionId(listboxId, index))
				?.getBoundingClientRect().height ?? 0;
		const targetRowHeight =
			mountedHeight > 0 ? mountedHeight : metrics.rowHeight;
		listbox.scrollTop = computeNearestScrollTop({
			scrollTop: listbox.scrollTop,
			viewportHeight: listbox.clientHeight,
			rowHeight: metrics.rowHeight,
			index,
			edgePadding: metrics.edgePadding,
			targetRowHeight,
		});
		refreshWindow();
	});

	useLayoutEffect(() => {
		if (isWindowed && !hasRowHeight) return;
		if (activeIndex >= 0) {
			pendingInitialIndexRef.current = undefined;
			scrollToIndex(activeIndex);
			return;
		}
		const pendingIndex = pendingInitialIndexRef.current;
		if (pendingIndex === undefined || pendingIndex < 0) return;
		pendingInitialIndexRef.current = undefined;
		scrollToIndex(pendingIndex);
	}, [activeIndex, isWindowed, hasRowHeight, scrollToIndex]);
}
