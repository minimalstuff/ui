import { type AlertTone } from '#components/alert/alert_tone';
import { type ButtonColor } from '#components/shared/button_styles';

export const ALERT_TONE_CLASSES: Record<AlertTone, string> = {
	info: 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300',
	success:
		'border-green-300 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300',
	warning:
		'border-yellow-400 bg-yellow-50 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-300',
	danger:
		'border-red-300 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
};

export const ALERT_ICON_COLOR_CLASSES: Record<AlertTone, string> = {
	info: 'text-blue-600 dark:text-blue-400',
	success: 'text-green-600 dark:text-green-400',
	warning: 'text-yellow-600 dark:text-yellow-400',
	danger: 'text-red-600 dark:text-red-400',
};

export const ALERT_DEFAULT_ICONS: Record<AlertTone, string> = {
	info: 'i-mdi-information-outline',
	success: 'i-mdi-check-circle-outline',
	warning: 'i-mdi-alert-outline',
	danger: 'i-mdi-alert-circle-outline',
};

export const ALERT_BUTTON_COLORS: Record<AlertTone, ButtonColor> = {
	info: 'primary',
	success: 'success',
	warning: 'warning',
	danger: 'danger',
};
