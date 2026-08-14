import clsx from 'clsx';
import { type ComponentPropsWithRef } from 'react';

import { FieldError } from '#components/shared/field_error';
import { useFieldIds } from '#components/shared/use_field_ids';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { useControlledState } from '#components/shared/use_controlled_state';
import {
	CONTROL_BORDER,
	SELECTED_FILL,
	SURFACE_BORDER,
} from '#components/shared/surface_tokens';
import {
	CONTROL_FOCUS_RING,
	CONTROL_FOCUS_RING_COLOR,
	CONTROL_FOCUS_RING_ERROR_COLOR,
} from '#components/shared/focus_styles';
import {
	FIELD_DESCRIPTION_TEXT,
	FIELD_ERROR_BORDER,
	FIELD_LABEL_TEXT,
	FIELD_REQUIRED_MARK,
} from '#components/shared/field_styles';

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
	radius?: Radius;
	unstyled?: boolean;
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
	radius = 'lg',
	unstyled = false,
	className,
	wrapperClassName,
	id,
	...props
}: Readonly<RadioOptionsProps>) {
	const { fieldId: groupId, errorId } = useFieldIds(id);
	const name = nameProp ?? groupId;

	const [selectedValue, setSelectedValue] = useControlledState(
		value,
		defaultValue ?? ''
	);

	const normalizedOptions: RadioOption[] = options.map((opt) =>
		typeof opt === 'string' ? { value: opt, label: opt } : opt
	);

	const handleChange = (optionValue: string) => {
		setSelectedValue(optionValue);
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
				<legend className={clsx(FIELD_LABEL_TEXT, 'mb-2', className)}>
					{label}
					{required && <span className={FIELD_REQUIRED_MARK}>*</span>}
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
					const isDisabled = disabled === true || option.disabled === true;

					return (
						<label
							key={option.value}
							htmlFor={optionId}
							className={clsx(
								'flex cursor-pointer items-start gap-3 transition-colors duration-150',
								orientation === 'horizontal' && 'flex-1',
								CONTROL_FOCUS_RING,
								error
									? CONTROL_FOCUS_RING_ERROR_COLOR
									: CONTROL_FOCUS_RING_COLOR,
								!unstyled && [
									RADIUS_CLASSES[radius],
									'border px-3 py-2.5',
									isSelected
										? error
											? clsx(FIELD_ERROR_BORDER, 'bg-red-50 dark:bg-red-950/20')
											: 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/25'
										: error
											? 'border-red-300 bg-white dark:border-red-800/50 dark:bg-gray-800/50'
											: clsx(
													SURFACE_BORDER,
													'bg-gray-50 hover:border-gray-300 hover:bg-white dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800'
												),
								],
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
											? FIELD_ERROR_BORDER
											: 'border-blue-600 dark:border-blue-500'
										: error
											? 'border-red-400 dark:border-red-600'
											: CONTROL_BORDER
								)}
								aria-hidden
							>
								{isSelected && (
									<span
										className={clsx(
											'h-2 w-2 rounded-full',
											error ? 'bg-red-500 dark:bg-red-400' : SELECTED_FILL
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
										className={clsx(FIELD_DESCRIPTION_TEXT, 'mt-0.5')}
									>
										{option.description}
									</span>
								)}
							</span>
						</label>
					);
				})}
			</div>

			<FieldError id={errorId} error={error} className="mt-2" />
		</fieldset>
	);
}
