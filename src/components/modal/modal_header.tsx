import { type ReactNode } from 'react';

import { IconButton } from '#components/icon_button/icon_button';
import { useLabels } from '#components/ui_provider/use_labels';

interface ModalHeaderProps {
	titleId: string;
	title: ReactNode;
	onDismiss: () => void;
	dismissible: boolean;
	closeLabel?: string;
}

/** @internal the title row (heading and close button) shared by `Modal` and `Drawer` — not part of the public API. */
export function ModalHeader({
	titleId,
	title,
	onDismiss,
	dismissible,
	closeLabel,
}: Readonly<ModalHeaderProps>) {
	const labels = useLabels();

	return (
		<div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 flex-shrink-0">
			<h2
				id={titleId}
				className="text-base font-medium tracking-tight text-gray-900 dark:text-gray-100"
			>
				{title}
			</h2>
			{dismissible && (
				<IconButton
					icon="i-mdi-close"
					onClick={onDismiss}
					aria-label={closeLabel ?? labels.close}
					variant="subtle"
					size="sm"
					radius="full"
					className="-mr-1"
				/>
			)}
		</div>
	);
}
