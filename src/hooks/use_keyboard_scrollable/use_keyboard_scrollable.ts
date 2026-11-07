import type { RefCallback } from 'react';

import { useKeyboardScrollRegion } from '#components/modal/use_keyboard_scroll_region';
import { useWarnUnnamed } from '#components/shared/use_warn_unnamed';

const UNNAMED_GUIDANCE =
	'a scroll region needs an accessible name. Provide a non-empty `label` or `labelledBy`.';

/** A scroll region must be named, exactly once: by `label` or by `labelledBy`. */
export type UseKeyboardScrollableOptions =
	| { label: string; labelledBy?: never }
	| { labelledBy: string; label?: never };

export type KeyboardScrollableProps = {
	ref: RefCallback<HTMLElement>;
	tabIndex?: 0;
	role?: 'region';
	'aria-labelledby'?: string;
	'aria-label'?: string;
	'data-keyboard-scroll-region'?: true;
};

export type UseKeyboardScrollableReturn = {
	scrollableProps: KeyboardScrollableProps;
	/** Focus outline classes to add to the container's `className`; `undefined` when the container is not a tab stop. */
	focusClassName: string | undefined;
};

/**
 * Makes a scroll container reachable by keyboard. When the container overflows
 * and holds nothing tabbable, `scrollableProps` gives it a tab stop, a
 * `region` role and an accessible name, and `focusClassName` a visible focus
 * outline. Otherwise only the `ref` is returned. Re-evaluated on resize and on
 * content changes; a container mounted after the first render is observed too.
 *
 * To combine `scrollableProps.ref` with your own ref, use a ref callback that
 * calls both.
 *
 * @example
 * const { scrollableProps, focusClassName } = useKeyboardScrollable({
 *   label: 'Release notes',
 * })
 * return (
 *   <div {...scrollableProps} className={cn('h-64 overflow-y-auto', focusClassName)}>
 *     {content}
 *   </div>
 * )
 */
export function useKeyboardScrollable(
	options: Readonly<UseKeyboardScrollableOptions>
): UseKeyboardScrollableReturn {
	const { ref, scrollableProps, focusClassName } =
		useKeyboardScrollRegion(options);
	useWarnUnnamed(
		'useKeyboardScrollable',
		Boolean(options.label?.trim()) || Boolean(options.labelledBy?.trim()),
		UNNAMED_GUIDANCE
	);

	return { scrollableProps: { ref, ...scrollableProps }, focusClassName };
}
