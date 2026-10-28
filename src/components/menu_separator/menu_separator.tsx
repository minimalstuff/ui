import clsx from 'clsx';

import { OVERLAY_BORDER } from '#components/shared/surface_tokens';

export interface MenuSeparatorProps {
	unstyled?: boolean;
	className?: string;
}

/**
 * A divider between groups of `MenuItem`s inside a `Menu` or `ContextMenu`.
 * Carries `role="separator"` (never `menuitem`), so the surrounding menu's
 * arrow key navigation skips it: only focusable items take part.
 */
export const MenuSeparator = ({
	unstyled = false,
	className,
}: Readonly<MenuSeparatorProps>) => (
	<hr
		aria-orientation="horizontal"
		className={clsx(
			'w-full',
			!unstyled && ['my-1 border-0 border-t', OVERLAY_BORDER],
			className
		)}
	/>
);
