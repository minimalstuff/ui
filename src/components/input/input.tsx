import clsx from 'clsx';
import {
	type ComponentPropsWithRef,
	type ReactNode,
	useId,
	useState,
} from 'react';

import { CharacterCount } from '../char_count/char_count';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	FIELD_ERROR_TEXT,
	FIELD_LABEL_TEXT,
	FIELD_REQUIRED_MARK,
} from '#components/shared/field_styles';

export const BASE_INPUT_STYLES =
	'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

interface InputProps extends ComponentPropsWithRef<'input'> {
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

export function Input({
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
	id = 'input',
	...props
}: InputProps) {
	const _inputId = useId();
	const inputId = `${id}-${_inputId}`;

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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (value === undefined) setUncontrolledLength(e.target.value.length);
		onChange?.(e);
	};

	return (
		<div className={clsx('w-full', wrapperClassName)}>
			{typeof label === 'string' ? (
				<label
					className={clsx(FIELD_LABEL_TEXT, 'block mb-1')}
					htmlFor={inputId}
				>
					{label}
					{props.required && <span className={FIELD_REQUIRED_MARK}>*</span>}
				</label>
			) : (
				label
			)}
			<input
				id={inputId}
				className={clsx(
					'w-full disabled:opacity-50 disabled:cursor-not-allowed',
					!unstyled && [
						BASE_INPUT_STYLES,
						RADIUS_CLASSES[radius],
						'px-3 py-2 text-sm',
					],
					!unstyled &&
						error &&
						'border-red-500 dark:border-red-400 focus:ring-red-500',
					className
				)}
				value={value}
				defaultValue={defaultValue}
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
