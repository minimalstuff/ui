import clsx from 'clsx';

import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { type RadioOption } from '#components/radio_options/radio_options';
import {
	FIELD_DESCRIPTION_TEXT,
	FIELD_ERROR_BORDER,
} from '#components/shared/field_styles';
import {
	CONTROL_BORDER,
	SELECTED_FILL,
	SURFACE_BORDER,
} from '#components/shared/surface_tokens';
import {
	CONTROL_FOCUS_RING,
	CONTROL_FOCUS_RING_COLOR,
	CONTROL_FOCUS_RING_ERROR_COLOR,
} from '#components/shared/focus_styles';

interface RadioOptionRowProps {
	option: RadioOption;
	optionId: string;
	descriptionId: string;
	name: string;
	orientation: 'vertical' | 'horizontal';
	isSelected: boolean;
	isDisabled: boolean;
	isFirstOption: boolean;
	required: boolean | undefined;
	error: string | undefined;
	radius: Radius;
	unstyled: boolean;
	onSelect: (value: string) => void;
}

/** One option row inside `RadioOptions`. Not exported: rendering it standalone makes no sense outside that group. */
export function RadioOptionRow({
	option,
	optionId,
	descriptionId,
	name,
	orientation,
	isSelected,
	isDisabled,
	isFirstOption,
	required,
	error,
	radius,
	unstyled,
	onSelect,
}: Readonly<RadioOptionRowProps>) {
	return (
		<label
			htmlFor={optionId}
			className={clsx(
				'flex cursor-pointer items-start gap-3 transition-colors duration-150',
				orientation === 'horizontal' && 'flex-1',
				CONTROL_FOCUS_RING,
				error ? CONTROL_FOCUS_RING_ERROR_COLOR : CONTROL_FOCUS_RING_COLOR,
				!unstyled && [
					RADIUS_CLASSES[radius],
					'border px-3 py-2.5',
					isSelected
						? error
							? clsx(FIELD_ERROR_BORDER, 'bg-red-50 dark:bg-red-950/20')
							: 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/25'
						: error
							? 'border-red-300 bg-white dark:border-red-800/50 dark:bg-gray-800/50'
							: clsx(
									SURFACE_BORDER,
									'bg-gray-50 hover:border-gray-300 hover:bg-white dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800'
								),
				],
				isDisabled && 'cursor-not-allowed opacity-50'
			)}
		>
			<input
				type="radio"
				id={optionId}
				name={name}
				value={option.value}
				checked={isSelected}
				onChange={() => onSelect(option.value)}
				disabled={isDisabled}
				required={required && isFirstOption}
				aria-invalid={error ? true : undefined}
				aria-describedby={option.description ? descriptionId : undefined}
				className="sr-only"
			/>

			<span
				className={clsx(
					'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150',
					isSelected
						? error
							? FIELD_ERROR_BORDER
							: 'border-blue-600 dark:border-blue-500'
						: error
							? 'border-red-400 dark:border-red-600'
							: CONTROL_BORDER
				)}
				aria-hidden
			>
				{isSelected && (
					<span
						className={clsx(
							'h-2 w-2 rounded-full',
							error ? 'bg-red-500 dark:bg-red-400' : SELECTED_FILL
						)}
					/>
				)}
			</span>

			<span className="flex min-w-0 flex-col">
				<span className="flex items-center gap-1.5">
					{option.icon && (
						<span
							className={clsx(
								option.icon,
								'h-4 w-4 shrink-0',
								isSelected
									? error
										? 'text-red-600 dark:text-red-400'
										: 'text-blue-600 dark:text-blue-400'
									: 'text-gray-500 dark:text-gray-400'
							)}
							aria-hidden
						/>
					)}
					<span
						className={clsx(
							'select-none text-sm font-medium',
							isSelected
								? error
									? 'text-red-700 dark:text-red-300'
									: 'text-blue-700 dark:text-blue-300'
								: 'text-gray-700 dark:text-gray-300'
						)}
					>
						{option.label}
					</span>
				</span>
				{option.description && (
					<span
						id={descriptionId}
						className={clsx(FIELD_DESCRIPTION_TEXT, 'mt-0.5')}
					>
						{option.description}
					</span>
				)}
			</span>
		</label>
	);
}
