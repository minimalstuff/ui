import { create } from 'zustand';

import {
	deleteEntry,
	evictExcessEntries,
	markEntriesClosing,
	pruneClosingEntries,
	type ToastStoreEntry,
	type ToastStoreInput,
	updateEntryPinned,
	upsertEntry,
} from '#stores/toast_store/toast_store_entries';

export { TOAST_LIMIT } from '#stores/toast_store/toast_store_entries';
export type { ToastStoreInput } from '#stores/toast_store/toast_store_entries';

interface ToastStore {
	entries: readonly ToastStoreEntry[];
	showToast: (input: Readonly<ToastStoreInput>) => void;
	dismissToast: (id?: string) => void;
	removeToast: (id: string) => void;
	setToastPinned: (id: string, isPinned: boolean) => void;
	resetToasts: () => void;
}

function applyEntries(
	state: ToastStore,
	next: readonly ToastStoreEntry[]
): ToastStore {
	return next === state.entries ? state : { ...state, entries: next };
}

export const useToastStore = create<ToastStore>((set) => ({
	entries: [],
	showToast: (input) =>
		set((state) => ({
			entries: pruneClosingEntries(
				evictExcessEntries(upsertEntry(state.entries, input))
			),
		})),
	dismissToast: (id) =>
		set((state) => applyEntries(state, markEntriesClosing(state.entries, id))),
	removeToast: (id) =>
		set((state) => applyEntries(state, deleteEntry(state.entries, id))),
	setToastPinned: (id, isPinned) =>
		set((state) =>
			applyEntries(state, updateEntryPinned(state.entries, id, isPinned))
		),
	resetToasts: () =>
		set((state) =>
			state.entries.length === 0 ? state : { ...state, entries: [] }
		),
}));
