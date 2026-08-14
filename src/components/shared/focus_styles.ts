/**
 * The three focus recipes in the library. Buttons draw an outline; text fields
 * draw a ring on `focus`; controls that hide their real input behind a custom
 * box (Checkbox, Switch, RadioOptions) draw the same ring on `focus-within`.
 */

/** Pair with a `focus-visible:outline-*` colour from `BUTTON_COLOR_TOKENS`. */
export const BUTTON_FOCUS_OUTLINE =
	'outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2';

export const FIELD_FOCUS_RING =
	'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
export const FIELD_FOCUS_RING_ERROR = 'focus:ring-red-500';

/** Pair with one of the two colours below, which are mutually exclusive. */
export const CONTROL_FOCUS_RING =
	'focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-900';
export const CONTROL_FOCUS_RING_COLOR = 'focus-within:ring-blue-500';
export const CONTROL_FOCUS_RING_ERROR_COLOR = 'focus-within:ring-red-500';
