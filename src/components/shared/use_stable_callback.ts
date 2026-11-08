import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * Returns a function whose identity never changes but that always calls the
 * latest `callback`, so a handler closing over fresh state can be handed to
 * memoized children without defeating the memoization.
 */
export function useStableCallback<TArguments extends unknown[]>(
	callback: (...callbackArguments: TArguments) => void
): (...callbackArguments: TArguments) => void {
	const latestCallback = useRef(callback);

	useLayoutEffect(() => {
		latestCallback.current = callback;
	});

	return useCallback((...callbackArguments: TArguments) => {
		latestCallback.current(...callbackArguments);
	}, []);
}
