import clsx from 'clsx';
import type { ReactNode, Ref } from 'react';

import {
	ListboxOption,
	type ListboxOptionData,
} from '#components/shared/listbox_option';
import { THIN_SCROLLBAR } from '#components/shared/surface_tokens';

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
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-multiselectable'?: boolean;
	/** Cheap, called for every row on each render: return primitives only. */
	getOptionState: (option: ListboxOptionData) => ListboxOptionState;
	/** Must be referentially stable, it runs inside the memoized rows. */
	renderOptionContent: (
		option: ListboxOptionData,
		isSelected: boolean
	) => ReactNode;
	/** Must be referentially stable, it is handed to the memoized rows. */
	onOptionClick: (option: ListboxOptionData) => void;
};

/**
 * The listbox and its "no results" live region, shared by `Combobox` and
 * `MultiCombobox`. The status region is a sibling of the listbox, never a
 * child, so the listbox only contains options.
 */
export function ListboxOptions({
	ref,
	id,
	options,
	activeIndex,
	noResultsText,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	'aria-multiselectable': ariaMultiselectable,
	getOptionState,
	renderOptionContent,
	onOptionClick,
}: Readonly<ListboxOptionsProps>) {
	const isEmpty = options.length === 0;
	return (
		<>
			<ul
				ref={ref}
				id={id}
				role="listbox"
				aria-labelledby={ariaLabelledBy}
				aria-label={ariaLabel}
				aria-multiselectable={ariaMultiselectable}
				className={clsx('max-h-60 overflow-auto py-1', THIN_SCROLLBAR)}
			>
				{options.map((option, index) => {
					const { isSelected, isDisabled, className } = getOptionState(option);
					return (
						<ListboxOption
							key={option.value}
							listboxId={id}
							option={option}
							index={index}
							setSize={options.length}
							isActive={index === activeIndex}
							isSelected={isSelected}
							isDisabled={isDisabled}
							className={className}
							renderContent={renderOptionContent}
							onOptionClick={onOptionClick}
						/>
					);
				})}
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
