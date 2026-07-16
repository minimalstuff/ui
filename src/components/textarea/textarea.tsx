import clsx from 'clsx';
import {
	type ComponentPropsWithRef,
	type ReactNode,
	useId,
	useState,
} from 'react';

import { BASE_INPUT_STYLES } from '#components/input/input';
import { CharacterCount } from '#components/char_count/char_count';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	FIELD_ERROR_BORDER,
	FIELD_ERROR_TEXT,
	FIELD_LABEL_TEXT,
	FIELD_REQUIRED_MARK,
} from '#components/shared/field_styles';

interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
	label?: string | ReactNode;
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
	id = 'textarea',
	...props
}: TextareaProps) {
	const _textareaId = useId();
	const textareaId = `${id}-${_textareaId}`;

	const [uncontrolledLength, setUncontrolledLength] = useState(
		typeof defaultValue === 'string' ? defaultValue.length : 0
	);

	const currentLength =
		typeof value === 'string'
			? value.length
			: value === undefined
				? uncontrolledLength
				: 0;
	const hasCharCount =
		showCharCount && (minLength !== undefined || maxLength !== undefined);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (value === undefined) setUncontrolledLength(e.target.value.length);
		onChange?.(e);
	};

	return (
		<div className={clsx('w-full', wrapperClassName)}>
			{typeof label === 'string' ? (
				<label
					className={clsx(FIELD_LABEL_TEXT, 'block mb-1')}
					htmlFor={textareaId}
				>
					{label}
					{props.required && <span className={FIELD_REQUIRED_MARK}>*</span>}
				</label>
			) : (
				label
			)}
			<textarea
				id={textareaId}
				className={clsx(
					'w-full min-h-[80px] resize-y disabled:opacity-50 disabled:cursor-not-allowed',
					!unstyled && [
						BASE_INPUT_STYLES,
						RADIUS_CLASSES[radius],
						'px-3 py-2 text-sm',
					],
					!unstyled && error && clsx(FIELD_ERROR_BORDER, 'focus:ring-red-500'),
					className
				)}
				{...(value === undefined ? { defaultValue } : { value })}
				minLength={minLength}
				maxLength={maxLength}
				onChange={handleChange}
				{...props}
			/>
			{hasCharCount && (
				<CharacterCount
					current={currentLength}
					min={minLength}
					max={maxLength}
					showMin={minLength !== undefined}
					showMax={maxLength !== undefined}
				/>
			)}
			{error && <p className={clsx(FIELD_ERROR_TEXT, 'mt-1')}>{error}</p>}
		</div>
	);
}
