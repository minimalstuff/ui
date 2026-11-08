const DEFAULT_PAGE_SIZE = 10;

/** Number of whole rows that fit in the viewport, never less than one. */
export function computePageSize(
	viewportHeight: number,
	rowHeight: number
): number {
	return Math.max(1, Math.floor(viewportHeight / rowHeight));
}

export const OPTION_SELECTOR = '[role="option"]';

/**
 * Height of the first mounted option other than the active one (which may
 * wrap taller than the rest), or 0 when there is none or no layout.
 */
export function readListboxRowHeight(
	listbox: HTMLElement,
	activeIndex = -1
): number {
	const row = listbox.querySelector(
		`${OPTION_SELECTOR}:not([aria-posinset="${activeIndex + 1}"])`
	);
	return row?.getBoundingClientRect().height ?? 0;
}

/**
 * How many options one PageUp/PageDown press moves: the rows visible in the
 * listbox, or a fixed fallback when nothing is laid out (no element, no rows,
 * or a DOM without layout).
 */
export function readListboxPageSize(
	listbox: HTMLElement | null,
	activeIndex = -1
): number {
	if (!listbox) return DEFAULT_PAGE_SIZE;
	const viewportHeight = listbox.clientHeight;
	const rowHeight = readListboxRowHeight(listbox, activeIndex);
	if (viewportHeight <= 0 || rowHeight <= 0) return DEFAULT_PAGE_SIZE;
	return computePageSize(viewportHeight, rowHeight);
}
