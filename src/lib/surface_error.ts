/**
 * Hands an error the library cannot handle itself back to the consumer. With
 * no `onError`, it is rethrown to the global handler rather than logged, so it
 * reaches `window.onerror` and any error reporter instead of being swallowed.
 */
export function surfaceError(
	error: unknown,
	onError?: (error: unknown) => void
): void {
	if (onError) {
		onError(error);
		return;
	}

	queueMicrotask(() => {
		throw error;
	});
}
