const DEFAULT_PAGE_SIZE = 10;

/** Number of whole rows that fit in the viewport, never less than one. */
export function computePageSize(
	viewportHeight: number,
	rowHeight: number
): number {
	return Math.max(1, Math.floor(viewportHeight / rowHeight));
}

function readViewportHeight(listbox: HTMLElement): number {
	return listbox.clientHeight;
}

function readRowHeight(listbox: HTMLElement): number {
	const row = listbox.querySelector('[role="option"]');
	return row?.getBoundingClientRect().height ?? 0;
}

/**
 * How many options one PageUp/PageDown press moves: the rows visible in the
 * listbox, or a fixed fallback when nothing is laid out (no element, no rows,
 * or a DOM without layout).
 */
export function readListboxPageSize(listbox: HTMLElement | null): number {
	if (!listbox) return DEFAULT_PAGE_SIZE;
	const viewportHeight = readViewportHeight(listbox);
	const rowHeight = readRowHeight(listbox);
	if (viewportHeight <= 0 || rowHeight <= 0) return DEFAULT_PAGE_SIZE;
	return computePageSize(viewportHeight, rowHeight);
}
