import {
	useCallback,
	useId,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { ToastContext } from '#components/toast/toast_context';
import {
	addToastEntry,
	closeToastEntry,
	removeToastEntry,
	type ToastEntry,
} from '#components/toast/toast_entries';
import { ToastItem } from '#components/toast/toast_item';
import { getDefaultToastDuration } from '#components/toast/toast_styles';
import {
	type ToastApi,
	type ToastOptions,
} from '#components/toast/toast_types';
import {
	DEFAULT_CLOSE_NOTIFICATION_LABEL,
	DEFAULT_NOTIFICATIONS_LABEL,
} from '#components/ui_provider/ui_labels';
import { useLabels } from '#components/ui_provider/use_labels';

export interface ToastProviderProps {
	children: ReactNode;
}

function createEntry(id: string, options: Readonly<ToastOptions>): ToastEntry {
	const tone = options.tone ?? 'info';
	return {
		id,
		message: options.message,
		tone,
		duration: options.duration ?? getDefaultToastDuration(tone),
		action: options.action,
		radius: options.radius ?? 'lg',
		unstyled: options.unstyled ?? false,
		isClosing: false,
	};
}

/**
 * Provides `useToast()` and renders the toast region (bottom-center on phones,
 * bottom-right from the `sm` breakpoint) through a portal on `document.body`,
 * above modals and drawers. Raise it above a bottom bar with the
 * `--ms-toast-offset-bottom` CSS custom property (default: 1rem plus the
 * safe-area inset). Info and success toasts are announced politely, errors
 * assertively; errors stack below the other toasts.
 */
export function ToastProvider({ children }: Readonly<ToastProviderProps>) {
	const labels = useLabels();
	const idPrefix = useId();
	const counterRef = useRef(0);
	const [entries, setEntries] = useState<readonly ToastEntry[]>([]);

	const show = useCallback(
		(options: Readonly<ToastOptions>) => {
			counterRef.current += 1;
			const id = `${idPrefix}-${counterRef.current}`;
			setEntries((current) => addToastEntry(current, createEntry(id, options)));
			return id;
		},
		[idPrefix]
	);
	const dismiss = useCallback((id: string) => {
		setEntries((current) => closeToastEntry(current, id));
	}, []);
	const remove = useCallback((id: string) => {
		setEntries((current) => removeToastEntry(current, id));
	}, []);

	const toastApi = useMemo<ToastApi>(
		() => ({ show, dismiss }),
		[show, dismiss]
	);
	const closeLabel =
		labels.closeNotification ?? DEFAULT_CLOSE_NOTIFICATION_LABEL;

	const renderStack = (isError: boolean) =>
		entries
			.filter((entry) => (entry.tone === 'error') === isError)
			.map((entry) => (
				<ToastItem
					key={entry.id}
					entry={entry}
					closeLabel={closeLabel}
					onDismiss={dismiss}
					onExited={remove}
				/>
			));

	return (
		<ToastContext.Provider value={toastApi}>
			{children}
			{createPortal(
				<section
					aria-label={labels.notifications ?? DEFAULT_NOTIFICATIONS_LABEL}
					className="ms-toast-region"
				>
					<div role="status" aria-atomic="false" className="ms-toast-stack">
						{renderStack(false)}
					</div>
					<div role="alert" aria-atomic="false" className="ms-toast-stack">
						{renderStack(true)}
					</div>
				</section>,
				document.body
			)}
		</ToastContext.Provider>
	);
}
