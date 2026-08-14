import { describe, expect, test } from 'vitest';

import { useGlobalHotkeysStore } from './global_hotkeys_store';

describe('useGlobalHotkeysStore', () => {
	test('starts with hotkeys enabled', () => {
		expect(useGlobalHotkeysStore.getState().globalHotkeysEnabled).toBe(true);
	});

	test('setGlobalHotkeysEnabled updates the flag', () => {
		useGlobalHotkeysStore.getState().setGlobalHotkeysEnabled(false);
		expect(useGlobalHotkeysStore.getState().globalHotkeysEnabled).toBe(false);

		useGlobalHotkeysStore.getState().setGlobalHotkeysEnabled(true);
		expect(useGlobalHotkeysStore.getState().globalHotkeysEnabled).toBe(true);
	});
});
