import clsx from 'clsx';
import {
	type KeyboardEvent,
	type MouseEvent,
	type ReactNode,
	useMemo,
	useRef,
	useState,
} from 'react';

import { Field } from '#components/shared/field';
import { useFieldIds } from '#components/shared/use_field_ids';
import { useActiveOption } from '#components/shared/use_active_option';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { FIELD_FOCUS_RING_ERROR } from '#components/shared/focus_styles';
import { useControlledState } from '#components/shared/use_controlled_state';
import { OVERLAY_BG, OVERLAY_BORDER } from '#components/shared/surface_tokens';
import {
	BASE_INPUT_STYLES,
	FIELD_ERROR_BORDER,
} from '#components/shared/field_styles';

export interface ComboboxOption {
	value: string;
	label: string;
}

export interface ComboboxProps {
	options: ComboboxOption[];
	label?: string | ReactNode;
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

export function Combobox({
	options,
	label,
	'aria-label': ariaLabel,
	error,
	placeholder,
	noResultsText = 'No results found',
	clearLabel = 'Clear selection',
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
	const { fieldId: comboboxId, errorId } = useFieldIds(id);
	const listboxId = `${comboboxId}-listbox`;
	const inputRef = useRef<HTMLInputElement>(null);

	const [selectedValue, setSelectedValue] = useControlledState(
		value,
		defaultValue
	);
	const selectedOption = options.find((opt) => opt.value === selectedValue);

	const [query, setQuery] = useState('');
	const [isFiltering, setIsFiltering] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const filteredOptions = useMemo(
		() =>
			isFiltering
				? options.filter((opt) =>
						opt.label.toLowerCase().includes(query.toLowerCase())
					)
				: options,
		[options, isFiltering, query]
	);

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

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
			label={label}
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
					aria-activedescendant={activeOptionId}
					aria-invalid={!!error}
					aria-required={required || undefined}
					aria-describedby={error ? errorId : undefined}
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
						aria-label={clearLabel}
						onMouseDown={handleClearMouseDown}
						onClick={clearSelection}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
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
						<ul
							id={listboxId}
							role="listbox"
							className="max-h-60 overflow-auto py-1"
						>
							{filteredOptions.map((opt, index) => (
								<li
									key={opt.value}
									id={`${listboxId}-option-${index}`}
									role="option"
									aria-selected={opt.value === selectedValue}
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => selectOption(opt)}
									className={clsx(
										'px-3 py-2 cursor-pointer text-gray-900 dark:text-gray-100',
										index === activeIndex
											? 'bg-blue-50 dark:bg-blue-900/40'
											: 'hover:bg-gray-50 dark:hover:bg-gray-800/60',
										opt.value === selectedValue && 'font-medium'
									)}
								>
									{opt.label}
								</li>
							))}
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
					</div>
				)}
			</div>
		</Field>
	);
}
