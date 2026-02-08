import { IconButton } from '#components/icon_button/icon_button';
import { useRunAfterAnimation } from '#hooks/use_run_after_animation/use_run_after_animation';
import clsx from 'clsx';
import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
	isOpen?: boolean;
	onClose?: () => void;
	title?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	className?: string;
}

const ANIMATION_DURATION_MS = 200;
const SIZE_CLASSES = {
	sm: 'max-w-md',
	md: 'max-w-lg',
	lg: 'max-w-2xl',
	xl: 'max-w-4xl',
} as const;

export function Modal({
	isOpen = false,
	onClose,
	title,
	children,
	footer,
	size = 'md',
	className,
}: ModalProps) {
	const [isClosing, setIsClosing] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const [isOpening, setIsOpening] = useState(false);
	const runAfterAnimation = useRunAfterAnimation(ANIMATION_DURATION_MS);

	useEffect(() => {
		if (isOpen && !shouldRender) {
			document.body.style.overflow = 'hidden';

			const openId = setTimeout(() => {
				setShouldRender(true);
				setIsClosing(false);
				requestAnimationFrame(() => {
					requestAnimationFrame(() => setIsOpening(true));
				});
			}, 0);

			return () => clearTimeout(openId);
		}

		if (!isOpen && shouldRender) {
			const closeId = setTimeout(() => {
				setIsClosing(true);
				setIsOpening(false);
			}, 0);

			const cancelAfterAnimation = runAfterAnimation(() => {
				setShouldRender(false);
				setIsClosing(false);
				document.body.style.overflow = '';
			});

			return () => {
				clearTimeout(closeId);
				cancelAfterAnimation();
			};
		}
	}, [isOpen, shouldRender, runAfterAnimation]);

	useEffect(() => {
		if (!isOpen || isClosing) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose?.();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen, isClosing, onClose]);

	const handleBackdropClick = () => {
		if (!isClosing) {
			onClose?.();
		}
	};

	if (!shouldRender) return null;

	const isVisible = isOpening && !isClosing;

	return createPortal(
		<div
			className={clsx(
				'fixed inset-0 z-50 flex items-start justify-center',
				'p-2 sm:py-[3rem] lg:py-[5rem]',
				'transition-all duration-200',
				isVisible ? 'opacity-100' : 'opacity-0'
			)}
			onClick={handleBackdropClick}
		>
			<div
				className={clsx(
					'fixed inset-0 bg-black/50 backdrop-blur-sm',
					'transition-opacity duration-200',
					isVisible ? 'opacity-100' : 'opacity-0'
				)}
				aria-hidden="true"
			/>
			<div
				className={clsx(
					'relative w-full',
					SIZE_CLASSES[size],
					'bg-white dark:bg-gray-800 rounded-lg shadow-xl',
					'max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-10rem)] overflow-hidden flex flex-col',
					'transition-all duration-200',
					isVisible
						? 'opacity-100 scale-100 translate-y-0'
						: 'opacity-0 scale-95 translate-y-2'
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{title && (
					<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							{title}
						</h2>
						<IconButton
							icon="i-mdi-close"
							onClick={onClose?.bind(null)}
							aria-label="Close"
							variant="ghost"
							className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						/>
					</div>
				)}
				<div
					className={clsx(
						'flex-1 overflow-y-auto px-6 py-4 text-gray-600 dark:text-gray-400 min-h-0',
						className
					)}
				>
					{children}
				</div>
				{footer && (
					<div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body
	);
}
