export type ButtonVariant =
	| 'solid'
	| 'outline'
	| 'ghost'
	| 'subtle'
	| 'unstyled';
export type ButtonColor =
	| 'primary'
	| 'neutral'
	| 'danger'
	| 'success'
	| 'warning';

interface ButtonColorTokens {
	solid: string;
	outline: string;
	ghost: string;
	subtle: string;
	focusOutline: string;
}

export const BUTTON_COLOR_TOKENS: Record<ButtonColor, ButtonColorTokens> = {
	primary: {
		solid:
			'border-transparent bg-blue-600 text-white enabled:hover:bg-blue-700 enabled:active:bg-blue-800 dark:bg-blue-500 dark:enabled:hover:bg-blue-600 dark:enabled:active:bg-blue-700',
		outline:
			'border-blue-300 bg-transparent text-blue-700 enabled:hover:bg-blue-50 enabled:active:bg-blue-100 dark:border-blue-800 dark:text-blue-400 dark:enabled:hover:bg-blue-950/40 dark:enabled:active:bg-blue-950/60',
		ghost:
			'border-transparent bg-transparent text-blue-700 enabled:hover:bg-blue-50 enabled:active:bg-blue-100 dark:text-blue-400 dark:enabled:hover:bg-blue-950/40 dark:enabled:active:bg-blue-950/60',
		subtle:
			'border-transparent bg-blue-50 text-blue-700 enabled:hover:bg-blue-100 enabled:active:bg-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:enabled:hover:bg-blue-500/20 dark:enabled:active:bg-blue-500/30',
		focusOutline: 'focus-visible:outline-blue-500',
	},
	neutral: {
		solid:
			'border-transparent bg-gray-200 text-gray-900 enabled:hover:bg-gray-300 enabled:active:bg-gray-400 dark:bg-gray-600 dark:text-gray-100 dark:enabled:hover:bg-gray-500 dark:enabled:active:bg-gray-400',
		outline:
			'border-gray-300 bg-transparent text-gray-700 enabled:hover:bg-gray-50 enabled:active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:enabled:hover:bg-gray-800/50 dark:enabled:active:bg-gray-800/80',
		ghost:
			'border-transparent bg-transparent text-gray-700 enabled:hover:bg-gray-100 enabled:active:bg-gray-200 dark:text-gray-300 dark:enabled:hover:bg-gray-700/50 dark:enabled:active:bg-gray-700/80',
		subtle:
			'border-transparent bg-gray-100 text-gray-700 enabled:hover:bg-gray-200 enabled:active:bg-gray-300 dark:bg-gray-700/50 dark:text-gray-300 dark:enabled:hover:bg-gray-600/50 dark:enabled:active:bg-gray-600/80',
		focusOutline: 'focus-visible:outline-gray-400',
	},
	danger: {
		solid:
			'border-transparent bg-red-600 text-white enabled:hover:bg-red-700 enabled:active:bg-red-800 dark:bg-red-500 dark:enabled:hover:bg-red-600 dark:enabled:active:bg-red-700',
		outline:
			'border-red-300 bg-transparent text-red-700 enabled:hover:bg-red-50 enabled:active:bg-red-100 dark:border-red-800 dark:text-red-400 dark:enabled:hover:bg-red-950/40 dark:enabled:active:bg-red-950/60',
		ghost:
			'border-transparent bg-transparent text-red-700 enabled:hover:bg-red-50 enabled:active:bg-red-100 dark:text-red-400 dark:enabled:hover:bg-red-950/40 dark:enabled:active:bg-red-950/60',
		subtle:
			'border-transparent bg-red-50 text-red-700 enabled:hover:bg-red-100 enabled:active:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:enabled:hover:bg-red-500/20 dark:enabled:active:bg-red-500/30',
		focusOutline: 'focus-visible:outline-red-500',
	},
	success: {
		solid:
			'border-transparent bg-green-600 text-white enabled:hover:bg-green-700 enabled:active:bg-green-800 dark:bg-green-500 dark:enabled:hover:bg-green-600 dark:enabled:active:bg-green-700',
		outline:
			'border-green-300 bg-transparent text-green-700 enabled:hover:bg-green-50 enabled:active:bg-green-100 dark:border-green-800 dark:text-green-400 dark:enabled:hover:bg-green-950/40 dark:enabled:active:bg-green-950/60',
		ghost:
			'border-transparent bg-transparent text-green-700 enabled:hover:bg-green-50 enabled:active:bg-green-100 dark:text-green-400 dark:enabled:hover:bg-green-950/40 dark:enabled:active:bg-green-950/60',
		subtle:
			'border-transparent bg-green-50 text-green-700 enabled:hover:bg-green-100 enabled:active:bg-green-200 dark:bg-green-500/10 dark:text-green-400 dark:enabled:hover:bg-green-500/20 dark:enabled:active:bg-green-500/30',
		focusOutline: 'focus-visible:outline-green-500',
	},
	warning: {
		solid:
			'border-transparent bg-yellow-600 text-white enabled:hover:bg-yellow-700 enabled:active:bg-yellow-800 dark:bg-yellow-500 dark:enabled:hover:bg-yellow-600 dark:enabled:active:bg-yellow-700',
		outline:
			'border-yellow-300 bg-transparent text-yellow-700 enabled:hover:bg-yellow-50 enabled:active:bg-yellow-100 dark:border-yellow-800 dark:text-yellow-400 dark:enabled:hover:bg-yellow-950/40 dark:enabled:active:bg-yellow-950/60',
		ghost:
			'border-transparent bg-transparent text-yellow-700 enabled:hover:bg-yellow-50 enabled:active:bg-yellow-100 dark:text-yellow-400 dark:enabled:hover:bg-yellow-950/40 dark:enabled:active:bg-yellow-950/60',
		subtle:
			'border-transparent bg-yellow-50 text-yellow-700 enabled:hover:bg-yellow-100 enabled:active:bg-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:enabled:hover:bg-yellow-500/20 dark:enabled:active:bg-yellow-500/30',
		focusOutline: 'focus-visible:outline-yellow-500',
	},
};

/** Kept even when `unstyled`: without these, icon slots and disabled state stop working. */
export const BUTTON_LAYOUT_CLASSES =
	'inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';

/** Visual chrome, dropped entirely when `unstyled`. */
export const BUTTON_INTERACTIVE_CLASSES =
	'cursor-pointer transition-[color,background-color,border-color,transform] duration-200 enabled:active:duration-75 enabled:active:scale-[0.95] outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2';
