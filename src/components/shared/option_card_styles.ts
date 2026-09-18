import clsx from 'clsx';

import { FIELD_ERROR_BORDER } from '#components/shared/field_styles';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	CONTROL_BORDER,
	SURFACE_BORDER,
} from '#components/shared/surface_tokens';
import {
	CONTROL_FOCUS_RING,
	CONTROL_FOCUS_RING_COLOR,
	CONTROL_FOCUS_RING_ERROR_COLOR,
} from '#components/shared/focus_styles';

export interface OptionItem {
	value: string;
	label: string;
	description?: string;
	icon?: string;
	disabled?: boolean;
}

/**
 * Card chrome shared by every option-card row (`RadioOptions`,
 * `CheckboxOptions`, and `Checkbox`'s `card` variant). Layout concerns that
 * depend on where the card sits (e.g. `orientation === 'horizontal' &&
 * 'flex-1'`) are left to the caller.
 */
export function optionCardClasses(options: {
	isSelected: boolean;
	isError: boolean;
	isDisabled: boolean;
	radius: Radius;
	unstyled: boolean;
}): string {
	const { isSelected, isError, isDisabled, radius, unstyled } = options;

	return clsx(
		'flex cursor-pointer items-start gap-3 transition-colors duration-150',
		CONTROL_FOCUS_RING,
		isError ? CONTROL_FOCUS_RING_ERROR_COLOR : CONTROL_FOCUS_RING_COLOR,
		!unstyled && [
			RADIUS_CLASSES[radius],
			'border px-3 py-2.5',
			isSelected
				? isError
					? clsx(FIELD_ERROR_BORDER, 'bg-red-50 dark:bg-red-950/20')
					: 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/25'
				: isError
					? 'border-red-300 bg-white dark:border-red-800/50 dark:bg-gray-800/50'
					: clsx(
							SURFACE_BORDER,
							'bg-gray-50 hover:border-gray-300 hover:bg-white dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800'
						),
		],
		isDisabled && 'cursor-not-allowed opacity-50'
	);
}

/** Border/color logic for an option's selection indicator. The caller adds the shape classes (e.g. `rounded-full border-2` vs `rounded-sm border-2`). */
export function optionIndicatorBorderClasses(options: {
	isSelected: boolean;
	isError: boolean;
}): string {
	const { isSelected, isError } = options;

	if (isSelected) {
		return isError
			? FIELD_ERROR_BORDER
			: 'border-blue-600 dark:border-blue-500';
	}
	return isError ? 'border-red-400 dark:border-red-600' : CONTROL_BORDER;
}
