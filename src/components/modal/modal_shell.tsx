import clsx from 'clsx';
import { type ReactNode, type RefObject, useId } from 'react';
import { createPortal } from 'react-dom';

import { ModalFooterSlot } from '#components/modal/modal_footer_slot';
import { ModalFooterSlotContext } from '#components/modal/modal_footer_slot_context';
import { ModalHeader } from '#components/modal/modal_header';
import { useModalDialog } from '#components/modal/use_modal_dialog';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	OVERLAY_BG,
	THIN_SCROLLBAR_SCOPE,
} from '#components/shared/surface_tokens';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export type ModalHeight = 'auto' | 'fixed';

export type ModalRole = 'dialog' | 'alertdialog';

interface ModalShellProps {
	isEnded: boolean;
	onDismiss: () => void;
	title?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	size?: ModalSize;
	/** `auto` sizes the dialog to its content up to the viewport; `fixed` gives it a stable height and leaves scrolling to the content, so a child with `flex-1 min-h-0 overflow-y-auto` scrolls on its own between the pinned header and footer. */
	height?: ModalHeight;
	radius?: Radius;
	className?: string;
	dismissible?: boolean;
	closeLabel?: string;
	/** `alertdialog` is described by its body content, so this sets `aria-describedby` to the content wrapper's id when there are children. */
	role?: ModalRole;
	/** Wins over the first-tabbable rule for where focus lands on open, once it holds an element. */
	initialFocusRef?: RefObject<HTMLElement | null>;
	/** Names the dialog when there is no `title`; ignored when `title` is set since the title labels it. */
	'aria-label'?: string;
}

const SIZE_CLASSES = {
	sm: 'max-w-md',
	md: 'max-w-lg',
	lg: 'max-w-2xl',
	xl: 'max-w-4xl',
} as const;

const HEIGHT_CLASSES = {
	auto: '',
	fixed: 'h-[calc(100vh-4rem)] sm:h-[min(40rem,calc(100vh-10rem))]',
} as const;

const CONTENT_OVERFLOW_CLASSES = {
	auto: 'overflow-y-auto',
	fixed: 'overflow-hidden flex flex-col',
} as const;

export function ModalShell({
	isEnded,
	onDismiss,
	title,
	children,
	footer,
	size = 'md',
	height = 'auto',
	radius = 'xl',
	className,
	dismissible = true,
	closeLabel,
	role = 'dialog',
	initialFocusRef,
	'aria-label': ariaLabel,
}: Readonly<ModalShellProps>) {
	const titleId = useId();
	const contentId = useId();
	const {
		dialogRef,
		contentRef,
		footerSlot,
		setFooterSlot,
		isVisible,
		handleBackdropClick,
		handleBackdropMouseDown,
	} = useModalDialog({ isEnded, onDismiss, dismissible, initialFocusRef });

	const hasDescribedByContent = role === 'alertdialog' && Boolean(children);

	return createPortal(
		<div
			className={clsx(
				'fixed inset-0 z-50 flex items-start justify-center',
				'p-2 sm:py-[3rem] lg:py-[5rem]',
				'transition-opacity duration-200 ease-out',
				isVisible ? 'opacity-100' : 'opacity-0'
			)}
			onClick={handleBackdropClick}
			onMouseDown={handleBackdropMouseDown}
		>
			<div
				className={clsx(
					'fixed inset-0 bg-black/60 backdrop-blur-md',
					'transition-opacity duration-200 ease-out',
					isVisible ? 'opacity-100' : 'opacity-0'
				)}
				aria-hidden="true"
			/>
			<div
				ref={dialogRef}
				role={role}
				aria-modal="true"
				aria-labelledby={title ? titleId : undefined}
				aria-label={title ? undefined : ariaLabel}
				aria-describedby={hasDescribedByContent ? contentId : undefined}
				tabIndex={-1}
				className={clsx(
					'relative w-full',
					SIZE_CLASSES[size],
					HEIGHT_CLASSES[height],
					OVERLAY_BG,
					THIN_SCROLLBAR_SCOPE,
					'shadow-2xl',
					RADIUS_CLASSES[radius],
					'max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-10rem)] overflow-hidden flex flex-col',
					'transition-all duration-200 ease-out',
					'focus:outline-none',
					isVisible
						? 'opacity-100 scale-100 translate-y-0'
						: 'opacity-0 scale-95 translate-y-1'
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{title && (
					<ModalHeader
						titleId={titleId}
						title={title}
						onDismiss={onDismiss}
						dismissible={dismissible}
						closeLabel={closeLabel}
					/>
				)}
				<div
					ref={contentRef}
					id={hasDescribedByContent ? contentId : undefined}
					className={clsx(
						'flex-1 px-6 pb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400 min-h-0',
						CONTENT_OVERFLOW_CLASSES[height],
						!title && 'pt-6',
						className
					)}
				>
					<ModalFooterSlotContext.Provider value={footerSlot}>
						{children}
					</ModalFooterSlotContext.Provider>
				</div>
				<ModalFooterSlot onSlotChange={setFooterSlot}>{footer}</ModalFooterSlot>
			</div>
		</div>,
		document.body
	);
}
