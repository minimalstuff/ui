import clsx from 'clsx';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { CharacterCount } from '#components/character_count/character_count';
import { Field } from '#components/shared/field';
import {
	BASE_INPUT_STYLES,
	FIELD_ERROR_BORDER,
} from '#components/shared/field_styles';
import { FIELD_FOCUS_RING_ERROR } from '#components/shared/focus_styles';
import { joinIds } from '#components/shared/join_ids';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { useControlledLength } from '#components/shared/use_controlled_length';
import { useFieldIds } from '#components/shared/use_field_ids';

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
	label?: string | ReactNode;
	description?: string | ReactNode;
	error?: string;
	showCharCount?: boolean;
	minLength?: number;
	maxLength?: number;
	radius?: Radius;
	unstyled?: boolean;
	className?: string;
	wrapperClassName?: string;
}

export function Textarea({
	label,
	description,
	error,
	showCharCount = false,
	minLength,
	maxLength,
	radius = 'md',
	unstyled = false,
	className,
	wrapperClassName,
	value,
	defaultValue,
	onChange,
	id,
	'aria-describedby': callerDescribedBy,
	...props
}: Readonly<TextareaProps>) {
	const { fieldId, errorId, descriptionId, characterCountId } = useFieldIds(id);
	const { length, trackLength } = useControlledLength(value, defaultValue);

	const hasCharCount =
		showCharCount && (minLength !== undefined || maxLength !== undefined);

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		trackLength(event.target.value);
		onChange?.(event);
	};

	return (
		<Field
			fieldId={fieldId}
			errorId={errorId}
			descriptionId={descriptionId}
			label={label}
			description={description}
			error={error}
			required={props.required}
			wrapperClassName={wrapperClassName}
		>
			<textarea
				id={fieldId}
				className={clsx(
					'w-full min-h-[80px] resize-y disabled:opacity-50 disabled:cursor-not-allowed',
					!unstyled && [
						BASE_INPUT_STYLES,
						RADIUS_CLASSES[radius],
						'px-3 py-2 text-sm',
					],
					!unstyled &&
						error &&
						clsx(FIELD_ERROR_BORDER, FIELD_FOCUS_RING_ERROR),
					className
				)}
				{...(value === undefined ? { defaultValue } : { value })}
				minLength={minLength}
				maxLength={maxLength}
				onChange={handleChange}
				aria-invalid={!!error}
				aria-describedby={joinIds(
					callerDescribedBy,
					Boolean(description) && descriptionId,
					error && errorId,
					hasCharCount && characterCountId
				)}
				{...props}
			/>
			{hasCharCount && (
				<CharacterCount
					id={characterCountId}
					current={length}
					min={minLength}
					max={maxLength}
					showMin={minLength !== undefined}
					showMax={maxLength !== undefined}
				/>
			)}
		</Field>
	);
}
