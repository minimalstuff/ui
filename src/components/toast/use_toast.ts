import { useContext } from 'react';

import { ToastContext } from '#components/toast/toast_context';
import { type ToastApi } from '#components/toast/toast_types';

export function useToast(): ToastApi {
	const toastApi = useContext(ToastContext);
	if (!toastApi)
		throw new Error('useToast must be used inside a ToastProvider');
	return toastApi;
}
