import { type ReactNode } from 'react';

import { type AlertTone } from '#components/alert/alert_tone';
import { type Radius } from '#components/shared/radius';
import { isPersistentDuration } from '#components/toast/toast_styles';
import { type ToastAction } from '#components/toast/toast_types';

export const TOAST_LIMIT = 5;
const MAX_CLOSING_ENTRIES = TOAST_LIMIT;

export interface ToastStoreEntry {
	id: string;
	message: ReactNode;
	description?: string;
	tone: AlertTone;
	duration: number;
	action?: ToastAction;
	radius?: Radius;
	unstyled?: boolean;
	revision: number;
	isClosing: boolean;
	isPinned: boolean;
}

export type ToastStoreInput = Omit<
	ToastStoreEntry,
	'revision' | 'isClosing' | 'isPinned'
>;

function countActiveEntries(entries: readonly ToastStoreEntry[]): number {
	return entries.filter((entry) => !entry.isClosing).length;
}

function findEvictionCandidate(
	entries: readonly ToastStoreEntry[]
): ToastStoreEntry | undefined {
	const candidates = entries.filter(
		(entry) => !entry.isClosing && !entry.isPinned
	);
	return (
		candidates.find((entry) => !isPersistentDuration(entry.duration)) ??
		candidates[0]
	);
}

export function evictExcessEntries(
	entries: readonly ToastStoreEntry[]
): readonly ToastStoreEntry[] {
	let current = entries;
	while (countActiveEntries(current) > TOAST_LIMIT) {
		const candidate = findEvictionCandidate(current);
		if (!candidate) return current;
		current = markEntriesClosing(current, candidate.id);
	}
	return current;
}

export function upsertEntry(
	entries: readonly ToastStoreEntry[],
	input: Readonly<ToastStoreInput>
): readonly ToastStoreEntry[] {
	const existing = entries.find((entry) => entry.id === input.id);
	if (!existing) {
		const created: ToastStoreEntry = {
			...input,
			revision: 0,
			isClosing: false,
			isPinned: false,
		};
		return [...entries, created];
	}
	const replaced: ToastStoreEntry = {
		...input,
		revision: existing.revision + 1,
		isClosing: false,
		isPinned: existing.isPinned,
	};
	return entries.map((entry) => (entry.id === input.id ? replaced : entry));
}

export function markEntriesClosing(
	entries: readonly ToastStoreEntry[],
	id?: string
): readonly ToastStoreEntry[] {
	const isTargeted = (entry: ToastStoreEntry): boolean =>
		(id === undefined || entry.id === id) && !entry.isClosing;
	if (!entries.some(isTargeted)) return entries;
	return entries.map((entry) =>
		isTargeted(entry) ? { ...entry, isClosing: true } : entry
	);
}

export function deleteEntry(
	entries: readonly ToastStoreEntry[],
	id: string
): readonly ToastStoreEntry[] {
	if (!entries.some((entry) => entry.id === id)) return entries;
	return entries.filter((entry) => entry.id !== id);
}

export function updateEntryPinned(
	entries: readonly ToastStoreEntry[],
	id: string,
	isPinned: boolean
): readonly ToastStoreEntry[] {
	const target = entries.find((entry) => entry.id === id);
	if (!target || target.isPinned === isPinned) return entries;
	return entries.map((entry) =>
		entry.id === id ? { ...entry, isPinned } : entry
	);
}

export function pruneClosingEntries(
	entries: readonly ToastStoreEntry[]
): readonly ToastStoreEntry[] {
	const closingCount = entries.filter((entry) => entry.isClosing).length;
	let excessCount = closingCount - MAX_CLOSING_ENTRIES;
	if (excessCount <= 0) return entries;
	return entries.filter((entry) => {
		if (!entry.isClosing || excessCount <= 0) return true;
		excessCount -= 1;
		return false;
	});
}
