import { useClientOnly } from '#hooks/use_client_only/use_client_only';
import { createElement, Fragment } from 'react';

interface ClientOnlyProps extends React.PropsWithChildren {
	fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback }: ClientOnlyProps) {
	const hasMounted = useClientOnly();

	if (!hasMounted) {
		return fallback ?? null;
	}

	return createElement(Fragment, { children });
}
