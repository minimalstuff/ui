import clsx from 'clsx';
import {
	type ChangeEvent,
	type FocusEvent,
	type KeyboardEvent,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { MultiComboboxCheckbox } from '#components/multi_combobox/multi_combobox_checkbox';
import { BUTTON_COLOR_TOKENS } from '#components/shared/button_styles';
import { Field } from '#components/shared/field';
import {
	BASE_INPUT_STYLES,
	FIELD_ERROR_BORDER,
	FIELD_TEXT_COLORS,
} from '#components/shared/field_styles';
import {
	ACTIVE_ITEM_FOCUS_OUTLINE,
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
import {
	PANEL_RADIUS_CLASSES,
	RADIUS_CLASSES,
	type Radius,
} from '#components/shared/radius';
import { OVERLAY_BG, OVERLAY_BORDER } from '#components/shared/surface_tokens';
import { useActiveOption } from '#components/shared/use_active_option';
import { useControlledState } from '#components/shared/use_controlled_state';
import { useFieldIds } from '#components/shared/use_field_ids';
import { useStableCallback } from '#components/shared/use_stable_callback';
import { useLabels } from '#components/ui_provider/use_labels';

const DEFAULT_MAX_DISPLAYED_VALUES = 2;
const OPTION_ROW_CLASSES = 'flex items-center gap-2';

export interface MultiComboboxOption {
	value: string;
	label: string;
}

export interface MultiComboboxProps {
	/** Long lists render faster when the array keeps the same identity between renders (memoize it). */
	options: readonly MultiComboboxOption[];
	/**
	 * Decides whether an option matches the text typed in the search field.
	 * Replaces the default case-insensitive "label contains the query" match,
	 * for example to ignore accents.
	 */
	filterOption?: (option: MultiComboboxOption, query: string) => boolean;
	label?: string | ReactNode;
	description?: string | ReactNode;
	'aria-label'?: string;
	error?: string;
	placeholder?: string;
	searchPlaceholder?: string;
	noResultsText?: string;
	clearLabel?: string;
	clearText?: string;
	maxSelectedValues?: number;
	isOptionDisabled?: (
		optionValue: string,
		selectedValues: readonly string[]
	) => boolean;
	maxDisplayedValues?: number;
	formatOverflowCount?: (hiddenCount: number) => string;
	formatSelectedCount?: (selectedCount: number) => string;
	formatMaxSelectedHint?: (maxSelectedValues: number) => string;
	radius?: Radius;
	unstyled?: boolean;
	disabled?: boolean;
	required?: boolean;
	className?: string;
	wrapperClassName?: string;
	values?: readonly string[];
	defaultValues?: readonly string[];
	onChange?: (values: readonly string[]) => void;
	/**
	 * Fires with the final selection whenever the user is done editing:
	 * when the dropdown closes (Escape, outside click, focus leaving the
	 * wrapper), and when the selection is cleared from the trigger's X
	 * button while the dropdown is closed.
	 */
	onDropdownClose?: (values: readonly string[]) => void;
	id?: string;
}

/**
 * An option is disabled either because the caller's `isOptionDisabled`
 * rejects it, or because `maxSelectedValues` is already reached and this
 * option is not one of the currently selected ones.
 */
function resolveIsOptionDisabled(
	optionValue: string,
	selectedValues: readonly string[],
	selectedValueSet: ReadonlySet<string>,
	maxSelectedValues: number | undefined,
	isOptionDisabled:
		| ((optionValue: string, selectedValues: readonly string[]) => boolean)
		| undefined
): boolean {
	if (isOptionDisabled?.(optionValue, selectedValues)) return true;
	if (maxSelectedValues === undefined) return false;
	if (selectedValueSet.has(optionValue)) return false;
	return selectedValues.length >= maxSelectedValues;
}

function toggleSelectedValue(
	selectedValues: readonly string[],
	selectedValueSet: ReadonlySet<string>,
	optionValue: string
): readonly string[] {
	return selectedValueSet.has(optionValue)
		? selectedValues.filter((value) => value !== optionValue)
		: [...selectedValues, optionValue];
}

interface DisplayedPills {
	visibleOptions: readonly MultiComboboxOption[];
	hiddenCount: number;
}

/**
 * Splits the selected options into the pills shown on the trigger and the
 * count hidden behind the overflow chip, keeping the total number of slots at
 * `maxDisplayedValues`.
 */
function resolveDisplayedPills(
	selectedOptions: readonly MultiComboboxOption[],
	maxDisplayedValues: number
): DisplayedPills {
	if (selectedOptions.length <= maxDisplayedValues) {
		return { visibleOptions: selectedOptions, hiddenCount: 0 };
	}
	const visibleCount = Math.max(maxDisplayedValues - 1, 0);
	return {
		visibleOptions: selectedOptions.slice(0, visibleCount),
		hiddenCount: selectedOptions.length - visibleCount,
	};
}

function resolveSearchFieldName(
	label: ReactNode,
	ariaLabel: string | undefined,
	searchText: string
): string {
	if (typeof label === 'string') return `${label}, ${searchText}`;
	if (ariaLabel) return `${ariaLabel}, ${searchText}`;
	return searchText;
}

const PILL_CLASSES =
	'inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-900 dark:text-gray-100';

/**
 * Multi-select combobox: a trigger button showing the selected options as
 * pills opens a searchable dropdown of checkbox-style options. Selecting an
 * option never closes the dropdown, unlike the single-select `Combobox`.
 */
export function MultiCombobox({
	options,
	filterOption,
	label,
	description,
	'aria-label': ariaLabel,
	error,
	placeholder,
	searchPlaceholder,
	noResultsText,
	clearLabel,
	clearText,
	maxSelectedValues,
	isOptionDisabled,
	maxDisplayedValues = DEFAULT_MAX_DISPLAYED_VALUES,
	formatOverflowCount,
	formatSelectedCount,
	formatMaxSelectedHint,
	radius = 'sm',
	unstyled = false,
	disabled = false,
	required = false,
	className,
	wrapperClassName,
	values,
	defaultValues = [],
	onChange,
	onDropdownClose,
	id,
}: Readonly<MultiComboboxProps>): ReactElement {
	const labels = useLabels();
	const { fieldId, errorId, descriptionId, labelId } = useFieldIds(id);
	const listboxId = `${fieldId}-listbox`;
	const maxHintId = `${fieldId}-max-hint`;
	const selectionSummaryId = `${fieldId}-selection`;
	const hasExplicitTriggerName = label !== undefined || Boolean(ariaLabel);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const listboxRef = useRef<HTMLUListElement>(null);

	const [selectedValues, setSelectedValues] = useControlledState(
		values,
		defaultValues
	);

	const [query, setQuery] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const selectedValueSet = useMemo(
		() => new Set(selectedValues),
		[selectedValues]
	);

	const lowercasedLabels = useMemo(
		() =>
			filterOption ? [] : options.map((option) => option.label.toLowerCase()),
		[options, filterOption]
	);

	const filteredOptions = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return options;
		if (filterOption) {
			return options.filter((option) => filterOption(option, query));
		}
		return options.filter((_, index) =>
			lowercasedLabels[index].includes(normalizedQuery)
		);
	}, [options, filterOption, lowercasedLabels, query]);

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

	const selectedOptions = useMemo(
		() => options.filter((option) => selectedValueSet.has(option.value)),
		[options, selectedValueSet]
	);
	const hasSelectionSummary =
		hasExplicitTriggerName && selectedOptions.length > 0;

	const { visibleOptions, hiddenCount } = resolveDisplayedPills(
		selectedOptions,
		maxDisplayedValues
	);

	const openDropdown = () => {
		if (disabled) return;
		setIsOpen(true);
	};

	const closeDropdown = useCallback(() => {
		setIsOpen(false);
		setQuery('');
		resetActiveOption();
		onDropdownClose?.(selectedValues);
	}, [resetActiveOption, onDropdownClose, selectedValues]);

	const toggleOpen = () => {
		if (isOpen) closeDropdown();
		else openDropdown();
	};

	const toggleOption = (optionValue: string) => {
		const isDisabled = resolveIsOptionDisabled(
			optionValue,
			selectedValues,
			selectedValueSet,
			maxSelectedValues,
			isOptionDisabled
		);
		if (isDisabled) return;
		const nextValues = toggleSelectedValue(
			selectedValues,
			selectedValueSet,
			optionValue
		);
		setSelectedValues(nextValues);
		onChange?.(nextValues);
	};

	const clearSelection = () => {
		setSelectedValues([]);
		onChange?.([]);
	};

	const handleTriggerClearClick = (event: MouseEvent) => {
		event.stopPropagation();
		clearSelection();
		if (!isOpen) onDropdownClose?.([]);
		triggerRef.current?.focus();
	};

	const handleFooterClearClick = () => {
		clearSelection();
		searchInputRef.current?.focus();
	};

	const handleTriggerClick = () => {
		if (disabled) return;
		toggleOpen();
	};

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
		resetActiveOption();
	};

	const handleArrowDown = (event: KeyboardEvent<HTMLElement>) => {
		event.preventDefault();
		if (!isOpen) {
			openDropdown();
			firstActiveOption();
			return;
		}
		moveActiveOption(1);
	};

	const handleArrowUp = (event: KeyboardEvent<HTMLElement>) => {
		event.preventDefault();
		if (!isOpen) {
			openDropdown();
			lastActiveOption();
			return;
		}
		moveActiveOption(-1);
	};

	const handleEnter = (event: KeyboardEvent<HTMLElement>) => {
		if (!isOpen) return;
		event.preventDefault();
		const option = filteredOptions[activeIndex];
		if (option) toggleOption(option.value);
	};

	const handleEscape = (event: KeyboardEvent<HTMLElement>) => {
		if (!isOpen) return;
		event.preventDefault();
		closeDropdown();
		triggerRef.current?.focus();
	};

	const handlePage = (event: KeyboardEvent<HTMLElement>, direction: 1 | -1) => {
		if (!isOpen || hasModifierKey(event)) return;
		event.preventDefault();
		moveActiveOptionWithinBounds(
			direction * readListboxPageSize(listboxRef.current)
		);
	};

	const handleOptionClick = useStableCallback((option: ListboxOptionData) => {
		toggleOption(option.value);
	});

	const getOptionState = (option: ListboxOptionData): ListboxOptionState => ({
		isSelected: selectedValueSet.has(option.value),
		isDisabled: resolveIsOptionDisabled(
			option.value,
			selectedValues,
			selectedValueSet,
			maxSelectedValues,
			isOptionDisabled
		),
		className: OPTION_ROW_CLASSES,
	});

	const renderOptionContent = useCallback(
		(option: ListboxOptionData, isSelected: boolean) => (
			<>
				<MultiComboboxCheckbox
					isSelected={isSelected}
					unstyled={unstyled}
					radius={radius}
				/>
				{option.label}
			</>
		),
		[unstyled, radius]
	);

	const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key === 'PageDown') return handlePage(event, 1);
		if (event.key === 'PageUp') return handlePage(event, -1);
		if (event.key === 'ArrowDown') return handleArrowDown(event);
		if (event.key === 'ArrowUp') return handleArrowUp(event);
		if (event.key === 'Enter') return handleEnter(event);
		if (event.key === 'Escape') return handleEscape(event);
	};

	const handleWrapperBlur = (event: FocusEvent<HTMLDivElement>) => {
		if (!isOpen) return;
		const nextFocusTarget = event.relatedTarget;
		const staysInsideWrapper =
			nextFocusTarget instanceof Node &&
			wrapperRef.current?.contains(nextFocusTarget);
		if (staysInsideWrapper) return;
		closeDropdown();
	};

	const handlePanelMouseDown = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target === searchInputRef.current) return;
		event.preventDefault();
	};

	useEffect(() => {
		if (!isOpen) return;
		const handleOutsideInteraction = (event: globalThis.MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				closeDropdown();
			}
		};
		document.addEventListener('mousedown', handleOutsideInteraction);
		return () =>
			document.removeEventListener('mousedown', handleOutsideInteraction);
	}, [isOpen, closeDropdown]);

	return (
		<Field
			fieldId={fieldId}
			errorId={errorId}
			descriptionId={descriptionId}
			label={label}
			description={description}
			error={error}
			required={required}
			wrapperClassName={wrapperClassName}
		>
			<div ref={wrapperRef} className="relative" onBlur={handleWrapperBlur}>
				{hasSelectionSummary && (
					<span id={selectionSummaryId} className="sr-only">
						{selectedOptions.map((option) => option.label).join(', ')}
					</span>
				)}
				<button
					ref={triggerRef}
					type="button"
					id={fieldId}
					role="combobox"
					disabled={disabled}
					aria-expanded={isOpen}
					aria-controls={listboxId}
					aria-haspopup="listbox"
					aria-invalid={!!error}
					aria-required={required || undefined}
					aria-describedby={joinIds(
						hasSelectionSummary && selectionSummaryId,
						Boolean(description) && descriptionId,
						error && errorId
					)}
					aria-labelledby={label && !ariaLabel ? labelId : undefined}
					aria-label={ariaLabel}
					onClick={handleTriggerClick}
					onKeyDown={handleKeyDown}
					className={clsx(
						'w-full flex flex-wrap items-center gap-1 text-left disabled:opacity-50 disabled:cursor-not-allowed',
						!unstyled && [
							BASE_INPUT_STYLES,
							RADIUS_CLASSES[radius],
							'pl-3 pr-8 py-2 text-sm min-h-10',
						],
						!unstyled &&
							error &&
							clsx(FIELD_ERROR_BORDER, FIELD_FOCUS_RING_ERROR),
						className
					)}
				>
					{selectedOptions.length === 0 ? (
						<span
							className={clsx(!unstyled && 'text-gray-500 dark:text-gray-400')}
						>
							{placeholder}
						</span>
					) : (
						<>
							{visibleOptions.map((option) => (
								<span
									key={option.value}
									className={clsx(!unstyled && PILL_CLASSES)}
								>
									{option.label}
								</span>
							))}
							{hiddenCount > 0 && (
								<span className={clsx(!unstyled && PILL_CLASSES)}>
									{(formatOverflowCount ?? labels.overflowCount)(hiddenCount)}
								</span>
							)}
						</>
					)}
				</button>
				{!unstyled && selectedValues.length > 0 && !disabled && (
					<button
						type="button"
						aria-label={clearLabel ?? labels.clearSelection}
						onMouseDown={(event) => event.preventDefault()}
						onClick={handleTriggerClearClick}
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
						onMouseDown={handlePanelMouseDown}
						className={clsx(
							'absolute z-10 mt-1 w-full text-sm shadow-lg',
							!unstyled && [
								'border overflow-hidden',
								OVERLAY_BG,
								OVERLAY_BORDER,
								PANEL_RADIUS_CLASSES[radius],
							]
						)}
					>
						<input
							ref={searchInputRef}
							type="text"
							autoFocus
							role="combobox"
							aria-expanded="true"
							aria-autocomplete="list"
							aria-haspopup="listbox"
							autoComplete="off"
							value={query}
							onChange={handleSearchChange}
							onKeyDown={handleKeyDown}
							placeholder={searchPlaceholder ?? labels.search}
							aria-label={resolveSearchFieldName(
								label,
								ariaLabel,
								searchPlaceholder ?? labels.search
							)}
							aria-controls={listboxId}
							aria-activedescendant={activeOptionId}
							aria-describedby={
								maxSelectedValues !== undefined ? maxHintId : undefined
							}
							className={clsx(
								'w-full',
								!unstyled && [
									'px-3 py-2 border-b bg-transparent',
									ACTIVE_ITEM_FOCUS_OUTLINE,
									FIELD_TEXT_COLORS,
									OVERLAY_BORDER,
								]
							)}
						/>
						{maxSelectedValues !== undefined && (
							<div
								id={maxHintId}
								className={clsx(
									'px-3 py-1 text-xs',
									!unstyled && ['border-b', OVERLAY_BORDER],
									!unstyled && 'text-gray-500 dark:text-gray-400'
								)}
							>
								{(formatMaxSelectedHint ?? labels.maxSelectedHint)(
									maxSelectedValues
								)}
							</div>
						)}
						<ListboxOptions
							ref={listboxRef}
							id={listboxId}
							options={filteredOptions}
							activeIndex={activeIndex}
							noResultsText={noResultsText ?? labels.noResults}
							aria-labelledby={label && !ariaLabel ? labelId : undefined}
							aria-label={ariaLabel}
							aria-multiselectable
							getOptionState={getOptionState}
							renderOptionContent={renderOptionContent}
							onOptionClick={handleOptionClick}
						/>
						{maxSelectedValues !== undefined && (
							<div
								className={clsx(
									'flex items-center justify-between px-3 py-2',
									!unstyled && ['border-t', OVERLAY_BORDER]
								)}
							>
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{(formatSelectedCount ?? labels.selectedCount)(
										selectedValues.length
									)}
								</span>
								<button
									type="button"
									disabled={selectedValues.length === 0}
									onClick={handleFooterClearClick}
									className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-blue-400 dark:hover:text-blue-300"
								>
									{clearText ?? labels.clear}
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</Field>
	);
}
