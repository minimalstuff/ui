import clsx from 'clsx';
import { type ComponentPropsWithRef } from 'react';

import { type Radius } from '#components/shared/radius';
import { FieldError } from '#components/shared/field_error';
import { useFieldIds } from '#components/shared/use_field_ids';
import { type ChoiceOption } from '#components/shared/option_card_styles';
import { useControlledState } from '#components/shared/use_controlled_state';
import { CheckboxOptionRow } from '#components/checkbox_options/checkbox_option_row';
import {
	FIELD_LABEL_TEXT,
	FIELD_REQUIRED_MARK,
} from '#components/shared/field_styles';

export type CheckboxOption = ChoiceOption;

export interface CheckboxOptionsProps extends Omit<
	ComponentPropsWithRef<'fieldset'>,
	'onChange'
> {
	options: string[] | CheckboxOption[];
	orientation?: 'vertical' | 'horizontal';
	values?: readonly string[];
	defaultValues?: readonly string[];
	onChange?: (values: readonly string[]) => void;
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

/**
 * Toggles `optionValue` in `selectedValues` and reorders the result to match
 * `normalizedOptions`'s order, so the emitted array reflects option order
 * rather than click order.
 */
function toggleOptionValue(
	normalizedOptions: readonly CheckboxOption[],
	selectedValues: readonly string[],
	optionValue: string
): readonly string[] {
	const nextSelectedValues = selectedValues.includes(optionValue)
		? selectedValues.filter((value) => value !== optionValue)
		: [...selectedValues, optionValue];

	return normalizedOptions
		.map((option) => option.value)
		.filter((value) => nextSelectedValues.includes(value));
}

export function CheckboxOptions({
	options,
	orientation = 'vertical',
	values,
	defaultValues,
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
}: Readonly<CheckboxOptionsProps>) {
	const { fieldId: groupId, errorId } = useFieldIds(id);
	const name = nameProp ?? groupId;

	const [selectedValues, setSelectedValues] = useControlledState(
		values,
		defaultValues ?? []
	);

	const normalizedOptions: CheckboxOption[] = options.map((opt) =>
		typeof opt === 'string' ? { value: opt, label: opt } : opt
	);

	const handleToggle = (optionValue: string) => {
		const nextValues = toggleOptionValue(
			normalizedOptions,
			selectedValues,
			optionValue
		);
		setSelectedValues(nextValues);
		onChange?.(nextValues);
	};

	return (
		<fieldset
			className={clsx('m-0 border-0 p-0', wrapperClassName)}
			disabled={disabled}
			aria-describedby={error ? errorId : undefined}
			{...props}
		>
			{label && (
				<legend className={clsx(FIELD_LABEL_TEXT, 'mb-2')}>
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
				{normalizedOptions.map((option, index) => (
					<CheckboxOptionRow
						key={option.value}
						option={option}
						optionId={`${groupId}-${index}`}
						descriptionId={`${groupId}-${index}-desc`}
						name={name}
						orientation={orientation}
						isSelected={selectedValues.includes(option.value)}
						isDisabled={disabled === true || option.disabled === true}
						error={error}
						radius={radius}
						unstyled={unstyled}
						className={className}
						onToggle={handleToggle}
					/>
				))}
			</div>

			<FieldError id={errorId} error={error} className="mt-2" />
		</fieldset>
	);
}
