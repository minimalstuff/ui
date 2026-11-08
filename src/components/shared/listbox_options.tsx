import clsx from 'clsx';
import { type ReactNode, type Ref, useMemo, useRef } from 'react';

import {
	ListboxOption,
	type ListboxOptionData,
} from '#components/shared/listbox_option';
import { getMountedIndices } from '#components/shared/listbox_window';
import type { OptionLabelOverflow } from '#components/shared/option_label_overflow';
import { THIN_SCROLLBAR } from '#components/shared/surface_tokens';
import type { ListboxMetrics } from '#components/shared/use_listbox_metrics';
import { useListboxWindow } from '#components/shared/use_listbox_window';
import { useScrollToActiveOption } from '#components/shared/use_scroll_to_active_option';
import { mergeRefs } from '#lib/merge_refs';

export type ListboxOptionState = {
	isSelected: boolean;
	isDisabled?: boolean;
	className?: string;
};

type ListboxOptionsProps = {
	ref?: Ref<HTMLUListElement>;
	id: string;
	options: readonly ListboxOptionData[];
	activeIndex: number;
	noResultsText: string;
	/** Mounts only the rows near the viewport, for long lists. Decide it from the unfiltered option count so it never flips while typing. */
	isWindowed?: boolean;
	/** How option labels that do not fit on one line are shown. */
	labelOverflow?: OptionLabelOverflow;
	/** Row to reveal on mount when no option is active yet. */
	initialVisibleIndex?: number;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-multiselectable'?: boolean;
	/** Cheap, called for every mounted row on each render: return primitives only. When windowed, `className` must not change the row height: the window assumes uniform rows apart from the active one. */
	getOptionState: (option: ListboxOptionData) => ListboxOptionState;
	/** Must be referentially stable, it runs inside the memoized rows. */
	renderOptionContent: (
		option: ListboxOptionData,
		isSelected: boolean,
		isTruncated: boolean
	) => ReactNode;
	/** Must be referentially stable, it is handed to the memoized rows. */
	onOptionClick: (option: ListboxOptionData) => void;
};

const LISTBOX_CLASSES = 'max-h-60 overflow-auto py-1';
const TRUNCATING_LISTBOX_CLASSES = 'w-0 min-w-full';

function getRowsHeight(rowCount: number, rowHeight: number): string {
	return `${rowCount * rowHeight}px`;
}

function getRowTop(index: number, metrics: ListboxMetrics): string {
	return `${metrics.edgePadding + index * metrics.rowHeight}px`;
}

/**
 * The listbox and its "no results" live region, shared by `Combobox` and
 * `MultiCombobox`. The status region is a sibling of the listbox, never a
 * child, so the listbox only contains options. When windowed, the space of
 * the unmounted rows is a margin on the first and last mounted rows (listbox
 * padding would count against its max height, and spacer elements are not
 * options), and the active option stays mounted so `aria-activedescendant` always resolves.
 */
export function ListboxOptions({
	ref,
	id,
	options,
	activeIndex,
	noResultsText,
	isWindowed = false,
	labelOverflow = 'wrap',
	initialVisibleIndex,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	'aria-multiselectable': ariaMultiselectable,
	getOptionState,
	renderOptionContent,
	onOptionClick,
}: Readonly<ListboxOptionsProps>) {
	const isEmpty = options.length === 0;
	const listboxRef = useRef<HTMLUListElement | null>(null);
	const mergedRef = useMemo(() => mergeRefs(ref, listboxRef), [ref]);
	const { startIndex, endIndex, metrics, refreshWindow } = useListboxWindow({
		listboxRef,
		optionCount: options.length,
		activeIndex,
		isWindowed,
	});
	useScrollToActiveOption({
		listboxRef,
		listboxId: id,
		activeIndex,
		initialVisibleIndex,
		isWindowed,
		metrics,
		refreshWindow,
	});

	const getLeadingSpace = (index: number) =>
		isWindowed && index === startIndex && startIndex > 0
			? getRowsHeight(startIndex, metrics.rowHeight)
			: undefined;

	const getTrailingSpace = (index: number) =>
		isWindowed && index === endIndex - 1 && endIndex < options.length
			? getRowsHeight(options.length - endIndex, metrics.rowHeight)
			: undefined;

	const isTruncated = (isActive: boolean) =>
		labelOverflow === 'truncate' ||
		(labelOverflow === 'wrap-active' && !isActive);

	const renderRow = (option: ListboxOptionData, index: number) => {
		const { isSelected, isDisabled, className } = getOptionState(option);
		const isActive = index === activeIndex;
		const isOutsideWindow = index < startIndex || index >= endIndex;
		return (
			<ListboxOption
				key={option.value}
				listboxId={id}
				option={option}
				index={index}
				setSize={options.length}
				isActive={isActive}
				isSelected={isSelected}
				isDisabled={isDisabled}
				className={className}
				isTruncated={isTruncated(isActive)}
				canShowTitle={isTruncated(isActive)}
				absoluteTop={
					isWindowed && isOutsideWindow ? getRowTop(index, metrics) : undefined
				}
				marginTop={getLeadingSpace(index)}
				marginBottom={getTrailingSpace(index)}
				renderContent={renderOptionContent}
				onOptionClick={onOptionClick}
			/>
		);
	};

	const renderRows = () => {
		if (!isWindowed) return options.map(renderRow);
		return getMountedIndices({ startIndex, endIndex, activeIndex }).map(
			(index) => renderRow(options[index], index)
		);
	};

	return (
		<>
			<ul
				ref={mergedRef}
				id={id}
				role="listbox"
				aria-labelledby={ariaLabelledBy}
				aria-label={ariaLabel}
				aria-multiselectable={ariaMultiselectable}
				className={clsx(
					LISTBOX_CLASSES,
					labelOverflow !== 'wrap' && TRUNCATING_LISTBOX_CLASSES,
					isWindowed && 'relative',
					THIN_SCROLLBAR
				)}
				onScroll={isWindowed ? refreshWindow : undefined}
			>
				{renderRows()}
			</ul>
			<div
				role="status"
				className={
					isEmpty ? 'px-3 py-2 text-gray-500 dark:text-gray-400' : undefined
				}
			>
				{isEmpty ? noResultsText : ''}
			</div>
		</>
	);
}
