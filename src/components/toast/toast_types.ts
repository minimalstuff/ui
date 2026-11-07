import { type ReactNode } from 'react';

import { type Radius } from '#components/shared/radius';

export type ToastTone = 'info' | 'success' | 'error';

export interface ToastAction {
	label: string;
	/** Runs on click, then the toast is dismissed. */
	onClick: () => void;
}

export interface ToastOptions {
	message: ReactNode;
	/** Defaults to `'info'`. `'error'` is announced assertively, the others politely. */
	tone?: ToastTone;
	/**
	 * Milliseconds before the toast dismisses itself, counted only while it is
	 * neither hovered nor focused. Defaults to 4000 (6000 for `'error'`). `0` or
	 * `Infinity` keeps the toast until it is dismissed.
	 */
	duration?: number;
	action?: ToastAction;
	radius?: Radius;
	/** Strips the library's visual styling (surface, border, shadow, radius, typography, tone colours, animation), keeping layout, behaviour and the 24px minimum size of the close button. `radius` is ignored. */
	unstyled?: boolean;
}

export interface ToastApi {
	/** Shows a toast and returns its id. */
	show: (options: Readonly<ToastOptions>) => string;
	/** Dismisses the toast with this id; an unknown or already dismissed id is ignored. */
	dismiss: (id: string) => void;
}
