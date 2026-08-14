import clsx from 'clsx';
import {
	type KeyboardEvent,
	type ReactNode,
	useId,
	useMemo,
	useState,
} from 'react';

import { BASE_INPUT_STYLES } from '#components/input/input';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { OVERLAY_BG, OVERLAY_BORDER } from '#components/shared/surface_tokens';
import {
	FIELD_ERROR_BORDER,
	FIELD_ERROR_TEXT,
	FIELD_LABEL_TEXT,
	FIELD_REQUIRED_MARK,
} from '#components/shared/field_styles';

export interface ComboboxOption {
	value: string;
	label: string;
}

interface ComboboxProps {
	options: ComboboxOption[];
	label?: string | ReactNode;
	error?: string;
	placeholder?: string;
	noResultsText?: string;
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
	error,
	placeholder,
	noResultsText = 'No results found',
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
}: ComboboxProps) {
	const generatedId = useId();
	const comboboxId = id ?? generatedId;
	const listboxId = `${comboboxId}-listbox`;

	const [internalValue, setInternalValue] = useState(defaultValue);
	const isControlled = value !== undefined;
	const selectedValue = isControlled ? value : internalValue;
	const selectedOption = options.find((opt) => opt.value === selectedValue);

	const [query, setQuery] = useState('');
	const [isFiltering, setIsFiltering] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);

	const filteredOptions = useMemo(
		() =>
			isFiltering
				? options.filter((opt) =>
						opt.label.toLowerCase().includes(query.toLowerCase())
					)
				: options,
		[options, isFiltering, query]
	);

	const displayValue = isOpen ? query : (selectedOption?.label ?? '');

	const openDropdown = () => {
		if (disabled) return;
		setQuery(selectedOption?.label ?? '');
		setIsFiltering(false);
		setIsOpen(true);
		setActiveIndex(-1);
	};

	const closeDropdown = () => {
		setIsOpen(false);
		setIsFiltering(false);
		setActiveIndex(-1);
	};

	const selectOption = (option: ComboboxOption) => {
		if (!isControlled) setInternalValue(option.value);
		onChange?.(option.value);
		closeDropdown();
	};

	const clearSelection = () => {
		if (!isControlled) setInternalValue('');
		onChange?.('');
		setQuery('');
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		setIsFiltering(true);
		setIsOpen(true);
		setActiveIndex(0);
	};

	const moveActiveIndex = (delta: number) => {
		if (filteredOptions.length === 0) return;
		setActiveIndex((current) => {
			const next = current + delta;
			if (next < 0) return filteredOptions.length - 1;
			if (next >= filteredOptions.length) return 0;
			return next;
		});
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!isOpen) openDropdown();
			else moveActiveIndex(1);
			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (!isOpen) openDropdown();
			else moveActiveIndex(-1);
			return;
		}
		if (e.key === 'Enter') {
			if (!isOpen) return;
			e.preventDefault();
			const option = filteredOptions[activeIndex];
			if (option) selectOption(option);
			return;
		}
		if (e.key === 'Escape') {
			if (!isOpen) return;
			e.preventDefault();
			closeDropdown();
		}
	};

	const activeOptionId =
		isOpen && activeIndex >= 0
			? `${listboxId}-option-${activeIndex}`
			: undefined;

	return (
		<div className={clsx('w-full', wrapperClassName)}>
			{typeof label === 'string' ? (
				<label
					className={clsx(FIELD_LABEL_TEXT, 'block mb-1')}
					htmlFor={comboboxId}
				>
					{label}
					{required && <span className={FIELD_REQUIRED_MARK}>*</span>}
				</label>
			) : (
				<>
					{label}
					{required && <span className={FIELD_REQUIRED_MARK}>*</span>}
				</>
			)}
			<div className="relative">
				{!unstyled && (
					<span
						className="i-mdi-magnify absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none"
						aria-hidden
					/>
				)}
				<input
					id={comboboxId}
					role="combobox"
					type="text"
					autoComplete="off"
					disabled={disabled}
					placeholder={placeholder}
					value={displayValue}
					onChange={handleInputChange}
					onFocus={openDropdown}
					onBlur={closeDropdown}
					onKeyDown={handleKeyDown}
					aria-expanded={isOpen}
					aria-controls={listboxId}
					aria-autocomplete="list"
					aria-activedescendant={activeOptionId}
					aria-invalid={!!error}
					aria-describedby={error ? `${comboboxId}-error` : undefined}
					className={clsx(
						'w-full disabled:opacity-50 disabled:cursor-not-allowed',
						!unstyled && [
							BASE_INPUT_STYLES,
							RADIUS_CLASSES[radius],
							'pl-9 pr-8 py-2 text-sm',
						],
						!unstyled &&
							error &&
							clsx(FIELD_ERROR_BORDER, 'focus:ring-red-500'),
						className
					)}
				/>
				{!unstyled && selectedOption && !disabled && (
					<button
						type="button"
						aria-label="Clear selection"
						onMouseDown={(e) => e.preventDefault()}
						onClick={clearSelection}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
					>
						<span className="i-mdi-close block w-4 h-4" aria-hidden />
					</button>
				)}
				{isOpen && (
					<ul
						id={listboxId}
						role="listbox"
						className={clsx(
							'absolute z-10 mt-1 w-full max-h-60 overflow-auto py-1 text-sm shadow-lg',
							!unstyled && [
								'border',
								OVERLAY_BG,
								OVERLAY_BORDER,
								RADIUS_CLASSES[radius],
							]
						)}
					>
						{filteredOptions.length === 0 ? (
							<li className="px-3 py-2 text-gray-500 dark:text-gray-400">
								{noResultsText}
							</li>
						) : (
							filteredOptions.map((opt, index) => (
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
							))
						)}
					</ul>
				)}
			</div>
			{error && (
				<p
					id={`${comboboxId}-error`}
					className={clsx(FIELD_ERROR_TEXT, 'mt-1')}
					role="alert"
				>
					{error}
				</p>
			)}
		</div>
	);
}
