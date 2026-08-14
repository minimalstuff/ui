import { FIELD_FOCUS_RING } from '#components/shared/focus_styles';
import { CONTROL_BG, CONTROL_BORDER } from '#components/shared/surface_tokens';

/** Chrome shared by every text-entry control (Input, Textarea, Select, Combobox). */
export const BASE_INPUT_STYLES = `w-full border ${CONTROL_BORDER} ${CONTROL_BG} text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${FIELD_FOCUS_RING} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`;

export const FIELD_LABEL_TEXT =
	'text-sm font-medium text-gray-700 dark:text-gray-300';
export const FIELD_REQUIRED_MARK = 'text-red-500 dark:text-red-400 ml-1';
export const FIELD_DESCRIPTION_TEXT =
	'text-xs text-gray-500 dark:text-gray-400';
export const FIELD_ERROR_TEXT = 'text-xs text-red-600 dark:text-red-400';
export const FIELD_ERROR_BORDER = 'border-red-500 dark:border-red-400';
