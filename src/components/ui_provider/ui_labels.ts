import { createContext } from 'react';

import { type Theme } from '#types/theme';

export interface UILabels {
	/** Accessible name of the modal close button. */
	close: string;
	/** Confirm button of `ConfirmModal`. */
	confirm: string;
	/** Cancel button of `ConfirmModal`. */
	cancel: string;
	/** Empty state of `Combobox` and `MultiCombobox`. */
	noResults: string;
	/** Accessible name of the button clearing a selection. */
	clearSelection: string;
	/** Placeholder and accessible name of the `MultiCombobox` search field. */
	search: string;
	/** Visible text of the `MultiCombobox` clear button. */
	clear: string;
	/** Screen-reader suffix of a required `CheckboxOptions` group. */
	required: string;
	/** Screen-reader announcement of `CopyButton` after a successful copy. */
	copied: string;
	/** Screen-reader text added to a `Button` while it is loading, and announced by `Spinner` without a visible label. */
	loading: string;
	/**
	 * Accessible name of the default `CopyButton` icon button. Optional so that
	 * existing complete label objects keep compiling: a translated label set
	 * must add it, otherwise the English "Copy" is used.
	 */
	copy?: string;
	/** Screen-reader announcement of `CharacterCount` near and at the limit. */
	charactersRemaining: (remainingCount: number) => string;
	/** Accessible name of `ThemeToggle` for the current theme. */
	currentTheme: (theme: Theme) => string;
	/** `MultiCombobox` badge summarising the values that do not fit. */
	overflowCount: (hiddenCount: number) => string;
	/** `MultiCombobox` summary of the number of selected values. */
	selectedCount: (selectedCount: number) => string;
	/** `MultiCombobox` hint shown when the selection limit is reached. */
	maxSelectedHint: (maxSelectedValues: number) => string;
}

export const DEFAULT_COPY_LABEL = 'Copy';

export const DEFAULT_LABELS: UILabels = {
	close: 'Close',
	confirm: 'Confirm',
	cancel: 'Cancel',
	noResults: 'No results found',
	clearSelection: 'Clear selection',
	search: 'Search',
	clear: 'Clear',
	required: 'required',
	copied: 'Copied',
	loading: 'Loading',
	copy: DEFAULT_COPY_LABEL,
	charactersRemaining: (remainingCount) =>
		`${remainingCount} ${remainingCount === 1 ? 'character' : 'characters'} remaining`,
	currentTheme: (theme) => `Current theme: ${theme}`,
	overflowCount: (hiddenCount) => `+${hiddenCount} more`,
	selectedCount: (selectedCount) => `${selectedCount} selected`,
	maxSelectedHint: (maxSelectedValues) =>
		`You can select up to ${maxSelectedValues} items`,
};

export const UILabelsContext = createContext<UILabels>(DEFAULT_LABELS);
