import clsx from 'clsx';
import { type InputHTMLAttributes, useId, useState } from 'react';

interface CheckboxProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type' | 'className'
> {
	label?: string;
	error?: string;
	className?: string;
	wrapperClassName?: string;
}

export function Checkbox({
	label,
	error,
	className,
	wrapperClassName,
	checked,
	defaultChecked = false,
	onChange,
	id = 'checkbox',
	...props
}: CheckboxProps) {
	const _checkboxId = useId();
	const checkboxId = `${id}-${_checkboxId}`;
	const [internalChecked, setInternalChecked] = useState(defaultChecked);
	const isControlled = checked !== undefined;
	const isChecked = isControlled ? checked : internalChecked;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isControlled) setInternalChecked(e.target.checked);
		onChange?.(e);
	};

	return (
		<div className={clsx('w-full', wrapperClassName)}>
			<label
				htmlFor={checkboxId}
				className={clsx(
					'flex items-start gap-3 cursor-pointer',
					props.disabled && 'cursor-not-allowed opacity-50'
				)}
			>
				<span
					className={clsx(
						'relative mt-0.5 shrink-0 rounded',
						'focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-900',
						error ? 'focus-within:ring-red-500' : 'focus-within:ring-blue-500'
					)}
				>
					<input
						type="checkbox"
						id={checkboxId}
						className="sr-only"
						checked={checked}
						defaultChecked={defaultChecked}
						onChange={handleChange}
						aria-invalid={!!error}
						aria-describedby={error ? `${checkboxId}-error` : undefined}
						{...props}
					/>
					<span
						className={clsx(
							'flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-200',
							isChecked
								? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
								: 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
							error && 'border-red-500 dark:border-red-400',
							className
						)}
						aria-hidden
					>
						{isChecked && (
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
				</span>
				{label && (
					<span className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
						{label}
						{props.required && (
							<span className="text-red-500 dark:text-red-400 ml-1">*</span>
						)}
					</span>
				)}
			</label>
			{error && (
				<p
					id={`${checkboxId}-error`}
					className="text-xs text-red-600 dark:text-red-400 mt-1 ml-8"
					role="alert"
				>
					{error}
				</p>
			)}
		</div>
	);
}
