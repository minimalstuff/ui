/** Windowing starts above this many options, counted on the unfiltered list so the mode never flips while typing. */
export const VIRTUALIZATION_THRESHOLD = 100;

/** Rows mounted before the row height is known. */
export const INITIAL_WINDOW_SIZE = 20;

/** Rows mounted beyond each edge of the viewport. */
export const WINDOW_OVERSCAN = 10;

export type ListboxWindow = {
	startIndex: number;
	endIndex: number;
};

type ComputeListboxWindowParams = {
	scrollTop: number;
	viewportHeight: number;
	rowHeight: number;
	optionCount: number;
	overscan: number;
};

type ComputeNearestScrollTopParams = {
	scrollTop: number;
	viewportHeight: number;
	rowHeight: number;
	index: number;
	edgePadding: number;
	targetRowHeight: number;
};

type GetMountedIndicesParams = ListboxWindow & {
	activeIndex: number;
};

export function isWindowedListbox(optionCount: number): boolean {
	return optionCount > VIRTUALIZATION_THRESHOLD;
}

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.min(Math.max(value, minimum), maximum);
}

/**
 * The rows to mount for the current scroll position: the visible ones plus
 * `overscan` on each side. `endIndex` is exclusive. Without a known layout
 * (row or viewport height of zero) it falls back to the first
 * `INITIAL_WINDOW_SIZE` rows.
 */
export function computeListboxWindow({
	scrollTop,
	viewportHeight,
	rowHeight,
	optionCount,
	overscan,
}: Readonly<ComputeListboxWindowParams>): ListboxWindow {
	if (optionCount <= 0) return { startIndex: 0, endIndex: 0 };
	if (rowHeight <= 0 || viewportHeight <= 0) {
		return {
			startIndex: 0,
			endIndex: Math.min(optionCount, INITIAL_WINDOW_SIZE),
		};
	}
	const firstVisibleIndex = Math.floor(scrollTop / rowHeight);
	const lastVisibleIndex = Math.ceil((scrollTop + viewportHeight) / rowHeight);
	const startIndex = clamp(firstVisibleIndex - overscan, 0, optionCount - 1);
	const endIndex = clamp(
		lastVisibleIndex + overscan,
		startIndex + 1,
		optionCount
	);
	return { startIndex, endIndex };
}

/**
 * The scroll offset that brings the row at `index` into view with the least
 * movement: unchanged when it is already fully visible, aligned to the top
 * edge when it is above, to the bottom edge when it is below. `rowHeight` is
 * the uniform row height placing the row, `targetRowHeight` the real height
 * of the target row, which can be taller (an active row that wraps).
 */
export function computeNearestScrollTop({
	scrollTop,
	viewportHeight,
	rowHeight,
	index,
	edgePadding,
	targetRowHeight,
}: Readonly<ComputeNearestScrollTopParams>): number {
	const rowTop = edgePadding + index * rowHeight;
	const rowBottom = rowTop + targetRowHeight;
	if (rowTop < scrollTop) return Math.max(0, rowTop - edgePadding);
	if (rowBottom > scrollTop + viewportHeight) return rowBottom - viewportHeight;
	return scrollTop;
}

/** The indices to mount, in DOM order: the window, plus the active index when it lies outside of it. */
export function getMountedIndices({
	startIndex,
	endIndex,
	activeIndex,
}: Readonly<GetMountedIndicesParams>): number[] {
	const windowIndices = Array.from(
		{ length: Math.max(0, endIndex - startIndex) },
		(_, offset) => startIndex + offset
	);
	if (activeIndex < 0) return windowIndices;
	if (activeIndex < startIndex) return [activeIndex, ...windowIndices];
	if (activeIndex >= endIndex) return [...windowIndices, activeIndex];
	return windowIndices;
}
