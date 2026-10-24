import { useLayoutEffect, type ReactNode } from 'react';

const CONSUMER_UTILITIES_CSS = '.w-full{width:100%}.p-2{padding:.5rem}';

export function ConsumerUtilities({
	children,
}: Readonly<{ children: ReactNode }>) {
	useLayoutEffect(() => {
		const style = document.createElement('style');
		style.textContent = CONSUMER_UTILITIES_CSS;
		document.head.appendChild(style);
		return () => style.remove();
	}, []);

	return children;
}
