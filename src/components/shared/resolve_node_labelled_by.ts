import type { ReactNode } from 'react';

/**
 * The id of the label span for a non-empty non-string `label`, which `Field`
 * cannot bind with `htmlFor`. A string label is bound natively, and a
 * caller-supplied `aria-label` is left to win, so both return `undefined`.
 */
export function resolveNodeLabelledBy(
	label: ReactNode,
	labelId: string,
	ariaLabel?: string
): string | undefined {
	if (!label || typeof label === 'string') return undefined;
	if (ariaLabel) return undefined;
	return labelId;
}
