import { type RefObject, useEffect, useState } from 'react';

import { KEYBOARD_SCROLL_REGION_ATTRIBUTE } from '#components/modal/keyboard_scroll_region_attribute';
import { ACTIVE_ITEM_FOCUS_OUTLINE } from '#components/shared/focus_styles';
import { getTabbableElements } from '#components/shared/tabbable';

interface KeyboardScrollableOptions {
	/** Names the scroll region; wins over `label`. */
	labelledBy?: string;
	label?: string;
}

export interface KeyboardScrollableProps {
	tabIndex?: 0;
	role?: 'region';
	'aria-labelledby'?: string;
	'aria-label'?: string;
	[KEYBOARD_SCROLL_REGION_ATTRIBUTE]?: true;
	focusClassName?: string;
}

const NOT_SCROLLABLE_PROPS: KeyboardScrollableProps = {};

function isScrollableWithoutTabbable(element: HTMLElement): boolean {
	return (
		element.scrollHeight > element.clientHeight &&
		getTabbableElements(element).length === 0
	);
}

/**
 * Makes a scroll container reachable by keyboard when it overflows and holds
 * nothing tabbable: returns the props that give it a tab stop, a region role,
 * a name and a visible focus outline. Re-evaluated on resize and on content
 * changes.
 */
export function useKeyboardScrollable(
	containerRef: RefObject<HTMLElement | null>,
	{ labelledBy, label }: Readonly<KeyboardScrollableOptions>
): KeyboardScrollableProps {
	const [isKeyboardScrollable, setIsKeyboardScrollable] = useState(false);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const evaluate = () =>
			setIsKeyboardScrollable(isScrollableWithoutTabbable(container));
		evaluate();

		const mutationObserver = new MutationObserver(evaluate);
		mutationObserver.observe(container, { childList: true, subtree: true });

		const resizeObserver =
			typeof ResizeObserver === 'undefined'
				? undefined
				: new ResizeObserver(evaluate);
		resizeObserver?.observe(container);

		return () => {
			mutationObserver.disconnect();
			resizeObserver?.disconnect();
		};
	}, [containerRef]);

	if (!isKeyboardScrollable || !(labelledBy || label)) {
		return NOT_SCROLLABLE_PROPS;
	}

	return {
		tabIndex: 0,
		role: 'region',
		[KEYBOARD_SCROLL_REGION_ATTRIBUTE]: true,
		'aria-labelledby': labelledBy,
		'aria-label': labelledBy ? undefined : label,
		focusClassName: ACTIVE_ITEM_FOCUS_OUTLINE,
	};
}
