import clsx from 'clsx';
import { useRef, type ComponentPropsWithRef } from 'react';

import { mergeRefs } from '#lib/merge_refs';
import type { ToolbarOrientation } from '#components/toolbar/toolbar_navigation';
import { useToolbarRovingFocus } from '#components/toolbar/use_toolbar_roving_focus';

const LAYOUT_CLASSES: Record<ToolbarOrientation, string> = {
	horizontal: 'flex items-center gap-1',
	vertical: 'flex flex-col items-stretch gap-1',
};

type ToolbarAccessibleName =
	| { 'aria-label': string; 'aria-labelledby'?: undefined }
	| { 'aria-labelledby': string; 'aria-label'?: undefined };

export type ToolbarProps = Omit<
	ComponentPropsWithRef<'div'>,
	'role' | 'aria-label' | 'aria-labelledby' | 'aria-orientation'
> & {
	orientation?: ToolbarOrientation;
	unstyled?: boolean;
} & ToolbarAccessibleName;

/**
 * A group of related controls with a single tab stop (WAI-ARIA toolbar).
 * Tab enters the toolbar on the last focused item (the first enabled one
 * initially); the arrow keys of the orientation (Left/Right horizontally,
 * Up/Down vertically) move focus between items and wrap at the ends, Home and
 * End jump to the first and last item, and disabled items are skipped. Arrow
 * keys are left alone inside text fields. Requires `aria-label` or
 * `aria-labelledby`.
 */
export function Toolbar(toolbarProps: Readonly<ToolbarProps>) {
	const {
		orientation = 'horizontal',
		unstyled = false,
		className,
		ref,
		onFocus,
		onKeyDown,
		...rest
	} = toolbarProps;
	const toolbarRef = useRef<HTMLDivElement>(null);
	const { handleFocus, handleKeyDown } = useToolbarRovingFocus(
		toolbarRef,
		orientation
	);

	return (
		<div
			{...rest}
			ref={mergeRefs(toolbarRef, ref)}
			role="toolbar"
			aria-orientation={orientation}
			className={clsx(!unstyled && LAYOUT_CLASSES[orientation], className)}
			onFocus={(event) => {
				handleFocus(event);
				onFocus?.(event);
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				handleKeyDown(event);
			}}
		/>
	);
}
