import clsx from 'clsx';
import { memo, type ReactNode } from 'react';

import { ACTIVE_OPTION_OUTLINE } from '#components/shared/focus_styles';
import { getListboxOptionId } from '#components/shared/listbox_option_id';

export type ListboxOptionData = {
	value: string;
	label: string;
};

type ListboxOptionProps = {
	listboxId: string;
	option: ListboxOptionData;
	index: number;
	setSize: number;
	isActive: boolean;
	isSelected: boolean;
	isDisabled: boolean | undefined;
	className: string | undefined;
	renderContent: (option: ListboxOptionData, isSelected: boolean) => ReactNode;
	onOptionClick: (option: ListboxOptionData) => void;
};

function preventMouseDownFocusLoss(event: { preventDefault: () => void }) {
	event.preventDefault();
}

function getOptionClassName(
	isActive: boolean,
	isDisabled: boolean | undefined,
	className: string | undefined
): string {
	return clsx(
		'px-3 py-2 text-gray-900 dark:text-gray-100',
		isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
		isActive
			? clsx('bg-blue-50 dark:bg-blue-900/40', ACTIVE_OPTION_OUTLINE)
			: !isDisabled && 'hover:bg-gray-50 dark:hover:bg-gray-800/60',
		className
	);
}

/**
 * One row of a listbox. Memoized and fed primitives plus stable callbacks only,
 * so moving the active option re-renders the two rows that change instead of
 * the whole list.
 */
export const ListboxOption = memo(function ListboxOption({
	listboxId,
	option,
	index,
	setSize,
	isActive,
	isSelected,
	isDisabled,
	className,
	renderContent,
	onOptionClick,
}: Readonly<ListboxOptionProps>) {
	const handleClick = () => onOptionClick(option);

	return (
		<li
			id={getListboxOptionId(listboxId, index)}
			role="option"
			aria-selected={isSelected}
			aria-disabled={isDisabled}
			aria-setsize={setSize}
			aria-posinset={index + 1}
			onMouseDown={preventMouseDownFocusLoss}
			onClick={handleClick}
			className={getOptionClassName(isActive, isDisabled, className)}
		>
			{renderContent(option, isSelected)}
		</li>
	);
});
