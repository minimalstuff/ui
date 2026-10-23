import { type ReactNode, useRef, useState } from 'react';
import { createCallable } from 'react-call';

import { Button, type ButtonColor } from '#components/button/button';
import { ConfirmModalTitle } from '#components/modal/confirm_modal_title';
import { ModalShell } from '#components/modal/modal_shell';
import { MODAL_EXIT_DURATION_MS } from '#components/shared/animation';
import { type Radius } from '#components/shared/radius';
import { useLabels } from '#components/ui_provider/use_labels';
import { useDisableHotkeysWhileMounted } from '#hooks/use_disable_hotkeys_while_mounted/use_disable_hotkeys_while_mounted';
import { surfaceError } from '#lib/surface_error';

export type ConfirmModalColor = Extract<
	ButtonColor,
	'primary' | 'danger' | 'success'
>;

export interface ConfirmModalProps {
	title: ReactNode;
	children?: ReactNode;
	confirmLabel?: ReactNode;
	cancelLabel?: ReactNode;
	confirmColor?: ConfirmModalColor;
	radius?: Radius;
	closeLabel?: string;
	onConfirm?: () => void | Promise<void>;
	onError?: (error: unknown) => void;
}

export type ConfirmModalResponse = boolean;

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
		radius,
		closeLabel,
		onConfirm,
		onError,
	}) => {
		useDisableHotkeysWhileMounted();
		const [isConfirming, setIsConfirming] = useState(false);
		const cancelButtonRef = useRef<HTMLButtonElement>(null);

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
			} catch (error) {
				// The modal stays open so the user can retry or cancel.
				setIsConfirming(false);
				surfaceError(error, onError);
			}
		};

		const labels = useLabels();
		const resolvedConfirmLabel = confirmLabel ?? labels.confirm;
		const resolvedCancelLabel = cancelLabel ?? labels.cancel;
		const resolvedConfirmColor = confirmColor ?? 'primary';

		return (
			<ModalShell
				isEnded={call.ended}
				onDismiss={handleCancel}
				title={<ConfirmModalTitle title={title} color={resolvedConfirmColor} />}
				size="sm"
				radius={radius}
				closeLabel={closeLabel}
				role="alertdialog"
				initialFocusRef={cancelButtonRef}
				footer={
					<>
						<Button
							ref={cancelButtonRef}
							variant="outline"
							color="neutral"
							onClick={handleCancel}
							disabled={isConfirming}
							size="sm"
						>
							{resolvedCancelLabel}
						</Button>
						<Button
							color={resolvedConfirmColor}
							onClick={() => {
								void handleConfirm();
							}}
							loading={isConfirming}
							size="sm"
						>
							{resolvedConfirmLabel}
						</Button>
					</>
				}
			>
				{children}
			</ModalShell>
		);
	},
	MODAL_EXIT_DURATION_MS
);
