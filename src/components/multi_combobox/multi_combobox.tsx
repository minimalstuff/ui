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

import { Field } from '#components/shared/field';
import { useFieldIds } from '#components/shared/use_field_ids';
import { useActiveOption } from '#components/shared/use_active_option';
import { BUTTON_COLOR_TOKENS } from '#components/shared/button_styles';
import { useControlledState } from '#components/shared/use_controlled_state';
import {
	PANEL_RADIUS_CLASSES,
	RADIUS_CLASSES,
	type Radius,
} from '#components/shared/radius';
import {
	BASE_INPUT_STYLES,
	FIELD_ERROR_BORDER,
	FIELD_TEXT_COLORS,
} from '#components/shared/field_styles';
import {
	ACTIVE_OPTION_OUTLINE,
	BUTTON_FOCUS_OUTLINE,
	FIELD_FOCUS_RING_ERROR,
} from '#components/shared/focus_styles';
import {
	CONTROL_BG,
	CONTROL_BORDER,
	OVERLAY_BG,
	OVERLAY_BORDER,
	SELECTED_FILL,
} from '#components/shared/surface_tokens';

const DEFAULT_MAX_DISPLAYED_VALUES = 2;

export interface MultiComboboxOption {
	value: string;
	label: string;
}

export interface MultiComboboxProps {
	options: readonly MultiComboboxOption[];
	label?: string | ReactNode;
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
	maxSelectedValues: number | undefined,
	isOptionDisabled:
		| ((optionValue: string, selectedValues: readonly string[]) => boolean)
		| undefined
): boolean {
	if (isOptionDisabled?.(optionValue, selectedValues)) return true;
	if (maxSelectedValues === undefined) return false;
	if (selectedValues.includes(optionValue)) return false;
	return selectedValues.length >= maxSelectedValues;
}

function toggleSelectedValue(
	selectedValues: readonly string[],
	optionValue: string
): readonly string[] {
	return selectedValues.includes(optionValue)
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

const PILL_CLASSES =
	'inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-900 dark:text-gray-100';

/**
 * Multi-select combobox: a trigger button showing the selected options as
 * pills opens a searchable dropdown of checkbox-style options. Selecting an
 * option never closes the dropdown, unlike the single-select `Combobox`.
 */
export function MultiCombobox({
	options,
	label,
	'aria-label': ariaLabel,
	error,
	placeholder,
	searchPlaceholder = 'Search',
	noResultsText = 'No results found',
	clearLabel = 'Clear selection',
	clearText = 'Clear',
	maxSelectedValues,
	isOptionDisabled,
	maxDisplayedValues = DEFAULT_MAX_DISPLAYED_VALUES,
	formatOverflowCount = (hiddenCount) => `+${hiddenCount} more`,
	formatSelectedCount = (selectedCount) => `${selectedCount} selected`,
	formatMaxSelectedHint = (max) => `You can select up to ${max} items`,
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
	const { fieldId, errorId, labelId } = useFieldIds(id);
	const listboxId = `${fieldId}-listbox`;
	const maxHintId = `${fieldId}-max-hint`;
	const triggerRef = useRef<HTMLButtonElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [selectedValues, setSelectedValues] = useControlledState(
		values,
		defaultValues
	);

	const [query, setQuery] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const filteredOptions = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return options;
		return options.filter((option) =>
			option.label.toLowerCase().includes(normalizedQuery)
		);
	}, [options, query]);

	const {
		activeIndex,
		activeOptionId,
		move: moveActiveOption,
		first: firstActiveOption,
		last: lastActiveOption,
		reset: resetActiveOption,
	} = useActiveOption({
		optionCount: filteredOptions.length,
		getOptionId: (index) => `${listboxId}-option-${index}`,
		isOpen,
	});

	const selectedOptions = useMemo(
		() => options.filter((option) => selectedValues.includes(option.value)),
		[options, selectedValues]
	);

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
			maxSelectedValues,
			isOptionDisabled
		);
		if (isDisabled) return;
		const nextValues = toggleSelectedValue(selectedValues, optionValue);
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

	const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
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
			label={label}
			error={error}
			required={required}
			wrapperClassName={wrapperClassName}
		>
			<div ref={wrapperRef} className="relative" onBlur={handleWrapperBlur}>
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
					aria-describedby={error ? errorId : undefined}
					aria-labelledby={typeof label === 'string' ? labelId : undefined}
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
									{formatOverflowCount(hiddenCount)}
								</span>
							)}
						</>
					)}
				</button>
				{!unstyled && selectedValues.length > 0 && !disabled && (
					<button
						type="button"
						aria-label={clearLabel}
						onMouseDown={(event) => event.preventDefault()}
						onClick={handleTriggerClearClick}
						className={clsx(
							'absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300',
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
							autoComplete="off"
							value={query}
							onChange={handleSearchChange}
							onKeyDown={handleKeyDown}
							placeholder={searchPlaceholder}
							aria-label={searchPlaceholder}
							aria-controls={listboxId}
							aria-activedescendant={activeOptionId}
							aria-describedby={
								maxSelectedValues !== undefined ? maxHintId : undefined
							}
							className={clsx(
								'w-full',
								!unstyled && [
									'px-3 py-2 border-b bg-transparent focus:outline-none',
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
								{formatMaxSelectedHint(maxSelectedValues)}
							</div>
						)}
						<ul
							id={listboxId}
							role="listbox"
							aria-multiselectable
							className="max-h-60 overflow-auto py-1"
						>
							{filteredOptions.map((option, index) => {
								const isSelected = selectedValues.includes(option.value);
								const isDisabled = resolveIsOptionDisabled(
									option.value,
									selectedValues,
									maxSelectedValues,
									isOptionDisabled
								);
								return (
									<li
										key={option.value}
										id={`${listboxId}-option-${index}`}
										role="option"
										aria-selected={isSelected}
										aria-disabled={isDisabled}
										onClick={() => toggleOption(option.value)}
										className={clsx(
											'px-3 py-2 flex items-center gap-2 text-gray-900 dark:text-gray-100',
											isDisabled
												? 'opacity-50 cursor-not-allowed'
												: 'cursor-pointer',
											index === activeIndex
												? clsx(
														'bg-blue-50 dark:bg-blue-900/40',
														ACTIVE_OPTION_OUTLINE
													)
												: !isDisabled &&
														'hover:bg-gray-50 dark:hover:bg-gray-800/60'
										)}
									>
										<span
											aria-hidden
											className={clsx(
												'flex h-4 w-4 shrink-0 items-center justify-center',
												!unstyled && [
													'border-2',
													RADIUS_CLASSES[radius],
													isSelected
														? clsx(
																'border-blue-600 dark:border-blue-500',
																SELECTED_FILL
															)
														: clsx(CONTROL_BORDER, CONTROL_BG),
												]
											)}
										>
											{isSelected && (
												<svg
													className="h-3 w-3 text-white"
													viewBox="0 0 12 12"
													fill="none"
													stroke="currentColor"
													strokeWidth="2.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<polyline points="2 6 5 9 10 3" />
												</svg>
											)}
										</span>
										{option.label}
									</li>
								);
							})}
						</ul>
						<div
							role="status"
							className={
								filteredOptions.length === 0
									? 'px-3 py-2 text-gray-500 dark:text-gray-400'
									: undefined
							}
						>
							{filteredOptions.length === 0 ? noResultsText : ''}
						</div>
						{maxSelectedValues !== undefined && (
							<div
								className={clsx(
									'flex items-center justify-between px-3 py-2',
									!unstyled && ['border-t', OVERLAY_BORDER]
								)}
							>
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{formatSelectedCount(selectedValues.length)}
								</span>
								<button
									type="button"
									disabled={selectedValues.length === 0}
									onClick={handleFooterClearClick}
									className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-blue-400 dark:hover:text-blue-300"
								>
									{clearText}
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</Field>
	);
}
