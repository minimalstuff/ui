import { useEffect, type RefObject } from 'react';

const DEFAULT_GUIDANCE =
	'needs an accessible name. Provide a `label`, `aria-label` or `aria-labelledby` prop.';

const INPUT_GUIDANCE =
	'needs an accessible name. Provide a `label`, `aria-label` or `aria-labelledby` prop, or a `<label>` that targets it.';

function warnUnnamed(componentName: string, guidance: string): void {
	if (process.env.NODE_ENV === 'production') return;
	console.warn(`${componentName}: ${guidance}`);
}

/** Development only: warns once per mount when a component has no accessible name. */
export function useWarnUnnamed(
	componentName: string,
	isNamed: boolean,
	guidance: string = DEFAULT_GUIDANCE
): void {
	useEffect(() => {
		if (isNamed) return;
		warnUnnamed(componentName, guidance);
	}, [componentName, isNamed, guidance]);
}

/**
 * Development only: like `useWarnUnnamed` for a native input, but also accepts
 * a `<label>` (`for` or enclosing) found on the mounted element.
 */
export function useWarnUnnamedInput(
	componentName: string,
	inputRef: RefObject<HTMLInputElement | null>,
	isNamedByProps: boolean,
	guidance: string = INPUT_GUIDANCE
): void {
	useEffect(() => {
		if (isNamedByProps) return;
		if ((inputRef.current?.labels?.length ?? 0) > 0) return;
		warnUnnamed(componentName, guidance);
	}, [componentName, inputRef, isNamedByProps, guidance]);
}
