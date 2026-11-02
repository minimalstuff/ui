import { useLayoutEffect, type ReactNode } from 'react';

const CONSUMER_UTILITIES_CSS = [
	'.w-full{width:100%}',
	'.p-2{padding:.5rem}',
	'.rounded-md{border-radius:.375rem}',
	'.border{border-width:1px}',
	'.border-transparent{border-color:transparent}',
	'.border-blue-300{border-color:#93c5fd}',
].join('');

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
