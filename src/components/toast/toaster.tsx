import clsx from 'clsx';
import { useMemo, useRef, type FocusEvent } from 'react';
import { createPortal } from 'react-dom';

import { ACTIVE_ITEM_FOCUS_OUTLINE } from '#components/shared/focus_styles';
import { type Radius } from '#components/shared/radius';
import { ToasterItem } from '#components/toast/toaster_item';
import { type ToasterPosition } from '#components/toast/toaster_position';
import { TOASTER_POSITION_CLASSES } from '#components/toast/toaster_styles';
import { useIsActiveToaster } from '#components/toast/use_is_active_toaster';
import { useToastAnnouncer } from '#components/toast/use_toast_announcer';
import {
	DEFAULT_CLOSE_NOTIFICATION_LABEL,
	DEFAULT_NOTIFICATIONS_LABEL,
} from '#components/ui_provider/ui_labels';
import { useLabels } from '#components/ui_provider/use_labels';
import { useToastStore } from '#stores/toast_store/toast_store';

export type { ToasterPosition } from '#components/toast/toaster_position';

export interface ToasterProps {
	/** Where the stack sits from the `sm` breakpoint up; on phones it spans the full width at the top or the bottom. Defaults to `'bottom-right'`. */
	position?: ToasterPosition;
	/** Corner radius of every toast that sets none. `full` caps at `lg`. Defaults to `lg`. */
	radius?: Radius;
	/** Strips the library's styling (surface, border, shadow, radius, tone colours, animation, timer bar) from every toast that sets none, keeping layout, behaviour and the 24px minimum size of the close button. */
	unstyled?: boolean;
}

function ToasterView({
	position = 'bottom-right',
	radius,
	unstyled,
}: Readonly<ToasterProps>) {
	const labels = useLabels();
	const entries = useToastStore((state) => state.entries);
	const listRef = useRef<HTMLOListElement>(null);
	const politeRef = useRef<HTMLDivElement>(null);
	const assertiveRef = useRef<HTMLDivElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);
	useToastAnnouncer({ entries, listRef, politeRef, assertiveRef });

	const isTop = position.startsWith('top');
	const visualEntries = useMemo(
		() => (isTop ? [...entries].reverse() : entries),
		[entries, isTop]
	);

	const handleFocus = (event: FocusEvent<HTMLElement>) => {
		const origin = event.relatedTarget;
		if (event.currentTarget.contains(origin)) return;
		previousFocusRef.current = origin instanceof HTMLElement ? origin : null;
	};

	return createPortal(
		<div className={clsx('ms-toaster', TOASTER_POSITION_CLASSES[position])}>
			<section
				data-ms-toaster-region=""
				aria-label={labels.notifications ?? DEFAULT_NOTIFICATIONS_LABEL}
				tabIndex={-1}
				className={clsx(
					'-m-2 max-h-[calc(100dvh_-_2rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] overflow-y-auto overscroll-contain p-2',
					ACTIVE_ITEM_FOCUS_OUTLINE
				)}
				onFocus={handleFocus}
			>
				<ol ref={listRef} className="m-0 flex list-none flex-col gap-2 p-0">
					{visualEntries.map((entry) => (
						<ToasterItem
							key={entry.id}
							entry={entry}
							position={position}
							toasterRadius={radius}
							toasterUnstyled={unstyled}
							closeLabel={
								labels.closeNotification ?? DEFAULT_CLOSE_NOTIFICATION_LABEL
							}
							previousFocusRef={previousFocusRef}
						/>
					))}
				</ol>
			</section>
			<div ref={politeRef} role="status" className="sr-only" />
			<div ref={assertiveRef} role="alert" className="sr-only" />
		</div>,
		document.body
	);
}

/**
 * Renders the toasts shown with `toast()`. Mount it once at the app root; only
 * the first mounted Toaster renders, any other warns in development and
 * renders nothing. It renders nothing on the server and on the first client
 * render. Toasts sit above `Modal` and `Drawer` (`z-[60]`) and never block
 * the page outside themselves. The stack scrolls when it is taller than the
 * viewport.
 *
 * While a Modal is open its Tab trap leaves the toasts unreachable by
 * keyboard. This is why warning and error toasts, and toasts with an action,
 * stay until dismissed.
 *
 * Unmounting the last Toaster empties the toast store in a microtask, so a
 * `toast()` called in the same synchronous turn right after unmounting it is
 * dropped.
 *
 * Offsets come from two CSS custom properties: `--ms-toast-offset-bottom`
 * and `--ms-toast-offset-top` (default: 1rem plus the safe-area inset).
 */
export function Toaster(props: Readonly<ToasterProps>) {
	const isActive = useIsActiveToaster();
	if (!isActive) return null;
	return <ToasterView {...props} />;
}
