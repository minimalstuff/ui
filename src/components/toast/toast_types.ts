import { type ReactNode } from 'react';

import { type Radius } from '#components/shared/radius';

/** @deprecated Use the `toast.info`, `toast.success`, `toast.warning` and `toast.error` functions. */
export type ToastTone = 'info' | 'success' | 'error';

export interface ToastAction {
	label: string;
	/** Runs on click, then the toast is dismissed. */
	onClick: () => void;
}

/** @deprecated Use `toast()` and its `ToastMessageOptions`. */
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

/** @deprecated Use `toast()` instead of `useToast()`. */
export interface ToastApi {
	/** Shows a toast and returns its id. */
	show: (options: Readonly<ToastOptions>) => string;
	/** Dismisses the toast with this id; an unknown or already dismissed id is ignored. */
	dismiss: (id: string) => void;
}

export interface ToastMessageOptions {
	/** Identifies the toast. Showing a toast with an id already in use replaces that toast in place, restarts its timer and announces it again. */
	id?: string;
	/** Secondary text shown under the message. */
	description?: string;
	/** Milliseconds before the toast dismisses itself. Defaults to 5000 for info and success; warning, error and any toast with an action stay until dismissed. An explicit value always wins; `0` or `Infinity` keeps the toast. Give a toast with an action a duration only when that action is also available elsewhere in the page. */
	duration?: number;
	/** Button shown in the toast; the toast is dismissed after it runs. */
	action?: ToastAction;
}

export interface ToastFunction {
	/** Shows an info toast and returns its id. */
	(message: string, options?: Readonly<ToastMessageOptions>): string;
	/** Shows an info toast and returns its id. */
	info(message: string, options?: Readonly<ToastMessageOptions>): string;
	/** Shows a success toast and returns its id. */
	success(message: string, options?: Readonly<ToastMessageOptions>): string;
	/** Shows a warning toast and returns its id. It stays until dismissed unless a duration is given. */
	warning(message: string, options?: Readonly<ToastMessageOptions>): string;
	/** Shows an error toast and returns its id. It stays until dismissed unless a duration is given. */
	error(message: string, options?: Readonly<ToastMessageOptions>): string;
	/** Dismisses the toast with this id; an unknown id is ignored. Without id, dismisses every toast. */
	dismiss(id?: string): void;
}
