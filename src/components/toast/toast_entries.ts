import { type ReactNode } from 'react';

import { type Radius } from '#components/shared/radius';
import {
	type ToastAction,
	type ToastTone,
} from '#components/toast/toast_types';

export interface ToastEntry {
	id: string;
	message: ReactNode;
	tone: ToastTone;
	duration: number;
	action?: ToastAction;
	radius: Radius;
	unstyled: boolean;
	isClosing: boolean;
}

const MAX_VISIBLE_TOASTS = 3;

export function addToastEntry(
	entries: readonly ToastEntry[],
	entry: ToastEntry
): ToastEntry[] {
	const next = [...entries, entry];
	const activeIds = next
		.filter((candidate) => !candidate.isClosing)
		.map((candidate) => candidate.id);
	const excessCount = Math.max(0, activeIds.length - MAX_VISIBLE_TOASTS);
	const idsToClose = new Set(activeIds.slice(0, excessCount));
	return next.map((candidate) =>
		idsToClose.has(candidate.id) ? { ...candidate, isClosing: true } : candidate
	);
}

export function closeToastEntry(
	entries: readonly ToastEntry[],
	id: string
): ToastEntry[] {
	return entries.map((entry) =>
		entry.id === id ? { ...entry, isClosing: true } : entry
	);
}

export function removeToastEntry(
	entries: readonly ToastEntry[],
	id: string
): ToastEntry[] {
	return entries.filter((entry) => entry.id !== id);
}
