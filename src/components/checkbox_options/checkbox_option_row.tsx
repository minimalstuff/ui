import clsx from 'clsx';

import { OptionRow } from '#components/shared/option_row';
import { SELECTED_FILL } from '#components/shared/surface_tokens';
import { CheckmarkIcon } from '#components/shared/checkmark_icon';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { type CheckboxOption } from '#components/checkbox_options/checkbox_options';
import { optionIndicatorBorderClasses } from '#components/shared/option_card_styles';

interface CheckboxOptionRowProps {
	option: CheckboxOption;
	optionId: string;
	descriptionId: string;
	name: string;
	orientation: 'vertical' | 'horizontal';
	isSelected: boolean;
	isDisabled: boolean;
	error: string | undefined;
	radius: Radius;
	unstyled: boolean;
	className: string | undefined;
	onToggle: (value: string) => void;
}

/** One option row inside `CheckboxOptions`. Not exported: rendering it standalone makes no sense outside that group. */
export function CheckboxOptionRow({
	option,
	optionId,
	descriptionId,
	name,
	orientation,
	isSelected,
	isDisabled,
	error,
	radius,
	unstyled,
	className,
	onToggle,
}: Readonly<CheckboxOptionRowProps>) {
	const isError = Boolean(error);

	return (
		<OptionRow
			item={option}
			htmlFor={optionId}
			descriptionId={descriptionId}
			orientation={orientation}
			isSelected={isSelected}
			isDisabled={isDisabled}
			isError={isError}
			radius={radius}
			unstyled={unstyled}
			className={className}
			control={
				<input
					type="checkbox"
					id={optionId}
					name={name}
					value={option.value}
					checked={isSelected}
					onChange={() => onToggle(option.value)}
					disabled={isDisabled}
					aria-invalid={error ? true : undefined}
					aria-describedby={option.description ? descriptionId : undefined}
					className="sr-only"
				/>
			}
			indicator={
				<span
					className={clsx(
						'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border-2 transition-colors duration-150',
						RADIUS_CLASSES.sm,
						optionIndicatorBorderClasses({ isSelected, isError }),
						isSelected &&
							(isError ? 'bg-red-500 dark:bg-red-400' : SELECTED_FILL)
					)}
					aria-hidden
				>
					{isSelected && <CheckmarkIcon />}
				</span>
			}
		/>
	);
}
