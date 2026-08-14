import clsx from 'clsx';
import { createPortal } from 'react-dom';
import {
	Children,
	Fragment,
	isValidElement,
	type ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react';

import { ModalFooter } from '#components/modal/modal_footer';
import { OVERLAY_BG } from '#components/shared/surface_tokens';
import { IconButton } from '#components/icon_button/icon_button';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
}

// `Children.toArray` treats a `<>...</>` as one opaque element rather than
// spreading its contents, so a top-level Fragment (the common shape for
// `<><ModalBody/><ModalFooter/></>`) needs unwrapping before we can look for
// a `ModalFooter` among the actual top-level children.
function flattenFragments(children: ReactNode): ReactNode[] {
	return Children.toArray(children).flatMap((child) =>
		isValidElement(child) && child.type === Fragment
			? flattenFragments((child.props as { children?: ReactNode }).children)
			: [child]
	);
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
}: Readonly<ModalShellProps>) {
	const [isOpening, setIsOpening] = useState(false);
	const dialogRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);
	const titleId = useId();

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

		const dialog = dialogRef.current;
		const firstFocusable =
			contentRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
			dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
		(firstFocusable ?? dialog)?.focus();

		const frameId = requestAnimationFrame(() => {
			requestAnimationFrame(() => setIsOpening(true));
		});

		return () => {
			cancelAnimationFrame(frameId);
			document.body.style.overflow = '';
		};
	}, []);

	useEffect(() => {
		if (isEnded) previouslyFocusedRef.current?.focus();
	}, [isEnded]);

	useEffect(() => {
		if (isEnded) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				if (dismissible) onDismiss();
				return;
			}
			if (e.key !== 'Tab') return;

			const dialog = dialogRef.current;
			if (!dialog) return;

			const focusable = Array.from(
				dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
			);
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isEnded, onDismiss, dismissible]);

	const handleBackdropClick = () => {
		if (!isEnded && dismissible) onDismiss();
	};

	const isVisible = isOpening && !isEnded;

	// A `ModalFooter` among `children` means the content owns its own
	// scroll/footer layout (see `ModalBody`/`ModalFooter`) — skip the default
	// padded/scrolling wrapper and the separate `footer` prop slot so the two
	// don't fight over the same space.
	const hasCompoundFooter = flattenFragments(children).some(
		(child) => isValidElement(child) && child.type === ModalFooter
	);

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
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? titleId : undefined}
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
					className={clsx(
						'min-h-0',
						hasCompoundFooter
							? 'flex-1 flex flex-col overflow-hidden'
							: [
									'flex-1 overflow-y-auto px-6 pb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400',
									!title && 'pt-6',
								],
						className
					)}
				>
					{children}
				</div>
				{!hasCompoundFooter && footer && <ModalFooter>{footer}</ModalFooter>}
			</div>
		</div>,
		document.body
	);
}
