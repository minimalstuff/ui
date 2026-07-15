import { useEffect } from 'react';

import { useGlobalHotkeysStore } from '#stores/global_hotkeys_store/global_hotkeys_store';

let mountedCount = 0;

export function useDisableHotkeysWhileMounted(): void {
	useEffect(() => {
		mountedCount += 1;
		if (mountedCount === 1) {
			useGlobalHotkeysStore.getState().setGlobalHotkeysEnabled(false);
		}

		return () => {
			mountedCount -= 1;
			if (mountedCount === 0) {
				useGlobalHotkeysStore.getState().setGlobalHotkeysEnabled(true);
			}
		};
	}, []);
}
