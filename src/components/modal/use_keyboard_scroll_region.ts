import { type RefCallback, useEffect, useState } from 'react';

import { KEYBOARD_SCROLL_REGION_ATTRIBUTE } from '#components/modal/keyboard_scroll_region_attribute';
import { ACTIVE_ITEM_FOCUS_OUTLINE } from '#components/shared/focus_styles';
import { getTabbableElements } from '#components/shared/tabbable';

type KeyboardScrollRegionOptions = {
	/** Names the scroll region; wins over `label`. */
	labelledBy?: string;
	label?: string;
};

type KeyboardScrollRegionProps = {
	tabIndex?: 0;
	role?: 'region';
	'aria-labelledby'?: string;
	'aria-label'?: string;
	[KEYBOARD_SCROLL_REGION_ATTRIBUTE]?: true;
};

type KeyboardScrollRegion = {
	ref: RefCallback<HTMLElement>;
	scrollableProps: KeyboardScrollRegionProps;
	focusClassName: string | undefined;
};

const NOT_SCROLLABLE_PROPS: KeyboardScrollRegionProps = {};

function isScrollableWithoutTabbable(element: HTMLElement): boolean {
	return (
		element.scrollHeight > element.clientHeight &&
		getTabbableElements(element).length === 0
	);
}

const TABBABILITY_ATTRIBUTES = [
	'disabled',
	'tabindex',
	'hidden',
	'inert',
	'href',
	'contenteditable',
];

function observeSizes(
	resizeObserver: ResizeObserver,
	container: HTMLElement
): void {
	resizeObserver.disconnect();
	resizeObserver.observe(container);
	for (const child of container.children) resizeObserver.observe(child);
}

function observeContainer(
	container: HTMLElement,
	evaluate: () => void
): () => void {
	const resizeObserver =
		typeof ResizeObserver === 'undefined'
			? undefined
			: new ResizeObserver(evaluate);
	const handleMutation = () => {
		evaluate();
		if (resizeObserver) observeSizes(resizeObserver, container);
	};
	const mutationObserver = new MutationObserver(handleMutation);
	mutationObserver.observe(container, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: TABBABILITY_ATTRIBUTES,
	});
	if (resizeObserver) observeSizes(resizeObserver, container);

	return () => {
		mutationObserver.disconnect();
		resizeObserver?.disconnect();
	};
}

/**
 * Internal core shared by Modal, Drawer and the public `useKeyboardScrollable`.
 * Observes the element given to the returned `ref`, so a container mounted
 * after the first render is picked up.
 */
export function useKeyboardScrollRegion({
	labelledBy,
	label,
}: Readonly<KeyboardScrollRegionOptions>): KeyboardScrollRegion {
	const [container, setContainer] = useState<HTMLElement | null>(null);
	const [scrollableContainer, setScrollableContainer] =
		useState<HTMLElement | null>(null);

	useEffect(() => {
		if (!container) return;
		const evaluate = () =>
			setScrollableContainer(
				isScrollableWithoutTabbable(container) ? container : null
			);
		evaluate();
		return observeContainer(container, evaluate);
	}, [container]);

	const isKeyboardScrollable =
		container !== null && scrollableContainer === container;

	if (!isKeyboardScrollable || !(labelledBy || label)) {
		return {
			ref: setContainer,
			scrollableProps: NOT_SCROLLABLE_PROPS,
			focusClassName: undefined,
		};
	}

	return {
		ref: setContainer,
		scrollableProps: {
			tabIndex: 0,
			role: 'region',
			[KEYBOARD_SCROLL_REGION_ATTRIBUTE]: true,
			'aria-labelledby': labelledBy,
			'aria-label': labelledBy ? undefined : label,
		},
		focusClassName: ACTIVE_ITEM_FOCUS_OUTLINE,
	};
}
