import clsx from 'clsx';
import { type ComponentPropsWithRef } from 'react';

import { FieldError } from '#components/shared/field_error';
import { useFieldIds } from '#components/shared/use_field_ids';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { FieldDescription } from '#components/shared/field_description';
import { useControlledState } from '#components/shared/use_controlled_state';
import {
	CONTROL_BG,
	CONTROL_BORDER,
	SELECTED_FILL,
} from '#components/shared/surface_tokens';
import {
	FIELD_ERROR_BORDER,
	FIELD_LABEL_TEXT,
	FIELD_REQUIRED_MARK,
} from '#components/shared/field_styles';
import {
	CONTROL_FOCUS_RING,
	CONTROL_FOCUS_RING_COLOR,
	CONTROL_FOCUS_RING_ERROR_COLOR,
} from '#components/shared/focus_styles';

export interface CheckboxProps extends Omit<
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
}: Readonly<CheckboxProps>) {
	const { fieldId: checkboxId, errorId, descriptionId } = useFieldIds(id);
	const [isChecked, setIsChecked] = useControlledState(checked, defaultChecked);
	const describedBy =
		[description && descriptionId, error && errorId]
			.filter(Boolean)
			.join(' ') || undefined;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(event.target.checked);
		onChange?.(event);
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
						CONTROL_FOCUS_RING,
						error ? CONTROL_FOCUS_RING_ERROR_COLOR : CONTROL_FOCUS_RING_COLOR
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
				{label !== undefined &&
					(typeof label === 'string' ? (
						<span className={clsx(FIELD_LABEL_TEXT, 'select-none')}>
							{label}
							{props.required && <span className={FIELD_REQUIRED_MARK}>*</span>}
						</span>
					) : (
						<>
							{label}
							{props.required && <span className={FIELD_REQUIRED_MARK}>*</span>}
						</>
					))}
			</label>
			<FieldDescription
				id={descriptionId}
				description={description}
				className="mt-1 ml-8"
			/>
			<FieldError id={errorId} error={error} className="mt-1 ml-8" />
		</div>
	);
}
