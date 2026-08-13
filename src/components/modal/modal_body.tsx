import clsx from 'clsx';
import { type ReactNode } from 'react';

interface ModalBodyProps {
	children: ReactNode;
	className?: string;
}

/**
 * Scrollable content region for a modal. Pair with `ModalFooter` as direct
 * children of `Modal`'s `children` prop to get a footer pinned outside the
 * scroll area — `ModalShell` detects the pairing and skips its own default
 * padded/scrolling wrapper. Used alone (no `ModalFooter` sibling), it has no
 * effect: `ModalShell` still applies its default wrapper around it.
 */
export const ModalBody = ({
	children,
	className,
}: Readonly<ModalBodyProps>) => (
	<div
		className={clsx(
			'flex-1 overflow-y-auto px-6 pb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400 min-h-0',
			className
		)}
	>
		{children}
	</div>
);
