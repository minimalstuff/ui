import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { type ReactNode, useEffect, useState } from 'react';

import { IconButton } from '#components/icon_button/icon_button';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalShellProps {
	isEnded: boolean;
	onDismiss: () => void;
	title?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	size?: ModalSize;
	radius?: Radius;
	className?: string;
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
}: ModalShellProps) {
	const [isOpening, setIsOpening] = useState(false);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		const frameId = requestAnimationFrame(() => {
			requestAnimationFrame(() => setIsOpening(true));
		});

		return () => {
			cancelAnimationFrame(frameId);
			document.body.style.overflow = '';
		};
	}, []);

	useEffect(() => {
		if (isEnded) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onDismiss();
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isEnded, onDismiss]);

	const handleBackdropClick = () => {
		if (!isEnded) onDismiss();
	};

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
				className={clsx(
					'relative w-full',
					SIZE_CLASSES[size],
					'bg-white dark:bg-gray-900 shadow-2xl',
					RADIUS_CLASSES[radius],
					'max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-10rem)] overflow-hidden flex flex-col',
					'transition-all duration-200 ease-out',
					isVisible
						? 'opacity-100 scale-100 translate-y-0'
						: 'opacity-0 scale-95 translate-y-1'
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{title && (
					<div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 flex-shrink-0">
						<h2 className="text-base font-medium tracking-tight text-gray-900 dark:text-gray-100">
							{title}
						</h2>
						<IconButton
							icon="i-mdi-close"
							onClick={onDismiss}
							aria-label="Close"
							variant="subtle"
							size="sm"
							radius="full"
							className="-mr-1"
						/>
					</div>
				)}
				<div
					className={clsx(
						'flex-1 overflow-y-auto px-6 pb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400 min-h-0',
						!title && 'pt-6',
						className
					)}
				>
					{children}
				</div>
				{footer && (
					<div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body
	);
}
