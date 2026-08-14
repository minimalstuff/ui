import { type ReactNode } from 'react';
import { createCallable } from 'react-call';

import { type Radius } from '#components/shared/radius';
import { MODAL_EXIT_DURATION_MS } from '#components/shared/animation';
import { ModalShell, type ModalSize } from '#components/modal/modal_shell';
import { useDisableHotkeysWhileMounted } from '#hooks/use_disable_hotkeys_while_mounted/use_disable_hotkeys_while_mounted';

export type { ModalSize } from '#components/modal/modal_shell';

type ModalRenderProp = ReactNode | ((close: () => void) => ReactNode);

export interface ModalProps {
	title?: ReactNode;
	children: ModalRenderProp;
	footer?: ModalRenderProp;
	size?: ModalSize;
	radius?: Radius;
	className?: string;
	dismissible?: boolean;
}

function resolveRenderProp(
	prop: ModalRenderProp,
	close: () => void
): ReactNode {
	return typeof prop === 'function' ? prop(close) : prop;
}

export const Modal = createCallable<ModalProps, void>(
	({ call, title, children, footer, size, radius, className, dismissible }) => {
		useDisableHotkeysWhileMounted();

		const handleDismiss = () => call.end();

		return (
			<ModalShell
				isEnded={call.ended}
				onDismiss={handleDismiss}
				title={title}
				footer={resolveRenderProp(footer, handleDismiss)}
				size={size}
				radius={radius}
				className={className}
				dismissible={dismissible}
			>
				{resolveRenderProp(children, handleDismiss)}
			</ModalShell>
		);
	},
	MODAL_EXIT_DURATION_MS
);
