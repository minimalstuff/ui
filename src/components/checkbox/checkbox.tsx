import clsx from 'clsx';
import { type ComponentPropsWithRef } from 'react';

import { FieldError } from '#components/shared/field_error';
import { useFieldIds } from '#components/shared/use_field_ids';
import { CheckmarkIcon } from '#components/shared/checkmark_icon';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { FieldDescription } from '#components/shared/field_description';
import { optionCardClasses } from '#components/shared/option_card_styles';
import { useControlledState } from '#components/shared/use_controlled_state';
import {
	CONTROL_BG,
	CONTROL_BORDER,
	SELECTED_FILL,
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

/**
 * Renders a `Checkbox` label's text content: a string label picks up
 * `labelTextClassName` for its selected/error colours, while a `ReactNode`
 * label is rendered as-is. Shared by both `variant`s so the branching lives
 * in one place.
 */
function renderLabelContent(
	label: React.ReactNode | undefined,
	labelTextClassName: string,
	isRequired: boolean
): React.ReactNode {
	if (label === undefined) return null;

	if (typeof label === 'string') {
		return (
			<span className={labelTextClassName}>
				{label}
				{isRequired && <span className={FIELD_REQUIRED_MARK}>*</span>}
			</span>
		);
	}

	return (
		<>
			{label}
			{isRequired && <span className={FIELD_REQUIRED_MARK}>*</span>}
		</>
	);
}

export interface CheckboxProps extends Omit<
	ComponentPropsWithRef<'input'>,
	'type' | 'className'
> {
	label?: string | React.ReactNode;
	description?: string | React.ReactNode;
	error?: string;
	radius?: Radius;
	unstyled?: boolean;
	fullWidth?: boolean;
	variant?: 'inline' | 'card';
	className?: string;
	wrapperClassName?: string;
}

export function Checkbox({
	label,
	description,
	error,
	radius = 'sm',
	unstyled = false,
	fullWidth = false,
	variant = 'inline',
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
	const isCardVariant = variant === 'card';
	const describedBy =
		[description && descriptionId, error && errorId]
			.filter(Boolean)
			.join(' ') || undefined;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(event.target.checked);
		onChange?.(event);
	};

	const labelClassName = isCardVariant
		? optionCardClasses({
				isSelected: isChecked,
				isError: Boolean(error),
				isDisabled: props.disabled === true,
				radius,
				unstyled,
			})
		: clsx(
				'flex items-start gap-3 cursor-pointer',
				props.disabled && 'cursor-not-allowed opacity-50'
			);

	const labelTextClassName = isCardVariant
		? clsx(
				'select-none text-sm font-medium',
				isChecked
					? error
						? 'text-red-700 dark:text-red-300'
						: 'text-blue-700 dark:text-blue-300'
					: 'text-gray-700 dark:text-gray-300'
			)
		: clsx(FIELD_LABEL_TEXT, 'select-none');

	const checkboxWrapperClassName = clsx(
		'relative shrink-0',
		RADIUS_CLASSES[radius],
		!isCardVariant && [
			CONTROL_FOCUS_RING,
			error ? CONTROL_FOCUS_RING_ERROR_COLOR : CONTROL_FOCUS_RING_COLOR,
		]
	);

	const labelContent = renderLabelContent(
		label,
		labelTextClassName,
		props.required === true
	);

	return (
		<div className={clsx(fullWidth ? 'w-full' : 'w-fit', wrapperClassName)}>
			<label htmlFor={checkboxId} className={labelClassName}>
				<span className={checkboxWrapperClassName}>
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
						{isChecked && <CheckmarkIcon />}
					</span>
				</span>
				{isCardVariant ? (
					<span className="flex min-w-0 flex-col">
						{labelContent}
						{description && (
							<span
								id={descriptionId}
								className={clsx(FIELD_DESCRIPTION_TEXT, 'mt-0.5')}
							>
								{description}
							</span>
						)}
					</span>
				) : (
					labelContent
				)}
			</label>
			{!isCardVariant && (
				<FieldDescription
					id={descriptionId}
					description={description}
					className="mt-1 ml-8"
				/>
			)}
			<FieldError
				id={errorId}
				error={error}
				className={isCardVariant ? 'mt-1' : 'mt-1 ml-8'}
			/>
		</div>
	);
}
