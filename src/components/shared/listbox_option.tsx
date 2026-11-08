import clsx from 'clsx';
import {
	type CSSProperties,
	memo,
	type MouseEvent,
	type ReactNode,
} from 'react';

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
	isTruncated: boolean;
	/** Shows the native tooltip on hover, only when the label is actually cut off. */
	canShowTitle: boolean;
	/** Offset of a row mounted outside the window, set so it stays at its real position. */
	absoluteTop: string | undefined;
	/** Space standing in for the unmounted rows before (first mounted row) and after (last mounted row) the window. */
	marginTop: string | undefined;
	marginBottom: string | undefined;
	renderContent: (
		option: ListboxOptionData,
		isSelected: boolean,
		isTruncated: boolean
	) => ReactNode;
	onOptionClick: (option: ListboxOptionData) => void;
};

function preventMouseDownFocusLoss(event: { preventDefault: () => void }) {
	event.preventDefault();
}

function getOptionClassName(
	isActive: boolean,
	isDisabled: boolean | undefined,
	className: string | undefined,
	isTruncated: boolean
): string {
	return clsx(
		'px-3 py-2 text-gray-900 dark:text-gray-100',
		isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
		isActive
			? clsx('bg-blue-50 dark:bg-blue-900/40', ACTIVE_OPTION_OUTLINE)
			: !isDisabled && 'hover:bg-gray-50 dark:hover:bg-gray-800/60',
		isTruncated && 'truncate',
		className
	);
}

function syncTitle(row: HTMLElement, label: string): void {
	const truncatedElement = row.querySelector('.truncate') ?? row;
	const isCutOff = truncatedElement.scrollWidth > truncatedElement.clientWidth;
	if (isCutOff) row.setAttribute('title', label);
	else row.removeAttribute('title');
}

function getRowStyle(
	absoluteTop: string | undefined,
	marginTop: string | undefined,
	marginBottom: string | undefined
): CSSProperties | undefined {
	if (absoluteTop !== undefined) {
		return { position: 'absolute', top: absoluteTop, left: 0, right: 0 };
	}
	if (marginTop === undefined && marginBottom === undefined) return undefined;
	return { marginTop, marginBottom };
}

/**
 * One row of a listbox. Memoized and fed primitives plus stable callbacks only,
 * so moving the active option re-renders the two rows that change instead of
 * the whole list.
 */
export const ListboxOption = /* @__PURE__ */ memo(function ListboxOption({
	listboxId,
	option,
	index,
	setSize,
	isActive,
	isSelected,
	isDisabled,
	className,
	isTruncated,
	canShowTitle,
	absoluteTop,
	marginTop,
	marginBottom,
	renderContent,
	onOptionClick,
}: Readonly<ListboxOptionProps>) {
	const handleClick = () => onOptionClick(option);
	const handleMouseEnter = (event: MouseEvent<HTMLLIElement>) =>
		syncTitle(event.currentTarget, option.label);

	return (
		<li
			id={getListboxOptionId(listboxId, index)}
			role="option"
			aria-selected={isSelected}
			aria-disabled={isDisabled}
			aria-setsize={setSize}
			aria-posinset={index + 1}
			onMouseDown={preventMouseDownFocusLoss}
			onMouseEnter={canShowTitle ? handleMouseEnter : undefined}
			onClick={handleClick}
			className={getOptionClassName(
				isActive,
				isDisabled,
				className,
				isTruncated
			)}
			style={getRowStyle(absoluteTop, marginTop, marginBottom)}
		>
			{renderContent(option, isSelected, isTruncated)}
		</li>
	);
});
