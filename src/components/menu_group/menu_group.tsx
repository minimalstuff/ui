import clsx from 'clsx';
import { useId, type ReactNode } from 'react';

export interface MenuGroupProps {
	label: ReactNode;
	children: ReactNode;
	unstyled?: boolean;
	className?: string;
}

/**
 * A named group of `MenuItem`s inside a `Menu` or `ContextMenu`. Where
 * `MenuSeparator` cuts, this one names — and unlike a bare title sitting
 * next to the items, `role="group"` plus `aria-labelledby` actually tells
 * assistive tech which items the name covers.
 *
 * Wrapping items is safe: the enclosing menu collects `[role="menuitem"]`
 * across all its descendants, so keyboard navigation still walks into the
 * group, and close-on-select travels through React context rather than the
 * DOM tree.
 */
export function MenuGroup({
	label,
	children,
	unstyled = false,
	className,
}: Readonly<MenuGroupProps>) {
	const labelId = useId();

	return (
		<div role="group" aria-labelledby={labelId}>
			<div
				id={labelId}
				role="presentation"
				className={clsx(
					!unstyled &&
						'px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400',
					className
				)}
			>
				{label}
			</div>
			{children}
		</div>
	);
}
