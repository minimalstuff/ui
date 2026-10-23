import { type ReactNode, type RefObject } from 'react';
import { createCallable } from 'react-call';

import {
	ModalShell,
	type ModalRole,
	type ModalSize,
	type ModalHeight,
} from '#components/modal/modal_shell';
import { MODAL_EXIT_DURATION_MS } from '#components/shared/animation';
import { type Radius } from '#components/shared/radius';
import { useDisableHotkeysWhileMounted } from '#hooks/use_disable_hotkeys_while_mounted/use_disable_hotkeys_while_mounted';

export type {
	ModalRole,
	ModalSize,
	ModalHeight,
} from '#components/modal/modal_shell';

type ModalRenderProp = ReactNode | ((close: () => void) => ReactNode);

export interface ModalProps {
	title?: ReactNode;
	children: ModalRenderProp;
	size?: ModalSize;
	/** `fixed` gives the dialog a stable height so it does not jump when content changes; the content area stops scrolling and a child with `flex-1 min-h-0 overflow-y-auto` scrolls on its own. */
	height?: ModalHeight;
	radius?: Radius;
	className?: string;
	dismissible?: boolean;
	closeLabel?: string;
	/** `alertdialog` for urgent messages that need a response (describes the dialog by its content); pair with `dismissible={false}` when it must not be dismissed. */
	role?: ModalRole;
	/** Wins over the first-tabbable rule for where focus lands on open; may point at an element in the content or in a `ModalFooter`. */
	initialFocusRef?: RefObject<HTMLElement | null>;
	/** Names the dialog when there is no `title`; ignored when `title` is set since the title labels it. */
	'aria-label'?: string;
}

function resolveRenderProp(
	prop: ModalRenderProp,
	close: () => void
): ReactNode {
	return typeof prop === 'function' ? prop(close) : prop;
}

export const Modal = createCallable<ModalProps, void>(
	({
		call,
		title,
		children,
		size,
		height,
		radius,
		className,
		dismissible,
		closeLabel,
		role,
		initialFocusRef,
		'aria-label': ariaLabel,
	}) => {
		useDisableHotkeysWhileMounted();

		const handleDismiss = () => call.end();

		return (
			<ModalShell
				isEnded={call.ended}
				onDismiss={handleDismiss}
				title={title}
				size={size}
				height={height}
				radius={radius}
				className={className}
				dismissible={dismissible}
				closeLabel={closeLabel}
				role={role}
				initialFocusRef={initialFocusRef}
				aria-label={ariaLabel}
			>
				{resolveRenderProp(children, handleDismiss)}
			</ModalShell>
		);
	},
	MODAL_EXIT_DURATION_MS
);
