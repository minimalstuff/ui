import clsx from 'clsx';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { Field } from '#components/shared/field';
import { useFieldIds } from '#components/shared/use_field_ids';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { FIELD_FOCUS_RING_ERROR } from '#components/shared/focus_styles';
import {
	BASE_INPUT_STYLES,
	FIELD_ERROR_BORDER,
} from '#components/shared/field_styles';

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectProps extends Omit<
	ComponentPropsWithRef<'select'>,
	'children'
> {
	options: SelectOption[];
	label?: string | ReactNode;
	error?: string;
	placeholder?: string;
	radius?: Radius;
	unstyled?: boolean;
	className?: string;
	wrapperClassName?: string;
}

export function Select({
	options,
	label,
	error,
	placeholder,
	radius = 'md',
	unstyled = false,
	className,
	wrapperClassName,
	value,
	defaultValue,
	onChange,
	id,
	...props
}: Readonly<SelectProps>) {
	const { fieldId, errorId } = useFieldIds(id);

	return (
		<Field
			fieldId={fieldId}
			errorId={errorId}
			label={label}
			error={error}
			required={props.required}
			wrapperClassName={wrapperClassName}
		>
			<select
				id={fieldId}
				className={clsx(
					'w-full disabled:opacity-50 disabled:cursor-not-allowed',
					!unstyled && [
						BASE_INPUT_STYLES,
						RADIUS_CLASSES[radius],
						'pl-3 pr-8 py-2 text-sm appearance-none bg-[length:1rem_1rem] bg-[position:right_0.5rem_center] bg-no-repeat',
						'bg-[url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")]',
					],
					!unstyled &&
						error &&
						clsx(FIELD_ERROR_BORDER, FIELD_FOCUS_RING_ERROR),
					className
				)}
				{...(value === undefined ? { defaultValue } : { value })}
				onChange={onChange}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				{...props}
			>
				{placeholder !== undefined && <option value="">{placeholder}</option>}
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</Field>
	);
}
