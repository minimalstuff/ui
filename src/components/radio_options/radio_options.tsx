import clsx from 'clsx';
import { type ComponentPropsWithRef } from 'react';

import { joinIds } from '#components/shared/join_ids';
import { type Radius } from '#components/shared/radius';
import { FieldError } from '#components/shared/field_error';
import { useFieldIds } from '#components/shared/use_field_ids';
import { type ChoiceOption } from '#components/shared/option_card_styles';
import { RadioOptionRow } from '#components/radio_options/radio_option_row';
import { useControlledState } from '#components/shared/use_controlled_state';
import {
	FIELD_LABEL_TEXT,
	FIELD_REQUIRED_MARK,
} from '#components/shared/field_styles';

export type RadioOption = ChoiceOption;

export interface RadioOptionsProps extends Omit<
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
	'aria-describedby': callerDescribedBy,
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
			aria-describedby={joinIds(callerDescribedBy, error && errorId)}
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
					<RadioOptionRow
						key={option.value}
						option={option}
						optionId={`${groupId}-${index}`}
						descriptionId={`${groupId}-${index}-desc`}
						name={name}
						orientation={orientation}
						isSelected={selectedValue === option.value}
						isDisabled={disabled === true || option.disabled === true}
						isFirstOption={index === 0}
						required={required}
						error={error}
						radius={radius}
						unstyled={unstyled}
						className={className}
						onSelect={handleChange}
					/>
				))}
			</div>

			<FieldError id={errorId} error={error} className="mt-2" />
		</fieldset>
	);
}
