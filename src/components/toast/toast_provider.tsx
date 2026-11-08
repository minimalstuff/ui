import { type ReactNode } from 'react';

import { Toaster } from '#components/toast/toaster';

/** @deprecated Use `ToasterProps` and mount `<Toaster />`. */
export interface ToastProviderProps {
	children: ReactNode;
}

/**
 * @deprecated Mount `<Toaster />` once at the app root and call `toast()`
 * instead. Renders `children` followed by a default `<Toaster />`.
 */
export const ToastProvider = ({ children }: Readonly<ToastProviderProps>) => (
	<>
		{children}
		<Toaster />
	</>
);
