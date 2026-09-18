import clsx from 'clsx';

import { type Radius } from '#components/shared/radius';
import { OptionRow } from '#components/shared/option_row';
import { SELECTED_FILL } from '#components/shared/surface_tokens';
import { type RadioOption } from '#components/radio_options/radio_options';
import { optionIndicatorBorderClasses } from '#components/shared/option_card_styles';

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
	className: string | undefined;
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
	className,
	onSelect,
}: Readonly<RadioOptionRowProps>) {
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
			}
			indicator={
				<span
					className={clsx(
						'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150',
						optionIndicatorBorderClasses({ isSelected, isError })
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
			}
		/>
	);
}
