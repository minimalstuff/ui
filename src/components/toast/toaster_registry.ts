import { useToastStore } from '#stores/toast_store/toast_store';

const registeredToasterIds: string[] = [];
const listeners = new Set<() => void>();
let resetGeneration = 0;

function notifyListeners(): void {
	for (const listener of listeners) listener();
}

function scheduleStoreReset(): void {
	const scheduledGeneration = resetGeneration;
	queueMicrotask(() => {
		if (scheduledGeneration !== resetGeneration) return;
		useToastStore.getState().resetToasts();
	});
}

export function subscribeToasterRegistry(listener: () => void): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

export function isActiveToaster(id: string): boolean {
	return registeredToasterIds[0] === id;
}

/**
 * Registers a mounted Toaster and returns its unregister function. The first
 * registered Toaster is the active one. Once the last one unregisters, the
 * store is emptied in a microtask, unless a Toaster registers meanwhile (a
 * StrictMode remount).
 */
export function registerToaster(id: string): () => void {
	resetGeneration += 1;
	registeredToasterIds.push(id);
	notifyListeners();
	return () => {
		const index = registeredToasterIds.indexOf(id);
		if (index === -1) return;
		registeredToasterIds.splice(index, 1);
		notifyListeners();
		if (registeredToasterIds.length === 0) scheduleStoreReset();
	};
}
