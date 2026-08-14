import { useIsClient } from '#hooks/use_is_client/use_is_client';

/** Wraps `Component` so it only renders once the client has mounted. */
export const withClientOnly = <TProps extends object>(
	Component: React.ComponentType<TProps>
): React.ComponentType<TProps> => {
	function WithClientOnly(props: TProps) {
		const isClient = useIsClient();
		return isClient ? <Component {...props} /> : null;
	}

	return WithClientOnly;
};
