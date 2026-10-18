import {
	useCallback,
	useEffect,
	useRef,
	type FocusEvent,
	type KeyboardEvent,
	type RefObject,
} from 'react';

import {
	getAllItems,
	getEnabledItems,
	isTextEntry,
} from '#components/toolbar/toolbar_items';
import {
	getTargetPosition,
	type ToolbarOrientation,
} from '#components/toolbar/toolbar_navigation';

const OBSERVED_ATTRIBUTES = ['disabled', 'aria-disabled'];

type ToolbarRovingFocus = {
	handleFocus: (event: FocusEvent<HTMLElement>) => void;
	handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

/**
 * Keeps exactly one enabled item of the toolbar in the tab order and moves
 * focus between items with the arrow keys of the given orientation, Home and
 * End. The last focused item is the tab stop; when it is removed or disabled
 * the first enabled item takes over.
 */
export function useToolbarRovingFocus(
	toolbarRef: RefObject<HTMLElement | null>,
	orientation: ToolbarOrientation
): ToolbarRovingFocus {
	const tabStopRef = useRef<HTMLElement | null>(null);

	const syncTabStop = useCallback(() => {
		const toolbar = toolbarRef.current;
		if (!toolbar) return;

		const enabledItems = getEnabledItems(toolbar);
		const remembered = tabStopRef.current;
		const tabStop =
			remembered && enabledItems.includes(remembered)
				? remembered
				: enabledItems[0];

		for (const item of getAllItems(toolbar)) {
			item.tabIndex = item === tabStop ? 0 : -1;
		}
	}, [toolbarRef]);

	useEffect(() => {
		const toolbar = toolbarRef.current;
		if (!toolbar) return;

		syncTabStop();
		const observer = new MutationObserver(syncTabStop);
		observer.observe(toolbar, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: OBSERVED_ATTRIBUTES,
		});
		return () => observer.disconnect();
	}, [toolbarRef, syncTabStop]);

	const handleFocus = (event: FocusEvent<HTMLElement>) => {
		const toolbar = toolbarRef.current;
		if (!toolbar) return;

		const focusedItem = getEnabledItems(toolbar).find(
			(item) => item === event.target
		);
		if (!focusedItem) return;

		tabStopRef.current = focusedItem;
		syncTabStop();
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		const toolbar = toolbarRef.current;
		if (!toolbar || isTextEntry(event.target)) return;

		const items = getEnabledItems(toolbar);
		const targetPosition = getTargetPosition({
			key: event.key,
			orientation,
			currentPosition: items.findIndex((item) => item === event.target),
			itemCount: items.length,
		});
		if (targetPosition === undefined) return;

		event.preventDefault();
		items[targetPosition].focus();
	};

	return { handleFocus, handleKeyDown };
}
