import { type ReactNode } from 'react';
import { createCallable } from 'react-call';

import { type Radius } from '#components/shared/radius';
import { ModalShell, type ModalSize } from '#components/modal/modal_shell';
import { useDisableHotkeysWhileMounted } from '#hooks/use_disable_hotkeys_while_mounted/use_disable_hotkeys_while_mounted';

export type { ModalSize } from '#components/modal/modal_shell';

export interface ModalProps {
	title?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	size?: ModalSize;
	radius?: Radius;
	className?: string;
}

const EXIT_ANIMATION_DURATION_MS = 200;

export const Modal = createCallable<ModalProps, void>(
	({ call, title, children, footer, size, radius, className }) => {
		useDisableHotkeysWhileMounted();

		const handleDismiss = () => call.end();

		return (
			<ModalShell
				isEnded={call.ended}
				onDismiss={handleDismiss}
				title={title}
				footer={footer}
				size={size}
				radius={radius}
				className={className}
			>
				{children}
			</ModalShell>
		);
	},
	EXIT_ANIMATION_DURATION_MS
);
