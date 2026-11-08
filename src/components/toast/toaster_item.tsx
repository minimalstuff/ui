import clsx from 'clsx';
import {
	memo,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type FocusEvent,
	type PointerEvent,
	type RefObject,
} from 'react';

import { TOAST_EXIT_DURATION_MS } from '#components/shared/animation';
import { type Radius } from '#components/shared/radius';
import { PANEL_RADIUS_CLASSES } from '#components/shared/radius';
import { OVERLAY_BG } from '#components/shared/surface_tokens';
import { moveFocusOutOfToast } from '#components/toast/toast_focus';
import { isPersistentDuration } from '#components/toast/toast_styles';
import { ToasterItemContent } from '#components/toast/toaster_item_content';
import { type ToasterPosition } from '#components/toast/toaster_position';
import { TOASTER_ITEM_POSITION_CLASSES } from '#components/toast/toaster_styles';
import { useToastTimer } from '#components/toast/use_toast_timer';
import { useToastStore } from '#stores/toast_store/toast_store';
import { type ToastStoreEntry } from '#stores/toast_store/toast_store_entries';

interface ToasterItemProps {
	entry: ToastStoreEntry;
	position: ToasterPosition;
	toasterRadius?: Radius;
	toasterUnstyled?: boolean;
	closeLabel: string;
	previousFocusRef: RefObject<HTMLElement | null>;
}

function ToasterItemView({
	entry,
	position,
	toasterRadius,
	toasterUnstyled,
	closeLabel,
	previousFocusRef,
}: Readonly<ToasterItemProps>) {
	const {
		id,
		message,
		description,
		tone,
		duration,
		action,
		revision,
		isClosing,
	} = entry;
	const radius = entry.radius ?? toasterRadius ?? 'lg';
	const unstyled = entry.unstyled ?? toasterUnstyled ?? false;
	const dismissToast = useToastStore((state) => state.dismissToast);
	const removeToast = useToastStore((state) => state.removeToast);
	const setToastPinned = useToastStore((state) => state.setToastPinned);
	const toastRef = useRef<HTMLLIElement>(null);
	const [isEntered, setIsEntered] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isFocusWithin, setIsFocusWithin] = useState(false);

	const handleElapsed = () => dismissToast(id);

	const { isRunning } = useToastTimer({
		duration,
		isPaused: isHovered || isFocusWithin || isClosing,
		onElapsed: handleElapsed,
		revision,
	});

	useEffect(() => {
		const frameId = requestAnimationFrame(() => setIsEntered(true));
		return () => cancelAnimationFrame(frameId);
	}, []);

	useEffect(() => {
		setToastPinned(id, isHovered || isFocusWithin);
	}, [id, isHovered, isFocusWithin, setToastPinned]);

	useLayoutEffect(() => {
		if (!isClosing || !toastRef.current) return;
		moveFocusOutOfToast({
			toastElement: toastRef.current,
			previousFocus: previousFocusRef.current,
		});
	}, [isClosing, previousFocusRef]);

	useEffect(() => {
		if (!isClosing) return;
		const timeoutId = setTimeout(() => removeToast(id), TOAST_EXIT_DURATION_MS);
		return () => clearTimeout(timeoutId);
	}, [isClosing, id, removeToast]);

	const handleBlur = (event: FocusEvent<HTMLLIElement>) => {
		if (event.currentTarget.contains(event.relatedTarget)) return;
		setIsFocusWithin(false);
	};
	const handlePointerEnter = (event: PointerEvent<HTMLLIElement>) => {
		if (event.pointerType === 'touch') return;
		setIsHovered(true);
	};
	const handlePointerLeave = (event: PointerEvent<HTMLLIElement>) => {
		if (event.pointerType === 'touch') return;
		setIsHovered(false);
	};
	const handleFocus = () => setIsFocusWithin(true);
	const handleDismiss = () => dismissToast(id);
	const handleAction = () => {
		action?.onClick();
		dismissToast(id);
	};

	const isOpen = isEntered && !isClosing;
	const timerDuration = isPersistentDuration(duration) ? null : duration;

	return (
		<li
			ref={toastRef}
			data-ms-toast-id={id}
			data-tone={tone}
			data-state={isOpen ? 'open' : 'closed'}
			inert={isClosing}
			className={clsx(
				'pointer-events-auto w-full',
				!unstyled && [
					'shadow-lg',
					OVERLAY_BG,
					PANEL_RADIUS_CLASSES[radius],
					'ms-toaster-item-transition',
					TOASTER_ITEM_POSITION_CLASSES[position],
				]
			)}
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}
		>
			<ToasterItemContent
				tone={tone}
				message={message}
				description={description}
				action={action}
				radius={radius}
				unstyled={unstyled}
				closeLabel={closeLabel}
				timerDuration={timerDuration}
				isTimerRunning={isRunning}
				timerKey={revision}
				onAction={handleAction}
				onDismiss={handleDismiss}
			/>
		</li>
	);
}

/** @internal one toast of the `Toaster` list, memoised on its entry. Not part of the public API. */
export const ToasterItem = memo(ToasterItemView);
