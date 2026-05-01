import clsx from 'clsx';
import { type ComponentPropsWithRef, useId, useState } from 'react';

export interface RadioOption {
	value: string;
	label: string;
	description?: string;
	icon?: string;
	disabled?: boolean;
}

interface RadioOptionsProps extends Omit<
	ComponentPropsWithRef<'fieldset'>,
	'onChange'
> {
	options: string[] | RadioOption[];
	orientation?: 'vertical' | 'horizontal';
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	name?: string;
	label?: string | React.ReactNode;
	error?: string;
	required?: boolean;
	className?: string;
	wrapperClassName?: string;
	id?: string;
}

export function RadioOptions({
	options,
	orientation = 'vertical',
	value,
	defaultValue,
	onChange,
	name: nameProp,
	label,
	error,
	required,
	disabled,
	className,
	wrapperClassName,
	id = 'radio',
	...props
}: RadioOptionsProps) {
	const _id = useId();
	const groupId = `${id}-${_id}`;
	const name = nameProp ?? groupId;

	const [internalValue, setInternalValue] = useState(defaultValue ?? '');
	const isControlled = value !== undefined;
	const selectedValue = isControlled ? value : internalValue;

	const normalizedOptions: RadioOption[] = options.map((opt) =>
		typeof opt === 'string' ? { value: opt, label: opt } : opt
	);

	const errorId = `${groupId}-error`;

	const handleChange = (optionValue: string) => {
		if (!isControlled) setInternalValue(optionValue);
		onChange?.(optionValue);
	};

	return (
		<fieldset
			className={clsx('m-0 border-0 p-0', wrapperClassName)}
			disabled={disabled}
			aria-describedby={error ? errorId : undefined}
			aria-required={required}
			{...props}
		>
			{label && (
				<legend
					className={clsx(
						'mb-2 text-sm font-medium text-gray-700 dark:text-gray-300',
						className
					)}
				>
					{label}
					{required && (
						<span className="ml-1 text-red-500 dark:text-red-400">*</span>
					)}
				</legend>
			)}

			<div
				className={clsx(
					orientation === 'horizontal'
						? 'flex flex-row gap-2'
						: 'flex flex-col gap-2'
				)}
			>
				{normalizedOptions.map((option, index) => {
					const optionId = `${groupId}-${index}`;
					const descriptionId = `${groupId}-${index}-desc`;
					const isSelected = selectedValue === option.value;
					const isDisabled = disabled ?? option.disabled;

					return (
						<label
							key={option.value}
							htmlFor={optionId}
							className={clsx(
								'flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors duration-150',
								orientation === 'horizontal' && 'flex-1',
								'focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
								'focus-within:ring-offset-white dark:focus-within:ring-offset-gray-900',
								error
									? 'focus-within:ring-red-500'
									: 'focus-within:ring-blue-500',
								isSelected
									? error
										? 'border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950/20'
										: 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/25'
									: error
										? 'border-red-300 bg-white dark:border-red-800/50 dark:bg-gray-800/50'
										: 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800',
								isDisabled && 'cursor-not-allowed opacity-50'
							)}
						>
							<input
								type="radio"
								id={optionId}
								name={name}
								value={option.value}
								checked={isSelected}
								onChange={() => handleChange(option.value)}
								disabled={isDisabled}
								required={required && index === 0}
								aria-invalid={error ? true : undefined}
								aria-describedby={
									option.description ? descriptionId : undefined
								}
								className="sr-only"
							/>

							<span
								className={clsx(
									'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150',
									isSelected
										? error
											? 'border-red-500 dark:border-red-400'
											: 'border-blue-600 dark:border-blue-500'
										: error
											? 'border-red-400 dark:border-red-600'
											: 'border-gray-300 dark:border-gray-600'
								)}
								aria-hidden
							>
								{isSelected && (
									<span
										className={clsx(
											'h-2 w-2 rounded-full',
											error
												? 'bg-red-500 dark:bg-red-400'
												: 'bg-blue-600 dark:bg-blue-500'
										)}
									/>
								)}
							</span>

							<span className="flex min-w-0 flex-col">
								<span className="flex items-center gap-1.5">
									{option.icon && (
										<span
											className={clsx(
												option.icon,
												'h-4 w-4 shrink-0',
												isSelected
													? error
														? 'text-red-600 dark:text-red-400'
														: 'text-blue-600 dark:text-blue-400'
													: 'text-gray-500 dark:text-gray-400'
											)}
											aria-hidden
										/>
									)}
									<span
										className={clsx(
											'select-none text-sm font-medium',
											isSelected
												? error
													? 'text-red-700 dark:text-red-300'
													: 'text-blue-700 dark:text-blue-300'
												: 'text-gray-700 dark:text-gray-300'
										)}
									>
										{option.label}
									</span>
								</span>
								{option.description && (
									<span
										id={descriptionId}
										className="mt-0.5 text-xs text-gray-500 dark:text-gray-400"
									>
										{option.description}
									</span>
								)}
							</span>
						</label>
					);
				})}
			</div>

			{error && (
				<p
					id={errorId}
					className="mt-2 text-xs text-red-600 dark:text-red-400"
					role="alert"
				>
					{error}
				</p>
			)}
		</fieldset>
	);
}
