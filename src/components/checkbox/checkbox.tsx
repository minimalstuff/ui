import clsx from 'clsx';
import { type ComponentPropsWithRef, useId, useState } from 'react';

import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	CONTROL_BG,
	CONTROL_BORDER,
	SELECTED_FILL,
} from '#components/shared/surface_tokens';
import {
	FIELD_DESCRIPTION_TEXT,
	FIELD_ERROR_BORDER,
	FIELD_ERROR_TEXT,
	FIELD_LABEL_TEXT,
	FIELD_REQUIRED_MARK,
} from '#components/shared/field_styles';

interface CheckboxProps extends Omit<
	ComponentPropsWithRef<'input'>,
	'type' | 'className'
> {
	label?: string | React.ReactNode;
	description?: string | React.ReactNode;
	error?: string;
	radius?: Radius;
	unstyled?: boolean;
	className?: string;
	wrapperClassName?: string;
}

export function Checkbox({
	label,
	description,
	error,
	radius = 'sm',
	unstyled = false,
	className,
	wrapperClassName,
	checked,
	defaultChecked = false,
	onChange,
	id,
	...props
}: CheckboxProps) {
	const generatedId = useId();
	const checkboxId = id ?? generatedId;
	const [internalChecked, setInternalChecked] = useState(defaultChecked);
	const isControlled = checked !== undefined;
	const isChecked = isControlled ? checked : internalChecked;
	const describedBy =
		[description && `${checkboxId}-description`, error && `${checkboxId}-error`]
			.filter(Boolean)
			.join(' ') || undefined;

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
						'relative shrink-0',
						RADIUS_CLASSES[radius],
						'focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-900',
						error ? 'focus-within:ring-red-500' : 'focus-within:ring-blue-500'
					)}
				>
					<input
						type="checkbox"
						id={checkboxId}
						className="sr-only"
						checked={isChecked}
						onChange={handleChange}
						aria-invalid={!!error}
						aria-describedby={describedBy}
						{...props}
					/>
					<span
						className={clsx(
							'flex h-5 w-5 items-center justify-center transition-all duration-200',
							!unstyled && [
								RADIUS_CLASSES[radius],
								'border-2',
								isChecked
									? clsx('border-blue-600 dark:border-blue-500', SELECTED_FILL)
									: clsx(CONTROL_BORDER, CONTROL_BG),
								error && FIELD_ERROR_BORDER,
							],
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
				{typeof label === 'string' ? (
					<span className={clsx(FIELD_LABEL_TEXT, 'select-none')}>
						{label}
						{props.required && <span className={FIELD_REQUIRED_MARK}>*</span>}
					</span>
				) : (
					<>
						{label}
						{props.required && <span className={FIELD_REQUIRED_MARK}>*</span>}
					</>
				)}
			</label>
			{description &&
				(typeof description === 'string' ? (
					<p
						id={`${checkboxId}-description`}
						className={clsx(FIELD_DESCRIPTION_TEXT, 'mt-1 ml-8')}
					>
						{description}
					</p>
				) : (
					<span
						id={`${checkboxId}-description`}
						className={clsx(FIELD_DESCRIPTION_TEXT, 'block mt-1 ml-8')}
					>
						{description}
					</span>
				))}
			{error && (
				<p
					id={`${checkboxId}-error`}
					className={clsx(FIELD_ERROR_TEXT, 'mt-1 ml-8')}
					role="alert"
				>
					{error}
				</p>
			)}
		</div>
	);
}
