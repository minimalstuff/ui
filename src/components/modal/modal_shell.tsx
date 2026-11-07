import clsx from 'clsx';
import { type ReactNode, type RefObject, useId } from 'react';
import { createPortal } from 'react-dom';

import { ModalFooterSlot } from '#components/modal/modal_footer_slot';
import { ModalFooterSlotContext } from '#components/modal/modal_footer_slot_context';
import { ModalHeader } from '#components/modal/modal_header';
import {
	MODAL_SHEET_RADIUS_CLASSES,
	MODAL_SHEET_SIZE_CLASSES,
} from '#components/modal/modal_sheet_classes';
import { useKeyboardScrollable } from '#components/modal/use_keyboard_scrollable';
import { useModalDialog } from '#components/modal/use_modal_dialog';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	OVERLAY_BG,
	THIN_SCROLLBAR_SCOPE,
} from '#components/shared/surface_tokens';
import { useWarnUnnamed } from '#components/shared/use_warn_unnamed';

const MODAL_UNNAMED_GUIDANCE =
	'a dialog needs an accessible name. Provide a non-empty `title` or `aria-label` prop.';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export type ModalHeight = 'auto' | 'fixed';

export type ModalPhoneLayout = 'center' | 'sheet';

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
	/** `sheet` turns the dialog into a bottom sheet below the `sm` breakpoint (full width, flush with the bottom edge, only the top corners rounded, at most 85svh tall, bottom padding clearing the safe area, sliding up on open and down on close; plain fade under reduced motion). From `sm` up it renders as `center`. With `height="fixed"` the sheet is 85svh tall on phones. `unstyled` keeps the sheet position and size but drops radius and the slide. */
	phoneLayout?: ModalPhoneLayout;
	radius?: Radius;
	className?: string;
	/** Applied to the `role=dialog` element. A `transform`, `filter` or `backdrop-filter` on the open panel makes it the containing block of `position: fixed` descendants, so Menus opened inside it get clipped. Keep these off the open state. Carries `data-state="open"` or `"closed"`, so `data-[state=closed]:` variants can animate it. Put your own transitions behind `motion-reduce:` variants, since `unstyled` drops the library's reduced-motion handling along with its animations. */
	panelClassName?: string;
	/** Applied to the backdrop element, which carries the click-to-dismiss. */
	backdropClassName?: string;
	/** Strips the library's visual styling (background, shadow, radius, transitions, backdrop tint, header and content typography and padding), keeping layout, sizing, scrolling and behaviour. `radius` is ignored. The close button keeps a 24px minimum target size. */
	unstyled?: boolean;
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
	fixed: 'ms-modal-height-fixed',
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
	phoneLayout = 'center',
	radius = 'xl',
	className,
	panelClassName,
	backdropClassName,
	unstyled = false,
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

	useWarnUnnamed(
		'Modal',
		Boolean(title) || Boolean(ariaLabel?.trim()),
		MODAL_UNNAMED_GUIDANCE
	);
	const { focusClassName, ...scrollableProps } = useKeyboardScrollable(
		contentRef,
		{ labelledBy: title ? titleId : undefined, label: ariaLabel }
	);
	const isAutoHeight = height === 'auto';
	const isSheet = phoneLayout === 'sheet';

	const hasDescribedByContent = role === 'alertdialog' && Boolean(children);

	return createPortal(
		<div
			className={clsx(
				'fixed inset-0 z-50 flex justify-center',
				isSheet
					? 'ms-modal-sheet-backdrop'
					: 'items-start ms-modal-backdrop-padding',
				!unstyled && 'transition-opacity duration-200 ease-out',
				isVisible ? 'opacity-100' : 'opacity-0'
			)}
			onClick={handleBackdropClick}
			onMouseDown={handleBackdropMouseDown}
		>
			<div
				className={clsx(
					'fixed inset-0',
					!unstyled && [
						'bg-black/60 backdrop-blur-md',
						'transition-opacity duration-200 ease-out',
						isVisible ? 'opacity-100' : 'opacity-0',
					],
					backdropClassName
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
				data-state={isVisible ? 'open' : 'closed'}
				className={clsx(
					'relative w-full',
					isSheet ? MODAL_SHEET_SIZE_CLASSES[size] : SIZE_CLASSES[size],
					HEIGHT_CLASSES[height],
					isSheet && 'ms-modal-sheet-panel',
					isSheet && height === 'fixed' && 'ms-modal-sheet-height-fixed',
					'ms-modal-max-height overflow-hidden flex flex-col',
					'focus:outline-none',
					!unstyled && [
						OVERLAY_BG,
						THIN_SCROLLBAR_SCOPE,
						'shadow-2xl',
						isSheet
							? MODAL_SHEET_RADIUS_CLASSES[radius]
							: RADIUS_CLASSES[radius],
						'transition-all duration-200 ease-out',
						isVisible
							? 'opacity-100'
							: isSheet
								? 'ms-modal-sheet-closed'
								: 'ms-modal-panel-closed',
					],
					panelClassName
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
						unstyled={unstyled}
					/>
				)}
				<div
					ref={contentRef}
					id={hasDescribedByContent ? contentId : undefined}
					{...(isAutoHeight ? scrollableProps : undefined)}
					className={clsx(
						'flex-1 min-h-0',
						!unstyled &&
							'px-6 pb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400',
						CONTENT_OVERFLOW_CLASSES[height],
						!unstyled && !title && 'pt-6',
						isAutoHeight && focusClassName,
						className
					)}
				>
					<ModalFooterSlotContext.Provider value={footerSlot}>
						{children}
					</ModalFooterSlotContext.Provider>
				</div>
				<ModalFooterSlot onSlotChange={setFooterSlot} unstyled={unstyled}>
					{footer}
				</ModalFooterSlot>
			</div>
		</div>,
		document.body
	);
}
