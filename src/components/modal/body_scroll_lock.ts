import { useEffect } from 'react';

interface BodyStyleBeforeLock {
	overflow: string;
	paddingRight: string;
}

let bodyScrollLockCount = 0;
let bodyStyleBeforeLock: BodyStyleBeforeLock = {
	overflow: '',
	paddingRight: '',
};

function lockBodyScroll(): void {
	if (bodyScrollLockCount === 0) {
		const { style } = document.body;
		bodyStyleBeforeLock = {
			overflow: style.overflow,
			paddingRight: style.paddingRight,
		};
		const computedPaddingRight =
			Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0;
		const widthBeforeLock = document.documentElement.clientWidth;
		style.overflow = 'hidden';
		const scrollbarGap = document.documentElement.clientWidth - widthBeforeLock;
		if (scrollbarGap > 0) {
			style.paddingRight = `${computedPaddingRight + scrollbarGap}px`;
		}
	}
	bodyScrollLockCount += 1;
}

function unlockBodyScroll(): void {
	bodyScrollLockCount -= 1;
	if (bodyScrollLockCount === 0) {
		document.body.style.overflow = bodyStyleBeforeLock.overflow;
		document.body.style.paddingRight = bodyStyleBeforeLock.paddingRight;
	}
}

/**
 * Locks the page scroll while the calling component is mounted. Locks are
 * ref-counted, so stacked dialogs share one lock that is released only when
 * the last one unmounts.
 *
 * Hiding the page scrollbar widens the viewport and would shift the layout,
 * so the body is padded by the width the lock actually freed. That width is
 * measured (`clientWidth` before and after) rather than derived from
 * `innerWidth - clientWidth`, which stays correct when the page has no
 * scrollbar, uses overlay scrollbars or already reserves its gutter.
 */
export function useBodyScrollLock(): void {
	useEffect(() => {
		lockBodyScroll();
		return unlockBodyScroll;
	}, []);
}
