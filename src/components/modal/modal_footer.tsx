import clsx from 'clsx';
import { type ReactNode } from 'react';

import { OVERLAY_BORDER } from '#components/shared/surface_tokens';

export interface ModalFooterProps {
	children: ReactNode;
	className?: string;
}

/**
 * Pinned footer region for a modal. Rendered as a direct child of `Modal`'s
 * `children` prop (alongside `ModalBody`) — `ModalShell` detects it and
 * places it outside the scrollable content instead of inside it, so it stays
 * visible regardless of body content height.
 */
export const ModalFooter = ({
	children,
	className,
}: Readonly<ModalFooterProps>) => (
	<div
		className={clsx(
			'flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0',
			OVERLAY_BORDER,
			className
		)}
	>
		{children}
	</div>
);
