import type { KeyboardEvent } from 'react';

import type { TabItem } from '#components/tabs/tabs';

const TARGET_POSITION_BY_KEY: Record<
	string,
	(currentPosition: number, enabledCount: number) => number
> = {
	ArrowRight: (currentPosition, enabledCount) =>
		(currentPosition + 1) % enabledCount,
	ArrowLeft: (currentPosition, enabledCount) =>
		(currentPosition - 1 + enabledCount) % enabledCount,
	Home: () => 0,
	End: (_currentPosition, enabledCount) => enabledCount - 1,
};

function getEnabledIndexes(items: readonly TabItem[]): number[] {
	return items.flatMap((item, index) => (item.disabled ? [] : [index]));
}

type UseTabsKeyboardNavigationParams = {
	items: readonly TabItem[];
	activeIndex: number;
	onNavigate: (targetIndex: number) => void;
};

/**
 * Roving-tabindex keyboard navigation for a tablist: ArrowRight/ArrowLeft
 * wrap around the enabled tabs, Home/End jump to the first/last enabled tab,
 * and disabled tabs are skipped entirely.
 */
export function useTabsKeyboardNavigation(
	params: Readonly<UseTabsKeyboardNavigationParams>
): (event: KeyboardEvent<HTMLButtonElement>) => void {
	const { items, activeIndex, onNavigate } = params;

	return (event: KeyboardEvent<HTMLButtonElement>) => {
		const getTargetPosition = TARGET_POSITION_BY_KEY[event.key];
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
