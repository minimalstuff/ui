import type { KeyboardEvent } from 'react';

import type { TabItem } from '#components/tabs/tabs';
import type { TabsOrientation } from '#components/tabs/tabs_styles';

type TargetPositionResolver = (
	currentPosition: number,
	enabledCount: number
) => number;

const SHARED_TARGET_POSITION_BY_KEY: Record<string, TargetPositionResolver> = {
	Home: () => 0,
	End: (_currentPosition, enabledCount) => enabledCount - 1,
};

const moveToNext: TargetPositionResolver = (currentPosition, enabledCount) =>
	(currentPosition + 1) % enabledCount;

const moveToPrevious: TargetPositionResolver = (
	currentPosition,
	enabledCount
) => (currentPosition - 1 + enabledCount) % enabledCount;

const TARGET_POSITION_BY_KEY: Record<
	TabsOrientation,
	Record<string, TargetPositionResolver>
> = {
	horizontal: {
		...SHARED_TARGET_POSITION_BY_KEY,
		ArrowRight: moveToNext,
		ArrowLeft: moveToPrevious,
	},
	vertical: {
		...SHARED_TARGET_POSITION_BY_KEY,
		ArrowDown: moveToNext,
		ArrowUp: moveToPrevious,
	},
};

function getEnabledIndexes(items: readonly TabItem[]): number[] {
	return items.flatMap((item, index) => (item.disabled ? [] : [index]));
}

/**
 * Resolves the roving tab stop: `activeIndex` itself when that tab is
 * enabled, otherwise the first enabled tab. Returns `-1` when no tab is
 * enabled, so the tablist has no tab stop at all.
 */
export function getTabStopIndex(
	items: readonly TabItem[],
	activeIndex: number
): number {
	const activeItem = items[activeIndex];
	if (activeItem && !activeItem.disabled) return activeIndex;

	return getEnabledIndexes(items)[0] ?? -1;
}

type UseTabsKeyboardNavigationParams = {
	items: readonly TabItem[];
	activeIndex: number;
	orientation: TabsOrientation;
	onNavigate: (targetIndex: number) => void;
};

/**
 * Roving-tabindex keyboard navigation for a tablist: ArrowRight/ArrowLeft
 * (horizontal) or ArrowDown/ArrowUp (vertical) wrap around the enabled tabs
 * and the keys of the other axis are ignored, Home/End jump to the first/last enabled tab,
 * and disabled tabs are skipped entirely.
 */
export function useTabsKeyboardNavigation(
	params: Readonly<UseTabsKeyboardNavigationParams>
): (event: KeyboardEvent<HTMLButtonElement>) => void {
	const { items, activeIndex, orientation, onNavigate } = params;

	return (event: KeyboardEvent<HTMLButtonElement>) => {
		const getTargetPosition = TARGET_POSITION_BY_KEY[orientation][event.key];
		if (!getTargetPosition) return;

		const enabledIndexes = getEnabledIndexes(items);
		if (enabledIndexes.length === 0) return;

		event.preventDefault();
		const currentPosition = enabledIndexes.indexOf(activeIndex);
		const targetPosition = getTargetPosition(
			currentPosition,
			enabledIndexes.length
		);
		onNavigate(enabledIndexes[targetPosition]);
	};
}
