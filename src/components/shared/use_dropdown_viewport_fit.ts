import { type RefObject, useLayoutEffect, useRef } from 'react';

const VIEWPORT_GUTTER = 8;

type PanelFit = {
	left: string;
	maxWidth: string;
	minWidth: string;
};

type PanelGeometry = {
	left: number;
	width: number;
	offsetLeft: number;
	viewportWidth: number;
};

const NO_FIT: PanelFit = { left: '', maxWidth: '', minWidth: '' };

function isNoFit(fit: PanelFit): boolean {
	return fit.left === '' && fit.maxWidth === '' && fit.minWidth === '';
}

function writeFit(panel: HTMLElement, fit: PanelFit): void {
	panel.style.left = fit.left;
	panel.style.maxWidth = fit.maxWidth;
	panel.style.minWidth = fit.minWidth;
}

function readGeometry(panel: HTMLElement): PanelGeometry {
	const { left, width } = panel.getBoundingClientRect();
	return {
		left,
		width,
		offsetLeft: panel.offsetLeft,
		viewportWidth: document.documentElement.clientWidth,
	};
}

function computeFit(geometry: Readonly<PanelGeometry>): PanelFit {
	const availableWidth = geometry.viewportWidth - 2 * VIEWPORT_GUTTER;
	const isTooWide = geometry.width > availableWidth;
	const visibleWidth = Math.min(geometry.width, availableWidth);
	const overflow =
		geometry.left + visibleWidth - (geometry.viewportWidth - VIEWPORT_GUTTER);
	return {
		left: overflow > 0 ? `${geometry.offsetLeft - overflow}px` : '',
		maxWidth: isTooWide ? `${availableWidth}px` : '',
		minWidth: isTooWide ? `${availableWidth}px` : '',
	};
}

/**
 * Keeps an open dropdown panel inside the viewport horizontally when its
 * classes make it wider than the field. The panel is moved left with an inline
 * `left` (never a transform, which would create a containing block) and
 * capped to the viewport width (`min-width` too, since a consumer `min-w-*`
 * would beat the cap), so its left edge never goes below the gutter. A panel
 * that already fits gets no inline style. It fits again on window resize and
 * when the panel or its container changes size. Only a previously applied fit
 * is cleared before measuring, and a pass that ends where it started leaves
 * the size unchanged, so the observers settle. Attach the returned ref to the
 * panel.
 */
export function useDropdownViewportFit(
	isOpen: boolean
): RefObject<HTMLDivElement | null> {
	const panelRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		const panel = panelRef.current;
		if (!isOpen || !panel) return;
		let appliedFit = NO_FIT;

		const fitPanel = () => {
			if (!isNoFit(appliedFit)) writeFit(panel, NO_FIT);
			const nextFit = computeFit(readGeometry(panel));
			if (!isNoFit(appliedFit) || !isNoFit(nextFit)) writeFit(panel, nextFit);
			appliedFit = nextFit;
		};

		fitPanel();
		window.addEventListener('resize', fitPanel);
		const observer =
			typeof ResizeObserver === 'undefined'
				? null
				: new ResizeObserver(fitPanel);
		observer?.observe(panel);
		if (panel.parentElement) observer?.observe(panel.parentElement);
		return () => {
			window.removeEventListener('resize', fitPanel);
			observer?.disconnect();
			writeFit(panel, NO_FIT);
		};
	}, [isOpen]);

	return panelRef;
}
