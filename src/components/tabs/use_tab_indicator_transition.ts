import { type RefObject, useLayoutEffect, useRef } from 'react';

import type { TabsOrientation } from '#components/tabs/tabs_styles';

const TAB_INDICATOR_TRANSITION_DURATION_MS = 200;
const TAB_INDICATOR_TRANSITION_EASING = 'ease-out';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type UseTabIndicatorTransitionParams = {
	activeIndex: number;
	indicatorRef: RefObject<HTMLSpanElement | null>;
	isAnimated: boolean;
	orientation: TabsOrientation;
};

function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	if (typeof window.matchMedia !== 'function') return false;

	return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getIndicatorKeyframes(
	orientation: TabsOrientation,
	previousRect: DOMRect,
	nextRect: DOMRect
): Keyframe[] {
	if (orientation === 'vertical') {
		return [
			{
				transform: `translateY(${previousRect.top - nextRect.top}px)`,
				height: `${previousRect.height}px`,
			},
			{ transform: 'none', height: `${nextRect.height}px` },
		];
	}

	return [
		{
			transform: `translateX(${previousRect.left - nextRect.left}px)`,
			width: `${previousRect.width}px`,
		},
		{ transform: 'none', width: `${nextRect.width}px` },
	];
}

function animateIndicatorMove(
	indicator: HTMLSpanElement,
	orientation: TabsOrientation,
	previousRect: DOMRect,
	nextRect: DOMRect
): void {
	indicator.animate(
		getIndicatorKeyframes(orientation, previousRect, nextRect),
		{
			duration: TAB_INDICATOR_TRANSITION_DURATION_MS,
			easing: TAB_INDICATOR_TRANSITION_EASING,
		}
	);
}

function shouldAnimate(
	previousRect: DOMRect | null,
	isAnimated: boolean,
	canAnimate: boolean
): previousRect is DOMRect {
	if (!previousRect) return false;
	if (!isAnimated) return false;
	if (!canAnimate) return false;

	return !prefersReducedMotion();
}

export function useTabIndicatorTransition(
	params: Readonly<UseTabIndicatorTransitionParams>
): void {
	const { activeIndex, indicatorRef, isAnimated, orientation } = params;
	const previousRect = useRef<DOMRect | null>(null);

	useLayoutEffect(() => {
		const indicator = indicatorRef.current;
		if (!indicator) {
			previousRect.current = null;
			return;
		}

		const nextRect = indicator.getBoundingClientRect();
		const canAnimate = typeof indicator.animate === 'function';

		if (shouldAnimate(previousRect.current, isAnimated, canAnimate)) {
			animateIndicatorMove(
				indicator,
				orientation,
				previousRect.current,
				nextRect
			);
		}

		previousRect.current = nextRect;
	}, [activeIndex, indicatorRef, isAnimated, orientation]);
}
