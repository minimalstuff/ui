import { BASE_INPUT_STYLES } from '../input/input';
import clsx from 'clsx';
import { type SelectHTMLAttributes, useId } from 'react';

export interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
	options: SelectOption[];
	label?: string;
	error?: string;
	placeholder?: string;
	className?: string;
	wrapperClassName?: string;
}

export function Select({
	options,
	label,
	error,
	placeholder,
	className,
	wrapperClassName,
	value,
	defaultValue,
	onChange,
	id = 'select',
	...props
}: SelectProps) {
	const _selectId = useId();
	const selectId = `${id}-${_selectId}`;

	return (
		<div className={clsx('w-full', wrapperClassName)}>
			{label && (
				<label
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					htmlFor={selectId}
				>
					{label}
					{props.required && (
						<span className="text-red-500 dark:text-red-400 ml-1">*</span>
					)}
				</label>
			)}
			<select
				id={selectId}
				className={clsx(
					BASE_INPUT_STYLES,
					'pl-3 pr-8 py-2 text-sm appearance-none bg-[length:1rem_1rem] bg-[position:right_0.5rem_center] bg-no-repeat',
					'bg-[url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")]',
					error && 'border-red-500 dark:border-red-400 focus:ring-red-500',
					className
				)}
				value={value}
				defaultValue={defaultValue}
				onChange={onChange}
				aria-invalid={!!error}
				aria-describedby={error ? `${selectId}-error` : undefined}
				{...props}
			>
				{placeholder !== undefined && (
					<option value="">{placeholder}</option>
				)}
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
			{error && (
				<p
					id={`${selectId}-error`}
					className="text-xs text-red-600 dark:text-red-400 mt-1"
					role="alert"
				>
					{error}
				</p>
			)}
		</div>
	);
}
