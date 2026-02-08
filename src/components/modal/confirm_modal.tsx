import { Button } from '#components/button/button';
import { Modal } from '#components/modal/modal';
import { type ReactNode, useState } from 'react';

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void | Promise<void>;
	title: ReactNode;
	children?: ReactNode;
	confirmLabel?: ReactNode;
	cancelLabel?: ReactNode;
	confirmColor?: 'red' | 'blue' | 'green';
	loading?: boolean;
}

export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	children,
	confirmLabel: propConfirmLabel,
	cancelLabel: propCancelLabel,
	confirmColor: propConfirmColor,
	loading = false,
}: ConfirmModalProps) {
	const [isConfirming, setIsConfirming] = useState(false);

	const handleConfirm = async () => {
		setIsConfirming(true);
		try {
			await onConfirm();
		} finally {
			setIsConfirming(false);
		}
	};

	const isDisabled = loading || isConfirming;

	const confirmLabel = propConfirmLabel ?? 'Confirm';
	const cancelLabel = propCancelLabel ?? 'Cancel';
	const confirmColor = propConfirmColor ?? 'blue';
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			size="sm"
			footer={
				<>
					<Button
						variant="secondary"
						onClick={onClose}
						disabled={isDisabled}
						size="sm"
					>
						{cancelLabel}
					</Button>
					<Button
						variant={confirmColor === 'red' ? 'danger' : 'primary'}
						onClick={handleConfirm}
						loading={isDisabled}
						disabled={isDisabled}
						size="sm"
					>
						{confirmLabel}
					</Button>
				</>
			}
		>
			{children && (
				<div className="text-sm text-gray-600 dark:text-gray-300">
					{children}
				</div>
			)}
		</Modal>
	);
}
