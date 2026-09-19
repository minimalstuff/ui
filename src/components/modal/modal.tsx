import { createCallable } from 'react-call';
import { createContext, type ReactNode, useState } from 'react';

import { type Radius } from '#components/shared/radius';
import { MODAL_EXIT_DURATION_MS } from '#components/shared/animation';
import { ModalShell, type ModalSize } from '#components/modal/modal_shell';
import { useDisableHotkeysWhileMounted } from '#hooks/use_disable_hotkeys_while_mounted/use_disable_hotkeys_while_mounted';

export type { ModalSize } from '#components/modal/modal_shell';

type ModalRenderProp = ReactNode | ((close: () => void) => ReactNode);

export interface ModalProps {
	title?: ReactNode;
	children: ModalRenderProp;
	size?: ModalSize;
	radius?: Radius;
	className?: string;
	dismissible?: boolean;
	closeLabel?: string;
	/** Names the dialog when there is no `title`; ignored when `title` is set since the title labels it. */
	'aria-label'?: string;
}

function resolveRenderProp(
	prop: ModalRenderProp,
	close: () => void
): ReactNode {
	return typeof prop === 'function' ? prop(close) : prop;
}

/** @internal set by `<ModalFooter>`, read by `Modal` — not part of the public API. */
export const ModalFooterSetterContext = createContext<
	((footer: ReactNode) => void) | null
>(null);

export const Modal = createCallable<ModalProps, void>(
	({
		call,
		title,
		children,
		size,
		radius,
		className,
		dismissible,
		closeLabel,
		'aria-label': ariaLabel,
	}) => {
		useDisableHotkeysWhileMounted();
		const [footer, setFooter] = useState<ReactNode>(null);

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
				dismissible={dismissible}
				closeLabel={closeLabel}
				aria-label={ariaLabel}
			>
				<ModalFooterSetterContext.Provider value={setFooter}>
					{resolveRenderProp(children, handleDismiss)}
				</ModalFooterSetterContext.Provider>
			</ModalShell>
		);
	},
	MODAL_EXIT_DURATION_MS
);
