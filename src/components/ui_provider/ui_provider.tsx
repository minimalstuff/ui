import { type ReactNode, useContext, useMemo } from 'react';

import {
	type UILabels,
	UILabelsContext,
} from '#components/ui_provider/ui_labels';

export type { UILabels };

export interface UIProviderProps {
	/** Overrides the default labels. Nested providers merge over their parent. */
	labels?: Partial<UILabels>;
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
export function UIProvider({ labels, children }: Readonly<UIProviderProps>) {
	const parentLabels = useContext(UILabelsContext);

	const mergedLabels = useMemo<UILabels>(
		() => ({ ...parentLabels, ...omitUndefinedLabels(labels) }),
		[parentLabels, labels]
	);

	return (
		<UILabelsContext.Provider value={mergedLabels}>
			{children}
		</UILabelsContext.Provider>
	);
}
