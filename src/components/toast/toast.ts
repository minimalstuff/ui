import { type AlertTone } from '#components/alert/alert_tone';
import { generateToastId } from '#components/toast/toast_id';
import {
	type ToastFunction,
	type ToastMessageOptions,
} from '#components/toast/toast_types';
import { useToastStore } from '#stores/toast_store/toast_store';

const DEFAULT_TOAST_MESSAGE_DURATION_MS = 5000;

const PERSISTENT_TONES: readonly AlertTone[] = ['warning', 'danger'];

function resolveDuration(
	tone: AlertTone,
	options: Readonly<ToastMessageOptions>
): number {
	if (options.duration !== undefined) return options.duration;
	if (PERSISTENT_TONES.includes(tone) || options.action) return Infinity;
	return DEFAULT_TOAST_MESSAGE_DURATION_MS;
}

function showMessage(
	tone: AlertTone,
	message: string,
	options: Readonly<ToastMessageOptions> = {}
): string {
	const id = options.id ?? generateToastId();
	if (typeof window === 'undefined') return id;
	useToastStore.getState().showToast({
		id,
		message,
		description: options.description,
		tone,
		duration: resolveDuration(tone, options),
		action: options.action,
	});
	return id;
}

function dismiss(id?: string): void {
	if (typeof window === 'undefined') return;
	useToastStore.getState().dismissToast(id);
}

/**
 * Shows a toast from anywhere (event handlers, services, outside React) and
 * returns its id. `toast(message)` shows an info toast; use `toast.success`,
 * `toast.warning` and `toast.error` for the other tones, and `toast.dismiss`
 * to close one or all. Mount `<Toaster />` once at the app root to render
 * them. Calling it on the server does nothing but return the id.
 */
export const toast: ToastFunction = Object.assign(
	(message: string, options?: Readonly<ToastMessageOptions>) =>
		showMessage('info', message, options),
	{
		info: (message: string, options?: Readonly<ToastMessageOptions>) =>
			showMessage('info', message, options),
		success: (message: string, options?: Readonly<ToastMessageOptions>) =>
			showMessage('success', message, options),
		warning: (message: string, options?: Readonly<ToastMessageOptions>) =>
			showMessage('warning', message, options),
		error: (message: string, options?: Readonly<ToastMessageOptions>) =>
			showMessage('danger', message, options),
		dismiss,
	}
);
