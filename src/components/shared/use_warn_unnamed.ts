import { useEffect } from 'react';

const DEFAULT_GUIDANCE =
	'needs an accessible name. Provide a `label`, `aria-label` or `aria-labelledby` prop.';

/** Development only: warns once per mount when a component has no accessible name. */
export function useWarnUnnamed(
	componentName: string,
	isNamed: boolean,
	guidance: string = DEFAULT_GUIDANCE
): void {
	useEffect(() => {
		if (process.env.NODE_ENV === 'production' || isNamed) return;
		console.warn(`${componentName}: ${guidance}`);
	}, [componentName, isNamed, guidance]);
}
