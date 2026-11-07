import clsx from 'clsx';
import { useEffect, useState, type FocusEvent } from 'react';

import { Button } from '#components/button/button';
import { IconButton } from '#components/icon_button/icon_button';
import { TOAST_EXIT_DURATION_MS } from '#components/shared/animation';
import { PANEL_RADIUS_CLASSES } from '#components/shared/radius';
import { OVERLAY_BG, OVERLAY_BORDER } from '#components/shared/surface_tokens';
import { type ToastEntry } from '#components/toast/toast_entries';
import { TONE_ICON_CLASSES } from '#components/toast/toast_styles';
import { useToastTimer } from '#components/toast/use_toast_timer';

interface ToastItemProps {
	entry: ToastEntry;
	closeLabel: string;
	onDismiss: (id: string) => void;
	onExited: (id: string) => void;
}

/** @internal one toast of a `ToastProvider` stack — not part of the public API. */
export function ToastItem({
	entry,
	closeLabel,
	onDismiss,
	onExited,
}: Readonly<ToastItemProps>) {
	const { id, message, tone, duration, action, radius, unstyled, isClosing } =
		entry;
	const [isEntered, setIsEntered] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isFocusWithin, setIsFocusWithin] = useState(false);

	useToastTimer({
		duration,
		isPaused: isHovered || isFocusWithin || isClosing,
		onElapsed: () => onDismiss(id),
	});

	useEffect(() => {
		const frameId = requestAnimationFrame(() => setIsEntered(true));
		return () => cancelAnimationFrame(frameId);
	}, []);

	useEffect(() => {
		if (!isClosing) return;
		const timeoutId = setTimeout(() => onExited(id), TOAST_EXIT_DURATION_MS);
		return () => clearTimeout(timeoutId);
	}, [isClosing, id, onExited]);

	const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
		if (event.currentTarget.contains(event.relatedTarget)) return;
		setIsFocusWithin(false);
	};

	const handleActionClick = () => {
		action?.onClick();
		onDismiss(id);
	};

	const isVisible = isEntered && !isClosing;

	return (
		<div
			data-state={isVisible ? 'open' : 'closed'}
			data-tone={tone}
			className={clsx(
				'ms-toast-width pointer-events-auto mt-2 flex items-start gap-3',
				!unstyled && [
					'px-4 py-3 border shadow-lg text-sm text-gray-900 dark:text-gray-100',
					OVERLAY_BG,
					OVERLAY_BORDER,
					PANEL_RADIUS_CLASSES[radius],
					'ms-toast-transition',
				],
				!unstyled && !isVisible && 'ms-toast-closed'
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onFocus={() => setIsFocusWithin(true)}
			onBlur={handleBlur}
		>
			<span
				aria-hidden="true"
				className={clsx(
					'mt-0.5 h-5 w-5 flex-shrink-0',
					!unstyled && TONE_ICON_CLASSES[tone]
				)}
			/>
			<div className="min-w-0 flex-1 break-words">{message}</div>
			{action && unstyled && (
				<Button unstyled onClick={handleActionClick}>
					{action.label}
				</Button>
			)}
			{action && !unstyled && (
				<Button
					size="xs"
					variant="ghost"
					radius={radius}
					onClick={handleActionClick}
				>
					{action.label}
				</Button>
			)}
			{unstyled ? (
				<IconButton
					icon="i-mdi-close"
					aria-label={closeLabel}
					className="min-h-6 min-w-6"
					unstyled
					onClick={() => onDismiss(id)}
				/>
			) : (
				<IconButton
					icon="i-mdi-close"
					aria-label={closeLabel}
					variant="subtle"
					size="xs"
					radius="full"
					onClick={() => onDismiss(id)}
				/>
			)}
		</div>
	);
}
