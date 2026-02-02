import { CharacterCount } from '#components/char_count/char_count';
import { BASE_INPUT_STYLES } from '#components/input/input';
import clsx from 'clsx';
import {
	type ReactNode,
	type TextareaHTMLAttributes,
	useId,
	useState,
} from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string | ReactNode;
	error?: string;
	showCharCount?: boolean;
	minLength?: number;
	maxLength?: number;
	className?: string;
	wrapperClassName?: string;
}

export function Textarea({
	label,
	error,
	showCharCount = false,
	minLength,
	maxLength,
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
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					htmlFor={textareaId}
				>
					{label}
					{props.required && (
						<span className="text-red-500 dark:text-red-400 ml-1">*</span>
					)}
				</label>
			) : (
				label
			)}
			<textarea
				id={textareaId}
				className={clsx(
					BASE_INPUT_STYLES,
					'px-3 py-2 text-sm min-h-[80px] resize-y',
					error && 'border-red-500 dark:border-red-400 focus:ring-red-500',
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
			{error && (
				<p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
			)}
		</div>
	);
}
