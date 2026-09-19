import { useCallback, useEffect, useState } from 'react';

const NO_ACTIVE_OPTION = -1;

export type UseActiveOptionResult = {
	activeIndex: number;
	activeOptionId: string | undefined;
	move: (delta: number) => void;
	first: () => void;
	last: () => void;
	reset: () => void;
};

type UseActiveOptionParams = {
	optionCount: number;
	getOptionId: (index: number) => string;
	isOpen: boolean;
};

/** An index the caller stored last render is only meaningful while it still
 * points inside the current (possibly since-filtered) option list. */
function clampToOptionCount(index: number, optionCount: number): number {
	return index >= 0 && index < optionCount ? index : NO_ACTIVE_OPTION;
}

/**
 * Tracks which option in an open listbox is "active" (highlighted and wired
 * to `aria-activedescendant`), shared by `Combobox` and `MultiCombobox`.
 * `move` wraps around both ends of the list and no-ops on an empty list;
 * `first`/`last` jump straight to an edge (used when opening the list via
 * ArrowDown/ArrowUp); `reset` clears back to "none" (-1). Whenever the active
 * option changes while the list is open, it is scrolled into view.
 *
 * The index a caller last stored (e.g. via `first()`) can outlive the render
 * it was set on: typing a character re-filters the option list in the same
 * render pass that applies the stored index, so a previously valid index can
 * suddenly point past the end of a shorter list, or an index of 0 can be
 * stored right as the list empties out. `activeIndex` and `activeOptionId`
 * are therefore clamped against the *current* `optionCount` on every read,
 * rather than trusting the stored value verbatim.
 */
export function useActiveOption({
	optionCount,
	getOptionId,
	isOpen,
}: UseActiveOptionParams): UseActiveOptionResult {
	const [storedIndex, setStoredIndex] = useState(NO_ACTIVE_OPTION);
	const activeIndex = clampToOptionCount(storedIndex, optionCount);

	const move = useCallback(
		(delta: number) => {
			if (optionCount === 0) return;
			setStoredIndex((current) => {
				const clampedCurrent = clampToOptionCount(current, optionCount);
				const next = clampedCurrent + delta;
				if (next < 0) return optionCount - 1;
				if (next >= optionCount) return 0;
				return next;
			});
		},
		[optionCount]
	);

	const first = useCallback(() => {
		setStoredIndex(0);
	}, []);

	const last = useCallback(() => {
		setStoredIndex(optionCount - 1);
	}, [optionCount]);

	const reset = useCallback(() => {
		setStoredIndex(NO_ACTIVE_OPTION);
	}, []);

	const activeOptionId =
		isOpen && activeIndex >= 0 ? getOptionId(activeIndex) : undefined;

	useEffect(() => {
		if (activeOptionId === undefined) return;
		document
			.getElementById(activeOptionId)
			?.scrollIntoView?.({ block: 'nearest' });
	}, [activeOptionId]);

	return { activeIndex, activeOptionId, move, first, last, reset };
}
