import clsx from 'clsx';
import { type ReactNode } from 'react';

import { IconButton } from '#components/icon_button/icon_button';
import { useLabels } from '#components/ui_provider/use_labels';

interface ModalHeaderProps {
	titleId: string;
	title: ReactNode;
	onDismiss: () => void;
	dismissible: boolean;
	closeLabel?: string;
	unstyled?: boolean;
}

/** @internal the title row (heading and close button) shared by `Modal` and `Drawer` — not part of the public API. */
export function ModalHeader({
	titleId,
	title,
	onDismiss,
	dismissible,
	closeLabel,
	unstyled = false,
}: Readonly<ModalHeaderProps>) {
	const labels = useLabels();
	const closeAriaLabel = closeLabel ?? labels.close;

	return (
		<div
			className={clsx(
				'flex items-center justify-between flex-shrink-0',
				!unstyled && 'gap-4 px-6 pt-5 pb-4'
			)}
		>
			<h2
				id={titleId}
				className={clsx(
					!unstyled &&
						'text-base font-medium tracking-tight text-gray-900 dark:text-gray-100'
				)}
			>
				{title}
			</h2>
			{dismissible && unstyled && (
				<IconButton
					icon="i-mdi-close"
					onClick={onDismiss}
					aria-label={closeAriaLabel}
					className="min-h-6 min-w-6"
					unstyled
				/>
			)}
			{dismissible && !unstyled && (
				<IconButton
					icon="i-mdi-close"
					onClick={onDismiss}
					aria-label={closeAriaLabel}
					variant="subtle"
					size="sm"
					radius="full"
					className="-mr-1"
				/>
			)}
		</div>
	);
}
