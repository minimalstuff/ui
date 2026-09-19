import clsx from 'clsx';
import { createPortal } from 'react-dom';
import {
	type ReactNode,
	type RefObject,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react';

import { IconButton } from '#components/icon_button/icon_button';
import { getTabbableElements } from '#components/shared/tabbable';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { isTopmostModal, registerModal } from '#components/modal/modal_stack';
import { OVERLAY_BG, OVERLAY_BORDER } from '#components/shared/surface_tokens';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

type ModalRole = 'dialog' | 'alertdialog';

interface ModalShellProps {
	isEnded: boolean;
	onDismiss: () => void;
	title?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	size?: ModalSize;
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

export function ModalShell({
	isEnded,
	onDismiss,
	title,
	children,
	footer,
	size = 'md',
	radius = 'xl',
	className,
	dismissible = true,
	closeLabel = 'Close',
	role = 'dialog',
	initialFocusRef,
	'aria-label': ariaLabel,
}: Readonly<ModalShellProps>) {
	const [isOpening, setIsOpening] = useState(false);
	const [modalToken] = useState(() => Symbol('modal'));
	const dialogRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);
	const titleId = useId();
	const contentId = useId();

	useEffect(() => {
		if (isEnded) return;
		return registerModal(modalToken);
	}, [isEnded, modalToken]);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

		const dialog = dialogRef.current;
		const firstFocusable =
			(contentRef.current && getTabbableElements(contentRef.current)[0]) ??
			(dialog && getTabbableElements(dialog)[0]);
		(initialFocusRef?.current ?? firstFocusable ?? dialog)?.focus();

		const frameId = requestAnimationFrame(() => {
			requestAnimationFrame(() => setIsOpening(true));
		});

		return () => {
			cancelAnimationFrame(frameId);
			document.body.style.overflow = '';
		};
		// oxlint-disable-next-line react-hooks/exhaustive-deps -- initial focus is only computed once, on mount; a later change to initialFocusRef shouldn't re-run it
	}, []);

	useEffect(() => {
		if (isEnded) previouslyFocusedRef.current?.focus();
	}, [isEnded]);

	useEffect(() => {
		if (isEnded) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isTopmostModal(modalToken)) return;

			if (event.key === 'Escape') {
				if (event.defaultPrevented) return;
				event.preventDefault();
				if (dismissible) onDismiss();
				return;
			}
			if (event.key !== 'Tab') return;

			const dialog = dialogRef.current;
			if (!dialog) return;

			const tabbable = getTabbableElements(dialog);
			if (tabbable.length === 0) {
				event.preventDefault();
				dialog.focus();
				return;
			}

			const first = tabbable[0];
			const last = tabbable[tabbable.length - 1];
			const activeElement = document.activeElement;
			const activeIndex =
				activeElement instanceof HTMLElement
					? tabbable.indexOf(activeElement)
					: -1;

			// Not (any longer) one of the dialog's tabbable elements — e.g. focus
			// is outside the dialog, or it sat on a control that just became
			// disabled. Either way, put it back inside the trap.
			if (activeIndex === -1) {
				event.preventDefault();
				(event.shiftKey ? last : first).focus();
				return;
			}

			if (event.shiftKey && activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isEnded, onDismiss, dismissible, modalToken]);

	const handleBackdropClick = () => {
		if (!isEnded && dismissible) onDismiss();
	};

	const hasDescribedByContent = role === 'alertdialog' && Boolean(children);

	const isVisible = isOpening && !isEnded;

	return createPortal(
		<div
			className={clsx(
				'fixed inset-0 z-50 flex items-start justify-center',
				'p-2 sm:py-[3rem] lg:py-[5rem]',
				'transition-opacity duration-200 ease-out',
				isVisible ? 'opacity-100' : 'opacity-0'
			)}
			onClick={handleBackdropClick}
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
					OVERLAY_BG,
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
					<div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 flex-shrink-0">
						<h2
							id={titleId}
							className="text-base font-medium tracking-tight text-gray-900 dark:text-gray-100"
						>
							{title}
						</h2>
						{dismissible && (
							<IconButton
								icon="i-mdi-close"
								onClick={onDismiss}
								aria-label={closeLabel}
								variant="subtle"
								size="sm"
								radius="full"
								className="-mr-1"
							/>
						)}
					</div>
				)}
				<div
					ref={contentRef}
					id={hasDescribedByContent ? contentId : undefined}
					className={clsx(
						'flex-1 overflow-y-auto px-6 pb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400 min-h-0',
						!title && 'pt-6',
						className
					)}
				>
					{children}
				</div>
				{footer && (
					<div
						className={clsx(
							'flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0',
							OVERLAY_BORDER
						)}
					>
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body
	);
}
