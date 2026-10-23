import clsx from 'clsx';
import { type ReactNode } from 'react';

import type { ConfirmModalColor } from '#components/modal/confirm_modal';

const BADGE_ICON: Record<ConfirmModalColor, string> = {
	danger: 'i-mdi-alert-circle',
	primary: 'i-mdi-help-circle',
	success: 'i-mdi-check-circle',
};

const BADGE_COLOR_CLASSES: Record<ConfirmModalColor, string> = {
	danger: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
	primary: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
	success:
		'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
};

/** @internal the badge-and-title header of `ConfirmModal` — not part of the public API. */
export function ConfirmModalTitle({
	title,
	color,
}: {
	title: ReactNode;
	color: ConfirmModalColor;
}) {
	return (
		<div className="flex items-center gap-3">
			<span
				className={clsx(
					'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
					BADGE_COLOR_CLASSES[color]
				)}
				aria-hidden="true"
			>
				<span className={clsx(BADGE_ICON[color], 'h-5 w-5')} />
			</span>
			{title}
		</div>
	);
}
