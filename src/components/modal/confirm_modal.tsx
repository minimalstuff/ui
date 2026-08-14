import clsx from 'clsx';
import { createCallable } from 'react-call';
import { type ReactNode, useState } from 'react';

import { surfaceError } from '#lib/surface_error';
import { type Radius } from '#components/shared/radius';
import { ModalShell } from '#components/modal/modal_shell';
import { Button, type ButtonColor } from '#components/button/button';
import { useDisableHotkeysWhileMounted } from '#hooks/use_disable_hotkeys_while_mounted/use_disable_hotkeys_while_mounted';

export type ConfirmModalColor = 'red' | 'blue' | 'green';

const CONFIRM_BUTTON_COLOR: Record<ConfirmModalColor, ButtonColor> = {
	red: 'danger',
	blue: 'primary',
	green: 'success',
};

const BADGE_ICON: Record<ConfirmModalColor, string> = {
	red: 'i-mdi-alert-circle',
	blue: 'i-mdi-help-circle',
	green: 'i-mdi-check-circle',
};

const BADGE_COLOR_CLASSES: Record<ConfirmModalColor, string> = {
	red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
	blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
	green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
};

function ConfirmModalTitle({
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

export interface ConfirmModalProps {
	title: ReactNode;
	children?: ReactNode;
	confirmLabel?: ReactNode;
	cancelLabel?: ReactNode;
	confirmColor?: ConfirmModalColor;
	radius?: Radius;
	onConfirm?: () => void | Promise<void>;
	onError?: (error: unknown) => void;
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
		radius,
		onConfirm,
		onError,
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
			} catch (error) {
				// The modal stays open so the user can retry or cancel.
				setIsConfirming(false);
				surfaceError(error, onError);
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
				title={<ConfirmModalTitle title={title} color={resolvedConfirmColor} />}
				size="sm"
				radius={radius}
				footer={
					<>
						<Button
							variant="outline"
							color="neutral"
							onClick={handleCancel}
							disabled={isDisabled}
							size="sm"
						>
							{resolvedCancelLabel}
						</Button>
						<Button
							color={CONFIRM_BUTTON_COLOR[resolvedConfirmColor]}
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
				{children}
			</ModalShell>
		);
	},
	EXIT_ANIMATION_DURATION_MS
);
