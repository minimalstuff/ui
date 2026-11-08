import { type RefObject, useLayoutEffect, useRef, useState } from 'react';

import {
	OPTION_SELECTOR,
	readListboxRowHeight,
} from '#components/shared/listbox_page_size';
import { useStableCallback } from '#components/shared/use_stable_callback';

export type ListboxMetrics = {
	rowHeight: number;
	viewportHeight: number;
	edgePadding: number;
};

const UNMEASURED: ListboxMetrics = {
	rowHeight: 0,
	viewportHeight: 0,
	edgePadding: 0,
};

type UseListboxMetricsParams = {
	listboxRef: RefObject<HTMLElement | null>;
	optionCount: number;
	activeIndex: number;
	isEnabled: boolean;
};

function readMetrics(
	listbox: HTMLElement,
	activeIndex: number
): ListboxMetrics {
	return {
		rowHeight: readListboxRowHeight(listbox, activeIndex),
		viewportHeight: listbox.clientHeight,
		edgePadding: Number.parseFloat(getComputedStyle(listbox).paddingTop) || 0,
	};
}

function areMetricsEqual(first: ListboxMetrics, second: ListboxMetrics) {
	return (
		first.rowHeight === second.rowHeight &&
		first.viewportHeight === second.viewportHeight &&
		first.edgePadding === second.edgePadding
	);
}

/**
 * Measures the listbox viewport and a rendered row (never the active one, which can be taller), and measures again when
 * either is resized (zoom, text spacing, container size). Everything stays at
 * zero in a DOM without layout. Measures again when the option count changes,
 * so a window is never computed from a stale viewport. Does nothing while `isEnabled` is false.
 */
export function useListboxMetrics({
	listboxRef,
	optionCount,
	activeIndex,
	isEnabled,
}: Readonly<UseListboxMetricsParams>): ListboxMetrics {
	const [metrics, setMetrics] = useState(UNMEASURED);
	const observerRef = useRef<ResizeObserver | null>(null);
	const observedRowRef = useRef<Element | null>(null);

	const measure = useStableCallback(() => {
		const listbox = listboxRef.current;
		if (!listbox) return;
		const readings = readMetrics(listbox, activeIndex);
		setMetrics((current) => {
			const nextMetrics = {
				...readings,
				rowHeight: readings.rowHeight || current.rowHeight,
			};
			return areMetricsEqual(current, nextMetrics) ? current : nextMetrics;
		});
	});

	useLayoutEffect(() => {
		const listbox = listboxRef.current;
		if (!isEnabled || !listbox || typeof ResizeObserver === 'undefined') return;
		const observer = new ResizeObserver(measure);
		observer.observe(listbox);
		observerRef.current = observer;
		return () => {
			observer.disconnect();
			observerRef.current = null;
			observedRowRef.current = null;
		};
	}, [isEnabled, listboxRef, measure]);

	useLayoutEffect(() => {
		const listbox = listboxRef.current;
		if (!isEnabled || !listbox) return;
		const observedRow = observedRowRef.current;
		if (observedRow?.isConnected) return;
		if (observedRow) observerRef.current?.unobserve(observedRow);
		const firstRow = listbox.querySelector(OPTION_SELECTOR);
		if (firstRow) observerRef.current?.observe(firstRow);
		observedRowRef.current = firstRow;
		if (!observerRef.current) measure();
	});

	useLayoutEffect(() => {
		if (isEnabled) measure();
	}, [isEnabled, optionCount, measure]);

	return metrics;
}
