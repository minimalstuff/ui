import clsx from 'clsx';
import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { FieldError } from '#components/shared/field_error';
import { useFieldIds } from '#components/shared/use_field_ids';
import { SELECTED_FILL } from '#components/shared/surface_tokens';
import { FieldDescription } from '#components/shared/field_description';
import { useControlledState } from '#components/shared/use_controlled_state';
import {
	FIELD_LABEL_TEXT,
	FIELD_REQUIRED_MARK,
} from '#components/shared/field_styles';
import {
	CONTROL_FOCUS_RING,
	CONTROL_FOCUS_RING_COLOR,
} from '#components/shared/focus_styles';

export interface SwitchProps extends Omit<
	ComponentPropsWithRef<'input'>,
	'type' | 'className'
> {
	label?: string | ReactNode;
	description?: string | ReactNode;
	error?: string;
	unstyled?: boolean;
	className?: string;
	wrapperClassName?: string;
}

export function Switch({
	label,
	description,
	error,
	unstyled = false,
	className,
	wrapperClassName,
	checked,
	defaultChecked = false,
	onChange,
	id,
	...props
}: Readonly<SwitchProps>) {
	const { fieldId: switchId, errorId, descriptionId } = useFieldIds(id);
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
				htmlFor={switchId}
				className={clsx(
					'flex items-center gap-3 cursor-pointer',
					props.disabled && 'cursor-not-allowed opacity-50'
				)}
			>
				<span
					className={clsx(
						'relative inline-flex w-11 shrink-0',
						'transition-colors duration-200 ease-in-out',
						CONTROL_FOCUS_RING,
						CONTROL_FOCUS_RING_COLOR,
						!unstyled && [
							'rounded-full border-2 border-transparent',
							isChecked ? SELECTED_FILL : 'bg-gray-200 dark:bg-gray-600',
							error && 'ring-2 ring-red-500 dark:ring-red-400',
						],
						className
					)}
				>
					<input
						type="checkbox"
						role="switch"
						id={switchId}
						className="sr-only"
						checked={isChecked}
						onChange={handleChange}
						aria-invalid={!!error}
						aria-describedby={describedBy}
						{...props}
					/>
					<span
						className={clsx(
							'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0',
							'transition duration-200 ease-in-out',
							isChecked ? 'translate-x-5.25' : 'translate-x-0'
						)}
						aria-hidden
					/>
				</span>
				{label && (
					<>
						{typeof label === 'string' ? (
							<span className={clsx(FIELD_LABEL_TEXT, 'select-none')}>
								{label}
								{props.required && (
									<span className={FIELD_REQUIRED_MARK}>*</span>
								)}
							</span>
						) : (
							<>
								{label}
								{props.required && (
									<span className={FIELD_REQUIRED_MARK}>*</span>
								)}
							</>
						)}
					</>
				)}
			</label>
			<FieldDescription
				id={descriptionId}
				description={description}
				className="mt-1 ml-14"
			/>
			<FieldError id={errorId} error={error} className="mt-1 ml-14" />
		</div>
	);
}
