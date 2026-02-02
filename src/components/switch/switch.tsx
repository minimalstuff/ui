import clsx from 'clsx';
import {
	type InputHTMLAttributes,
	type ReactNode,
	useId,
	useState,
} from 'react';

interface SwitchProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type' | 'className'
> {
	label?: string | ReactNode;
	error?: string;
	className?: string;
	wrapperClassName?: string;
}

export function Switch({
	label,
	error,
	className,
	wrapperClassName,
	checked,
	defaultChecked = false,
	onChange,
	id = 'switch',
	...props
}: SwitchProps) {
	const _switchId = useId();
	const switchId = `${id}-${_switchId}`;
	const [internalChecked, setInternalChecked] = useState(defaultChecked);
	const isControlled = checked !== undefined;
	const isChecked = isControlled ? checked : internalChecked;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isControlled) setInternalChecked(e.target.checked);
		onChange?.(e);
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
						'relative inline-flex w-11 shrink-0 rounded-full border-2 border-transparent',
						'transition-colors duration-200 ease-in-out',
						'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
						'disabled:opacity-50',
						isChecked
							? 'bg-blue-600 dark:bg-blue-500'
							: 'bg-gray-200 dark:bg-gray-600',
						error && 'ring-2 ring-red-500 dark:ring-red-400',
						className
					)}
				>
					<input
						type="checkbox"
						role="switch"
						id={switchId}
						className="sr-only"
						checked={checked}
						defaultChecked={defaultChecked}
						onChange={handleChange}
						aria-invalid={!!error}
						aria-describedby={error ? `${switchId}-error` : undefined}
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
							<span className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
								{label}
								{props.required && (
									<span className="text-red-500 dark:text-red-400 ml-1">*</span>
								)}
							</span>
						) : (
							<>
								{label}
								{props.required && (
									<span className="text-red-500 dark:text-red-400 ml-1">*</span>
								)}
							</>
						)}
					</>
				)}
			</label>
			{error && (
				<p
					id={`${switchId}-error`}
					className="text-xs text-red-600 dark:text-red-400 mt-1 ml-14"
					role="alert"
				>
					{error}
				</p>
			)}
		</div>
	);
}
