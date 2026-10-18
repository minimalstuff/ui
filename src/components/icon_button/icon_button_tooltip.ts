import type { ReactNode } from 'react';

import { type TooltipPosition } from '#components/tooltip/tooltip_position';

export interface IconButtonTooltipOptions {
	position?: TooltipPosition;
	/** Defaults to the button's `aria-label`. */
	content?: ReactNode;
}

/**
 * Wraps the button in a `Tooltip`. `true` shows the `aria-label` at the
 * default position, a position string moves it, and an object also allows
 * custom `content`. When the tooltip repeats the `aria-label` it does not
 * describe the button, so screen readers do not announce the name twice.
 */
export type IconButtonTooltip =
	| boolean
	| TooltipPosition
	| IconButtonTooltipOptions;
