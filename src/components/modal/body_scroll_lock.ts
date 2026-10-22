import { useEffect } from 'react';

const SCROLLBAR_COMPENSATION_PROPERTY = '--scrollbar-compensation';

interface RootStyleBeforeLock {
	overflow: string;
	overflowX: string;
	overflowY: string;
	paddingRight: string;
	scrollbarCompensation: string;
}

let scrollLockCount = 0;
let rootStyleBeforeLock: RootStyleBeforeLock | undefined;

function readRootStyle(): RootStyleBeforeLock {
	const { style } = document.documentElement;
	return {
		overflow: style.overflow,
		overflowX: style.overflowX,
		overflowY: style.overflowY,
		paddingRight: style.paddingRight,
		scrollbarCompensation: style.getPropertyValue(
			SCROLLBAR_COMPENSATION_PROPERTY
		),
	};
}

function restoreRootStyle(saved: Readonly<RootStyleBeforeLock>): void {
	const { style } = document.documentElement;
	style.overflow = saved.overflow;
	style.overflowX = saved.overflowX;
	style.overflowY = saved.overflowY;
	style.paddingRight = saved.paddingRight;
	if (saved.scrollbarCompensation === '') {
		style.removeProperty(SCROLLBAR_COMPENSATION_PROPERTY);
		return;
	}
	style.setProperty(
		SCROLLBAR_COMPENSATION_PROPERTY,
		saved.scrollbarCompensation
	);
}

function compensateScrollbarGap(
	scrollbarGap: number,
	computedPaddingRight: number
): void {
	const { style } = document.documentElement;
	style.paddingRight = `${computedPaddingRight + scrollbarGap}px`;
	style.setProperty(SCROLLBAR_COMPENSATION_PROPERTY, `${scrollbarGap}px`);
}

function lockPageScroll(): void {
	if (scrollLockCount === 0) {
		const root = document.documentElement;
		rootStyleBeforeLock = readRootStyle();
		const computedPaddingRight =
			Number.parseFloat(getComputedStyle(root).paddingRight) || 0;
		const widthBeforeLock = root.clientWidth;
		root.style.overflow = 'hidden';
		const scrollbarGap = root.clientWidth - widthBeforeLock;
		if (scrollbarGap > 0) {
			compensateScrollbarGap(scrollbarGap, computedPaddingRight);
		}
	}
	scrollLockCount += 1;
}

function unlockPageScroll(): void {
	scrollLockCount -= 1;
	if (scrollLockCount === 0 && rootStyleBeforeLock) {
		restoreRootStyle(rootStyleBeforeLock);
		rootStyleBeforeLock = undefined;
	}
}

/**
 * Locks the page scroll while the calling component is mounted. Locks are
 * ref-counted, so stacked dialogs share one lock that is released only when
 * the last one unmounts.
 *
 * The lock sits on `<html>`: an `overflow` set on `<body>` only reaches the
 * viewport while `<html>` is `overflow: visible`.
 *
 * Hiding the page scrollbar widens the viewport and would shift the layout,
 * so `<html>` is padded by the width the lock actually freed. That width is
 * measured (`clientWidth` before and after) rather than derived from
 * `innerWidth - clientWidth`, which stays correct when the page has no
 * scrollbar, uses overlay scrollbars or already reserves its gutter.
 *
 * The freed width is also exposed as `--scrollbar-compensation` on `<html>`.
 * Root padding does not move `position: fixed` elements, so apps offset their
 * own right-anchored ones with `right: var(--scrollbar-compensation, 0px)`
 * (or padding).
 */
export function useBodyScrollLock(): void {
	useEffect(() => {
		lockPageScroll();
		return unlockPageScroll;
	}, []);
}
