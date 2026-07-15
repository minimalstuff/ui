import { createCallable } from 'react-call';
import { type ReactNode, useState } from 'react';

import { Button } from '#components/button/button';
import { ModalShell } from '#components/modal/modal_shell';
import { useDisableHotkeysWhileMounted } from '#hooks/use_disable_hotkeys_while_mounted/use_disable_hotkeys_while_mounted';

export type ConfirmModalColor = 'red' | 'blue' | 'green';

export interface ConfirmModalProps {
	title: ReactNode;
	children?: ReactNode;
	confirmLabel?: ReactNode;
	cancelLabel?: ReactNode;
	confirmColor?: ConfirmModalColor;
	onConfirm?: () => void | Promise<void>;
}

export type ConfirmModalResponse = boolean;

const EXIT_ANIMATION_DURATION_MS = 200;

export const ConfirmModal = createCallable<
	ConfirmModalProps,
	ConfirmModalResponse
>(
	({
		call,
		title,
		children,
		confirmLabel,
		cancelLabel,
		confirmColor,
		onConfirm,
	}) => {
		useDisableHotkeysWhileMounted();
		const [isConfirming, setIsConfirming] = useState(false);

		const handleCancel = () => call.end(false);

		const handleConfirm = async () => {
			if (!onConfirm) {
				call.end(true);
				return;
			}

			setIsConfirming(true);
			try {
				await onConfirm();
				call.end(true);
			} finally {
				setIsConfirming(false);
			}
		};

		const isDisabled = isConfirming;
		const resolvedConfirmLabel = confirmLabel ?? 'Confirm';
		const resolvedCancelLabel = cancelLabel ?? 'Cancel';
		const resolvedConfirmColor = confirmColor ?? 'blue';

		return (
			<ModalShell
				isEnded={call.ended}
				onDismiss={handleCancel}
				title={title}
				size="sm"
				footer={
					<>
						<Button
							variant="secondary"
							onClick={handleCancel}
							disabled={isDisabled}
							size="sm"
						>
							{resolvedCancelLabel}
						</Button>
						<Button
							variant={resolvedConfirmColor === 'red' ? 'danger' : 'primary'}
							onClick={() => {
								void handleConfirm();
							}}
							loading={isDisabled}
							disabled={isDisabled}
							size="sm"
						>
							{resolvedConfirmLabel}
						</Button>
					</>
				}
			>
				{children && (
					<div className="text-sm text-gray-600 dark:text-gray-300">
						{children}
					</div>
				)}
			</ModalShell>
		);
	},
	EXIT_ANIMATION_DURATION_MS
);
