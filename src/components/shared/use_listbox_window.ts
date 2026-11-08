import { type RefObject, useCallback, useLayoutEffect, useState } from 'react';

import {
	computeListboxWindow,
	type ListboxWindow,
	WINDOW_OVERSCAN,
} from '#components/shared/listbox_window';
import {
	type ListboxMetrics,
	useListboxMetrics,
} from '#components/shared/use_listbox_metrics';

type UseListboxWindowParams = {
	listboxRef: RefObject<HTMLElement | null>;
	optionCount: number;
	activeIndex: number;
	isWindowed: boolean;
};

export type UseListboxWindowResult = ListboxWindow & {
	metrics: ListboxMetrics;
	refreshWindow: () => void;
};

function areWindowsEqual(first: ListboxWindow, second: ListboxWindow) {
	return (
		first.startIndex === second.startIndex && first.endIndex === second.endIndex
	);
}

/**
 * The slice of options to mount for a scrollable listbox. The window is
 * recomputed on scroll, and when the option count or the measured sizes
 * change (filtering shrinks the content and the browser clamps the scroll
 * position without a reliable scroll event). State only changes when the
 * window does, so scrolling inside the same window does not re-render.
 */
export function useListboxWindow({
	listboxRef,
	optionCount,
	activeIndex,
	isWindowed,
}: Readonly<UseListboxWindowParams>): UseListboxWindowResult {
	const metrics = useListboxMetrics({
		listboxRef,
		optionCount,
		activeIndex,
		isEnabled: isWindowed,
	});
	const [mountedWindow, setMountedWindow] = useState(() =>
		computeListboxWindow({
			scrollTop: 0,
			viewportHeight: 0,
			rowHeight: 0,
			optionCount,
			overscan: WINDOW_OVERSCAN,
		})
	);

	const refreshWindow = useCallback(() => {
		const listbox = listboxRef.current;
		if (!isWindowed || !listbox) return;
		const nextWindow = computeListboxWindow({
			scrollTop: listbox.scrollTop,
			viewportHeight: metrics.viewportHeight,
			rowHeight: metrics.rowHeight,
			optionCount,
			overscan: WINDOW_OVERSCAN,
		});
		setMountedWindow((current) =>
			areWindowsEqual(current, nextWindow) ? current : nextWindow
		);
	}, [listboxRef, isWindowed, metrics, optionCount]);

	useLayoutEffect(refreshWindow, [refreshWindow]);

	const endIndex = Math.min(mountedWindow.endIndex, optionCount);
	const startIndex = Math.min(mountedWindow.startIndex, endIndex);
	return { startIndex, endIndex, metrics, refreshWindow };
}
