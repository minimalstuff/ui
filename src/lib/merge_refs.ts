import type { Ref, RefCallback } from 'react';

/**
 * Combines refs that must all observe the same DOM node — e.g. a consumer's
 * forwarded `ref` alongside a library's own internal one (floating-ui's
 * `setReference`). Skips `null`/`undefined` entries so callers can pass an
 * optional ref without a conditional.
 */
export function mergeRefs<TElement>(
	...refs: readonly (Ref<TElement> | undefined)[]
): RefCallback<TElement> {
	return (node) => {
		for (const ref of refs) {
			if (typeof ref === 'function') {
				ref(node);
			} else if (ref) {
				ref.current = node;
			}
		}
	};
}
