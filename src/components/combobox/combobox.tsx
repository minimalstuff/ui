import clsx from 'clsx';
import {
	type KeyboardEvent,
	type MouseEvent,
	type ReactNode,
	useMemo,
	useRef,
	useState,
} from 'react';

import { BUTTON_COLOR_TOKENS } from '#components/shared/button_styles';
import { Field } from '#components/shared/field';
import {
	BASE_INPUT_STYLES,
	FIELD_ERROR_BORDER,
} from '#components/shared/field_styles';
import {
	BUTTON_FOCUS_OUTLINE,
	FIELD_FOCUS_RING_ERROR,
} from '#components/shared/focus_styles';
import { hasModifierKey } from '#components/shared/has_modifier_key';
import { joinIds } from '#components/shared/join_ids';
import type { ListboxOptionData } from '#components/shared/listbox_option';
import { getListboxOptionId } from '#components/shared/listbox_option_id';
import {
	ListboxOptions,
	type ListboxOptionState,
} from '#components/shared/listbox_options';
import { readListboxPageSize } from '#components/shared/listbox_page_size';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { resolveNodeLabelledBy } from '#components/shared/resolve_node_labelled_by';
import { OVERLAY_BG, OVERLAY_BORDER } from '#components/shared/surface_tokens';
import { useActiveOption } from '#components/shared/use_active_option';
import { useControlledState } from '#components/shared/use_controlled_state';
import { useFieldIds } from '#components/shared/use_field_ids';
import { useStableCallback } from '#components/shared/use_stable_callback';
import { useLabels } from '#components/ui_provider/use_labels';

export interface ComboboxOption {
	value: string;
	label: string;
}

export interface ComboboxProps {
	/** Long lists render faster when the array keeps the same identity between renders (memoize it). */
	options: readonly ComboboxOption[];
	/**
	 * Decides whether an option matches the text typed in the field. Replaces
	 * the default case-insensitive "label contains the query" match, for
	 * example to ignore accents.
	 */
	filterOption?: (option: ComboboxOption, query: string) => boolean;
	label?: string | ReactNode;
	description?: string | ReactNode;
	'aria-label'?: string;
	error?: string;
	placeholder?: string;
	noResultsText?: string;
	clearLabel?: string;
	radius?: Radius;
	unstyled?: boolean;
	disabled?: boolean;
	required?: boolean;
	className?: string;
	wrapperClassName?: string;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	id?: string;
}

function renderOptionLabel(option: ListboxOptionData): string {
	return option.label;
}

export function Combobox({
	options,
	filterOption,
	label,
	description,
	'aria-label': ariaLabel,
	error,
	placeholder,
	noResultsText,
	clearLabel,
	radius = 'md',
	unstyled = false,
	disabled = false,
	required = false,
	className,
	wrapperClassName,
	value,
	defaultValue = '',
	onChange,
	id,
}: Readonly<ComboboxProps>) {
	const labels = useLabels();
	const {
		fieldId: comboboxId,
		errorId,
		descriptionId,
		labelId,
	} = useFieldIds(id);
	const listboxId = `${comboboxId}-listbox`;
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxRef = useRef<HTMLUListElement>(null);

	const [selectedValue, setSelectedValue] = useControlledState(
		value,
		defaultValue
	);
	const selectedOption = options.find((opt) => opt.value === selectedValue);

	const [query, setQuery] = useState('');
	const [isFiltering, setIsFiltering] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const lowercasedLabels = useMemo(
		() =>
			filterOption ? [] : options.map((option) => option.label.toLowerCase()),
		[options, filterOption]
	);

	const filteredOptions = useMemo(() => {
		if (!isFiltering) return options;
		if (filterOption) {
			return options.filter((option) => filterOption(option, query));
		}
		const normalizedQuery = query.toLowerCase();
		return options.filter((_, index) =>
			lowercasedLabels[index].includes(normalizedQuery)
		);
	}, [options, filterOption, lowercasedLabels, isFiltering, query]);

	const {
		activeIndex,
		activeOptionId,
		move: moveActiveOption,
		moveWithinBounds: moveActiveOptionWithinBounds,
		first: firstActiveOption,
		last: lastActiveOption,
		reset: resetActiveOption,
	} = useActiveOption({
		optionCount: filteredOptions.length,
		getOptionId: (index) => getListboxOptionId(listboxId, index),
		isOpen,
	});

	const displayValue = isOpen ? query : (selectedOption?.label ?? '');

	const openDropdown = () => {
		if (disabled) return;
		setQuery(selectedOption?.label ?? '');
		setIsFiltering(false);
		setIsOpen(true);
		resetActiveOption();
	};

	const closeDropdown = () => {
		setIsOpen(false);
		setIsFiltering(false);
		resetActiveOption();
	};

	const selectOption = (option: ComboboxOption) => {
		setSelectedValue(option.value);
		onChange?.(option.value);
		closeDropdown();
	};

	const clearSelection = () => {
		setSelectedValue('');
		onChange?.('');
		setQuery('');
		inputRef.current?.focus();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		setIsFiltering(true);
		setIsOpen(true);
		firstActiveOption();
	};

	const handleInputClick = () => {
		if (!isOpen) openDropdown();
	};

	const handleArrowDown = (e: KeyboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (e.altKey) {
			if (!isOpen) openDropdown();
			return;
		}
		if (!isOpen) {
			openDropdown();
			firstActiveOption();
			return;
		}
		moveActiveOption(1);
	};

	const handleArrowUp = (e: KeyboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (e.altKey) {
			if (isOpen) closeDropdown();
			return;
		}
		if (!isOpen) {
			openDropdown();
			lastActiveOption();
			return;
		}
		moveActiveOption(-1);
	};

	const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
		if (!isOpen) return;
		const option = filteredOptions[activeIndex];
		if (!option) {
			closeDropdown();
			return;
		}
		e.preventDefault();
		selectOption(option);
	};

	const handleEscape = (e: KeyboardEvent<HTMLInputElement>) => {
		if (!isOpen) return;
		e.preventDefault();
		closeDropdown();
	};

	const handlePage = (
		e: KeyboardEvent<HTMLInputElement>,
		direction: 1 | -1
	) => {
		if (!isOpen || hasModifierKey(e)) return;
		e.preventDefault();
		moveActiveOptionWithinBounds(
			direction * readListboxPageSize(listboxRef.current)
		);
	};

	const getOptionState = (option: ListboxOptionData): ListboxOptionState => {
		const isSelected = option.value === selectedValue;
		return { isSelected, className: isSelected ? 'font-medium' : undefined };
	};

	const handleOptionClick = useStableCallback(selectOption);

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'PageDown') return handlePage(e, 1);
		if (e.key === 'PageUp') return handlePage(e, -1);
		if (e.key === 'ArrowDown') return handleArrowDown(e);
		if (e.key === 'ArrowUp') return handleArrowUp(e);
		if (e.key === 'Enter') return handleEnter(e);
		if (e.key === 'Escape') return handleEscape(e);
	};

	const handleClearMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
	};

	return (
		<Field
			fieldId={comboboxId}
			errorId={errorId}
			descriptionId={descriptionId}
			label={label}
			description={description}
			error={error}
			required={required}
			wrapperClassName={wrapperClassName}
		>
			<div className="relative">
				{!unstyled && (
					<span
						className="i-mdi-magnify absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none"
						aria-hidden
					/>
				)}
				<input
					ref={inputRef}
					id={comboboxId}
					role="combobox"
					type="text"
					autoComplete="off"
					disabled={disabled}
					placeholder={placeholder}
					value={displayValue}
					onChange={handleInputChange}
					onClick={handleInputClick}
					onBlur={closeDropdown}
					onKeyDown={handleKeyDown}
					aria-expanded={isOpen}
					aria-controls={listboxId}
					aria-autocomplete="list"
					aria-label={ariaLabel}
					aria-labelledby={resolveNodeLabelledBy(label, labelId, ariaLabel)}
					aria-activedescendant={activeOptionId}
					aria-invalid={!!error}
					aria-required={required || undefined}
					aria-describedby={joinIds(
						Boolean(description) && descriptionId,
						error && errorId
					)}
					className={clsx(
						'w-full disabled:opacity-50 disabled:cursor-not-allowed',
						!unstyled && [
							BASE_INPUT_STYLES,
							RADIUS_CLASSES[radius],
							'pl-9 pr-8 py-2 text-sm',
						],
						!unstyled &&
							error &&
							clsx(FIELD_ERROR_BORDER, FIELD_FOCUS_RING_ERROR),
						className
					)}
				/>
				{!unstyled && selectedOption && !disabled && (
					<button
						type="button"
						aria-label={clearLabel ?? labels.clearSelection}
						onMouseDown={handleClearMouseDown}
						onClick={clearSelection}
						className={clsx(
							"absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 before:content-[''] before:absolute before:-inset-[4px]",
							BUTTON_FOCUS_OUTLINE,
							BUTTON_COLOR_TOKENS.primary.focusOutline
						)}
					>
						<span className="i-mdi-close block w-4 h-4" aria-hidden />
					</button>
				)}
				{isOpen && (
					<div
						className={clsx(
							'absolute z-10 mt-1 w-full text-sm shadow-lg',
							!unstyled && [
								'border',
								OVERLAY_BG,
								OVERLAY_BORDER,
								RADIUS_CLASSES[radius],
							]
						)}
					>
						<ListboxOptions
							ref={listboxRef}
							id={listboxId}
							options={filteredOptions}
							activeIndex={activeIndex}
							noResultsText={noResultsText ?? labels.noResults}
							aria-labelledby={label && !ariaLabel ? labelId : undefined}
							aria-label={ariaLabel}
							getOptionState={getOptionState}
							renderOptionContent={renderOptionLabel}
							onOptionClick={handleOptionClick}
						/>
					</div>
				)}
			</div>
		</Field>
	);
}
