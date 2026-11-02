import clsx from 'clsx';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { OVERLAY_BG, SURFACE_BORDER } from '#components/shared/surface_tokens';

const BAR_CLASSES = clsx(
	'grid min-h-8 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b text-xs',
	'pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]',
	'text-gray-700 dark:text-gray-300',
	OVERLAY_BG,
	SURFACE_BORDER
);

export type AppBarProps = Omit<ComponentPropsWithRef<'header'>, 'title'> & {
	start?: ReactNode;
	title?: ReactNode;
	end?: ReactNode;
	startClassName?: string;
	titleClassName?: string;
	endClassName?: string;
	unstyled?: boolean;
};

/**
 * A thin application bar with a `start` slot on the left, a centered `title`
 * and an `end` slot on the right. It is a plain `<header>` (the `banner`
 * landmark when it is not nested in another sectioning element), not a
 * WAI-ARIA toolbar: put your own links and buttons in the slots, or use
 * `Toolbar` for a group of controls with arrow-key navigation. Its minimum
 * height grows with enlarged text and its horizontal padding honours the
 * device safe area.
 */
export function AppBar(appBarProps: Readonly<AppBarProps>) {
	const {
		start,
		title,
		end,
		startClassName,
		titleClassName,
		endClassName,
		unstyled = false,
		className,
		...rest
	} = appBarProps;

	return (
		<header {...rest} className={clsx(!unstyled && BAR_CLASSES, className)}>
			<div
				className={clsx(
					'flex min-w-0 items-center justify-start',
					startClassName
				)}
			>
				{start}
			</div>
			<div className={clsx('min-w-0 truncate text-center', titleClassName)}>
				{title}
			</div>
			<div
				className={clsx('flex min-w-0 items-center justify-end', endClassName)}
			>
				{end}
			</div>
		</header>
	);
}
