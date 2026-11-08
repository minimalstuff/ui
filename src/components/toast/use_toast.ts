import { generateToastId } from '#components/toast/toast_id';
import { getDefaultToastDuration } from '#components/toast/toast_styles';
import {
	type ToastApi,
	type ToastOptions,
} from '#components/toast/toast_types';
import { useToastStore } from '#stores/toast_store/toast_store';

function resolveLegacyDuration(options: Readonly<ToastOptions>): number {
	if (options.duration !== undefined) return options.duration;
	if (options.action) return Infinity;
	return getDefaultToastDuration(options.tone ?? 'info');
}

function showLegacyToast(options: Readonly<ToastOptions>): string {
	const id = generateToastId();
	if (typeof window === 'undefined') return id;
	const tone = options.tone ?? 'info';
	useToastStore.getState().showToast({
		id,
		message: options.message,
		tone: tone === 'error' ? 'danger' : tone,
		duration: resolveLegacyDuration(options),
		action: options.action,
		radius: options.radius,
		unstyled: options.unstyled,
	});
	return id;
}

function dismissLegacyToast(id: string): void {
	if (typeof window === 'undefined') return;
	useToastStore.getState().dismissToast(id);
}

const legacyToastApi: ToastApi = {
	show: showLegacyToast,
	dismiss: dismissLegacyToast,
};

/**
 * @deprecated Call `toast()` from `@minimalstuff/ui` instead, and mount
 * `<Toaster />` once at the app root. Returns a constant `{ show, dismiss }`
 * that forwards to the same toast store; it no longer needs a `ToastProvider`
 * and no longer throws without one.
 */
export function useToast(): ToastApi {
	return legacyToastApi;
}
