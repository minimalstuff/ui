import clsx from 'clsx';
import {
	type ReactNode,
	type RefObject,
	useEffect,
	useId,
	useState,
} from 'react';
import { createPortal } from 'react-dom';

import {
	INNER_EDGE_RADIUS_CLASSES,
	OFFSCREEN_CLASSES,
	ONSCREEN_CLASSES,
	SIDE_CLASSES,
	SIZE_CLASSES,
	type DrawerSide,
	type DrawerSize,
} from '#components/drawer/drawer_styles';
import { DismissGuardContext } from '#components/modal/dismiss_guard_context';
import { ModalFooterSlot } from '#components/modal/modal_footer_slot';
import { ModalFooterSlotContext } from '#components/modal/modal_footer_slot_context';
import { ModalHeader } from '#components/modal/modal_header';
import { useGuardedDismiss } from '#components/modal/use_guarded_dismiss';
import { useModalDialog } from '#components/modal/use_modal_dialog';
import { DRAWER_EXIT_DURATION_MS } from '#components/shared/animation';
import { type Radius } from '#components/shared/radius';
import {
	OVERLAY_BG,
	THIN_SCROLLBAR_SCOPE,
} from '#components/shared/surface_tokens';
import { useDisableHotkeysWhileMounted } from '#hooks/use_disable_hotkeys_while_mounted/use_disable_hotkeys_while_mounted';

export type { DrawerSide, DrawerSize } from '#components/drawer/drawer_styles';

export interface DrawerProps {
	isOpen: boolean;
	onClose: () => void;
	/** Names the dialog. */
	title: ReactNode;
	children: ReactNode;
	/** Pinned below the body; a `ModalFooter` inside `children` renders in the same place. */
	footer?: ReactNode;
	size?: DrawerSize;
	/** The edge of the viewport the panel is attached to. */
	side?: DrawerSide;
	/** Applied to the corners on the edge facing the page only. */
	radius?: Radius;
	/** Applied to the scrollable body. */
	className?: string;
	/** `false` hides the close button and blocks Escape and backdrop dismissal. */
	dismissible?: boolean;
	closeLabel?: string;
	/** Wins over the first-tabbable rule for where focus lands on open; may point at an element in the body or in the footer. */
	initialFocusRef?: RefObject<HTMLElement | null>;
}

type DrawerDialogProps = Omit<DrawerProps, 'isOpen' | 'onClose'> &
	Required<Pick<DrawerProps, 'size' | 'side' | 'radius' | 'dismissible'>> & {
		isEnded: boolean;
		onDismiss: () => void;
	};

function getMainElement(): HTMLElement | null {
	const main = document.querySelector('main');
	if (main && !main.hasAttribute('tabindex')) main.tabIndex = -1;
	return main;
}

function DrawerDialog({
	isEnded,
	onDismiss: onClose,
	title,
	children,
	footer,
	size,
	side,
	radius,
	className,
	dismissible,
	closeLabel,
	initialFocusRef,
}: Readonly<DrawerDialogProps>) {
	useDisableHotkeysWhileMounted();
	const titleId = useId();
	const { dismiss, registry } = useGuardedDismiss({
		onDismiss: onClose,
		isEnded,
	});
	const {
		dialogRef,
		contentRef,
		footerSlot,
		setFooterSlot,
		isVisible,
		handleBackdropClick,
		handleBackdropMouseDown,
	} = useModalDialog({
		isEnded,
		onDismiss: dismiss,
		dismissible,
		initialFocusRef,
		initialFocusFallbackScope: 'content',
		getFocusFallback: getMainElement,
	});

	return (
		<DismissGuardContext.Provider value={registry}>
			{createPortal(
				<div
					className={clsx(
						'fixed inset-0 z-50',
						'transition-opacity duration-200 ease-out',
						isVisible ? 'opacity-100' : 'opacity-0'
					)}
					onClick={handleBackdropClick}
					onMouseDown={handleBackdropMouseDown}
				>
					<div
						className="fixed inset-0 bg-black/60 backdrop-blur-md"
						aria-hidden="true"
					/>
					<div
						ref={dialogRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby={titleId}
						tabIndex={-1}
						inert={isEnded}
						className={clsx(
							'fixed inset-y-0 h-full w-full flex flex-col overflow-hidden',
							SIDE_CLASSES[side],
							SIZE_CLASSES[size],
							OVERLAY_BG,
							THIN_SCROLLBAR_SCOPE,
							'shadow-2xl',
							INNER_EDGE_RADIUS_CLASSES[side][radius],
							'transition-transform duration-200 ease-out motion-reduce:transition-none',
							'focus:outline-none',
							isVisible ? ONSCREEN_CLASSES : OFFSCREEN_CLASSES[side]
						)}
						onClick={(event) => event.stopPropagation()}
					>
						<ModalHeader
							titleId={titleId}
							title={title}
							onDismiss={dismiss}
							dismissible={dismissible}
							closeLabel={closeLabel}
						/>
						<div
							ref={contentRef}
							className={clsx(
								'flex-1 overflow-y-auto min-h-0 px-6 pb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400',
								className
							)}
						>
							<ModalFooterSlotContext.Provider value={footerSlot}>
								{children}
							</ModalFooterSlotContext.Provider>
						</div>
						<ModalFooterSlot onSlotChange={setFooterSlot}>
							{footer}
						</ModalFooterSlot>
					</div>
				</div>,
				document.body
			)}
		</DismissGuardContext.Provider>
	);
}

/**
 * Whether the dialog should stay mounted: while open, and for the exit
 * duration after `isOpen` turns `false` so the panel can slide out.
 * Reopening during that window cancels the unmount.
 */
function useIsMounted(isOpen: boolean): boolean {
	const [hasExited, setHasExited] = useState(!isOpen);

	if (isOpen && hasExited) setHasExited(false);

	useEffect(() => {
		if (isOpen) return;
		const timerId = setTimeout(
			() => setHasExited(true),
			DRAWER_EXIT_DURATION_MS
		);
		return () => clearTimeout(timerId);
	}, [isOpen]);

	return isOpen || !hasExited;
}

/** A modal side panel with the same focus handling, stacking and footer slot as `Modal`. */
export function Drawer({
	isOpen,
	onClose,
	size = 'md',
	side = 'right',
	radius = 'none',
	dismissible = true,
	...dialogProps
}: Readonly<DrawerProps>) {
	const isMounted = useIsMounted(isOpen);

	if (!isMounted) return null;

	return (
		<DrawerDialog
			{...dialogProps}
			isEnded={!isOpen}
			onDismiss={onClose}
			size={size}
			side={side}
			radius={radius}
			dismissible={dismissible}
		/>
	);
}
