import {
	type ButtonColor,
	type ButtonVariant,
} from '#components/shared/button_styles';

/** Raises the focused half so its focus ring is not covered by its sibling. */
export const SPLIT_HALF_FOCUS_CLASSES = 'relative focus-visible:z-10';

/**
 * The join overrides are `!important`: each competes with a `Button` class
 * (`rounded-*`, `border`, `border-<colour>`) at equal specificity. An app that
 * loads its own utilities after `style.css` and also uses `rounded-md` would
 * otherwise win by source order and round the joined corners.
 * `border-l` is not overridden: it only restates the 1px width `Button` already sets.
 */
export const MAIN_HALF_CLASSES = '!rounded-r-none';

const TRIGGER_HALF_CLASSES = '!rounded-l-none border-l';

/** Outline halves already draw a border, so the main button's right border is the divider. */
const TRIGGER_DIVIDER_CLASSES: Record<ButtonVariant, string> = {
	solid: '!border-l-white/40',
	outline: '!border-l-0',
	ghost: '!border-l-current/25',
	subtle: '!border-l-current/25',
};

const NEUTRAL_SOLID_DIVIDER_CLASSES = '!border-l-gray-400';

export function getTriggerHalfClasses(
	variant: ButtonVariant,
	color: ButtonColor
): string[] {
	const divider =
		variant === 'solid' && color === 'neutral'
			? NEUTRAL_SOLID_DIVIDER_CLASSES
			: TRIGGER_DIVIDER_CLASSES[variant];
	return [TRIGGER_HALF_CLASSES, divider];
}
