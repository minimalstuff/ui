import { type ReactNode, useEffect } from 'react';

interface UnnamedModalOptions {
	title?: ReactNode;
	ariaLabel?: string;
}

/** Development only: warns once per mount when a dialog has neither a title nor an `aria-label`. */
export function useWarnUnnamedModal({
	title,
	ariaLabel,
}: Readonly<UnnamedModalOptions>): void {
	const isNamed = Boolean(title) || Boolean(ariaLabel?.trim());

	useEffect(() => {
		if (process.env.NODE_ENV === 'production' || isNamed) return;
		console.warn(
			'Modal: a dialog needs an accessible name. Provide a non-empty `title` or `aria-label` prop.'
		);
	}, [isNamed]);
}
