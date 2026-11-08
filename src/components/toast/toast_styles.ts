import { type ToastTone } from '#components/toast/toast_types';

const MAX_TIMEOUT_MS = 2 ** 31 - 1;
const DEFAULT_TOAST_DURATION_MS = 4000;
const DEFAULT_ERROR_TOAST_DURATION_MS = 6000;

export const TONE_ICON_CLASSES: Record<ToastTone, string> = {
	info: 'i-mdi-information-outline text-blue-600 dark:text-blue-400',
	success: 'i-mdi-check-circle-outline text-green-600 dark:text-green-400',
	error: 'i-mdi-alert-circle-outline text-red-600 dark:text-red-400',
};

export function getDefaultToastDuration(tone: ToastTone): number {
	return tone === 'error'
		? DEFAULT_ERROR_TOAST_DURATION_MS
		: DEFAULT_TOAST_DURATION_MS;
}

export function isPersistentDuration(duration: number): boolean {
	return (
		duration <= 0 || !Number.isFinite(duration) || duration >= MAX_TIMEOUT_MS
	);
}
