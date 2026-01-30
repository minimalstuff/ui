import { useCallback } from 'react';

export function useRunAfterAnimation(durationMs: number) {
	return useCallback(
		(callback: () => void) => {
			const id = setTimeout(callback, durationMs);
			return () => clearTimeout(id);
		},
		[durationMs]
	);
}
