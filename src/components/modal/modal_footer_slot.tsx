import clsx from 'clsx';
import { type ReactNode } from 'react';

import { OVERLAY_BORDER } from '#components/shared/surface_tokens';

interface ModalFooterSlotProps {
	onSlotChange: (element: HTMLDivElement | null) => void;
	children?: ReactNode;
	unstyled?: boolean;
}

/** @internal the pinned footer element shared by `Modal` and `Drawer`, which `<ModalFooter>` portals into — not part of the public API. */
export function ModalFooterSlot({
	onSlotChange,
	children,
	unstyled = false,
}: Readonly<ModalFooterSlotProps>) {
	return (
		<div
			ref={onSlotChange}
			className={clsx(
				'flex items-center justify-end flex-shrink-0 empty:hidden',
				!unstyled && ['gap-3 px-6 py-4 border-t', OVERLAY_BORDER]
			)}
		>
			{children}
		</div>
	);
}
