import clsx from 'clsx';
import type { ReactNode } from 'react';

export interface MenuItemEndProps {
	trailing?: ReactNode;
	selected?: boolean;
}

/**
 * Everything pinned to the end of a row. It exists as one element because
 * `ml-auto` is how the pinning happens, and flexbox splits the free space
 * *evenly* between every auto margin on the axis: two of them in the same
 * row leaves each half the gap, scattering the end content instead of
 * grouping it.
 */
export function MenuItemEnd({
	trailing,
	selected,
}: Readonly<MenuItemEndProps>) {
	const isOption = selected !== undefined;
	if (!trailing && !isOption) return null;

	return (
		<span className="ml-auto flex flex-shrink-0 items-center gap-2 pl-2">
			{trailing && (
				// Dimmed, but not below AA: gray-400 sits at 2.5:1 on white.
				<span className="text-xs text-gray-500 dark:text-gray-400">
					{trailing}
				</span>
			)}
			{isOption && (
				// Rendered either way so picking another option doesn't reflow the
				// row it left behind.
				<span
					className={clsx('i-mdi-check h-4 w-4', !selected && 'invisible')}
					aria-hidden="true"
				/>
			)}
		</span>
	);
}
