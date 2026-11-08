import { useEffect, useId, useSyncExternalStore } from 'react';

import {
	isActiveToaster,
	registerToaster,
	subscribeToasterRegistry,
} from '#components/toast/toaster_registry';

const DUPLICATE_TOASTER_WARNING =
	'Toaster: another <Toaster /> is already mounted, so this one renders nothing. Mount a single Toaster at the app root.';

function getServerSnapshot(): boolean {
	return false;
}

/**
 * Registers the calling Toaster and tells whether it is the one rendering.
 * Always `false` on the server and on the first client render.
 */
export function useIsActiveToaster(): boolean {
	const toasterId = useId();

	useEffect(() => {
		const unregister = registerToaster(toasterId);
		if (!isActiveToaster(toasterId) && process.env.NODE_ENV !== 'production')
			console.warn(DUPLICATE_TOASTER_WARNING);
		return unregister;
	}, [toasterId]);

	return useSyncExternalStore(
		subscribeToasterRegistry,
		() => isActiveToaster(toasterId),
		getServerSnapshot
	);
}
