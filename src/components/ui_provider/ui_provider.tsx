import { type ReactNode, useContext, useMemo } from 'react';

import {
	type UILabels,
	UILabelsContext,
} from '#components/ui_provider/ui_labels';
import {
	AnnounceFieldErrorsContext,
	useAnnounceFieldErrors,
} from '#components/ui_provider/use_announce_field_errors';

export type { UILabels };

export interface UIProviderProps {
	/** Overrides the default labels. Nested providers merge over their parent. */
	labels?: Partial<UILabels>;
	/**
	 * Whether field errors are announced as they appear (`role="alert"`).
	 * Defaults to `true`; nested providers inherit the parent value unless set.
	 * Set it to `false` when the app announces errors itself (an error summary
	 * or focus on the first invalid field): it avoids several alerts firing at
	 * once on submit, and lets WebKitGTK re-read the error on focus, since it
	 * leaves `role="alert"` content out of the computed description. The error
	 * stays linked by `aria-describedby` either way.
	 */
	announceFieldErrors?: boolean;
	children: ReactNode;
}

function omitUndefinedLabels(
	labels: Partial<UILabels> = {}
): Partial<UILabels> {
	return Object.fromEntries(
		Object.entries(labels).filter(([, label]) => label !== undefined)
	);
}

/**
 * Provides default user-facing labels (close, confirm, no results...) to every
 * component below it. Precedence: explicit prop > provider > English default.
 *
 * `Modal` and `ConfirmModal` render where `<ModalProvider />` is mounted, so
 * mount `ModalProvider` inside `UIProvider` for them to receive the labels.
 */
export function UIProvider({
	labels,
	announceFieldErrors,
	children,
}: Readonly<UIProviderProps>) {
	const parentLabels = useContext(UILabelsContext);
	const parentAnnounceFieldErrors = useAnnounceFieldErrors();

	const mergedLabels = useMemo<UILabels>(
		() => ({ ...parentLabels, ...omitUndefinedLabels(labels) }),
		[parentLabels, labels]
	);

	return (
		<UILabelsContext.Provider value={mergedLabels}>
			<AnnounceFieldErrorsContext.Provider
				value={announceFieldErrors ?? parentAnnounceFieldErrors}
			>
				{children}
			</AnnounceFieldErrorsContext.Provider>
		</UILabelsContext.Provider>
	);
}
