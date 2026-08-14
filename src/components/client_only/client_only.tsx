import { useIsClient } from '#hooks/use_is_client/use_is_client';

interface ClientOnlyProps extends React.PropsWithChildren {
	fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback }: Readonly<ClientOnlyProps>) {
	const isClient = useIsClient();

	if (!isClient) {
		return fallback ?? null;
	}

	return <>{children}</>;
}
