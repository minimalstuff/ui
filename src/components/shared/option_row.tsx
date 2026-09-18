import clsx from 'clsx';
import { type ReactNode } from 'react';

import { type Radius } from '#components/shared/radius';
import { FIELD_DESCRIPTION_TEXT } from '#components/shared/field_styles';
import {
	optionCardClasses,
	type ChoiceOption,
} from '#components/shared/option_card_styles';

interface OptionRowProps {
	item: ChoiceOption;
	htmlFor: string;
	descriptionId: string;
	orientation: 'vertical' | 'horizontal';
	isSelected: boolean;
	isDisabled: boolean;
	isError: boolean;
	radius: Radius;
	unstyled: boolean;
	className: string | undefined;
	control: ReactNode;
	indicator: ReactNode;
}

/**
 * Presentational option-card row shared by RadioOptions and CheckboxOptions.
 * Takes the control and indicator markup as props since those two group types
 * render different inputs.
 */
export function OptionRow({
	item,
	htmlFor,
	descriptionId,
	orientation,
	isSelected,
	isDisabled,
	isError,
	radius,
	unstyled,
	className,
	control,
	indicator,
}: Readonly<OptionRowProps>) {
	return (
		<label
			htmlFor={htmlFor}
			className={clsx(
				optionCardClasses({
					isSelected,
					isError,
					isDisabled,
					radius,
					unstyled,
				}),
				orientation === 'horizontal' && 'flex-1',
				className
			)}
		>
			{control}
			{indicator}

			<span className="flex min-w-0 flex-col">
				<span className="flex items-center gap-1.5">
					{item.icon && (
						<span
							className={clsx(
								item.icon,
								'h-4 w-4 shrink-0',
								isSelected
									? isError
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
								? isError
									? 'text-red-700 dark:text-red-300'
									: 'text-blue-700 dark:text-blue-300'
								: 'text-gray-700 dark:text-gray-300'
						)}
					>
						{item.label}
					</span>
				</span>
				{item.description && (
					<span
						id={descriptionId}
						className={clsx(FIELD_DESCRIPTION_TEXT, 'mt-0.5')}
					>
						{item.description}
					</span>
				)}
			</span>
		</label>
	);
}
