import clsx from 'clsx';
import {
	type ComponentPropsWithRef,
	type ReactNode,
	useMemo,
	useRef,
} from 'react';

import { FieldDescription } from '#components/shared/field_description';
import { FieldError } from '#components/shared/field_error';
import { FIELD_LABEL_TEXT } from '#components/shared/field_styles';
import {
	CONTROL_FOCUS_RING,
	CONTROL_FOCUS_RING_COLOR,
} from '#components/shared/focus_styles';
import { joinIds } from '#components/shared/join_ids';
import { RequiredMark } from '#components/shared/required_mark';
import { SELECTED_FILL } from '#components/shared/surface_tokens';
import { useControlledState } from '#components/shared/use_controlled_state';
import { useFieldIds } from '#components/shared/use_field_ids';
import { useWarnUnnamedInput } from '#components/shared/use_warn_unnamed';
import { mergeRefs } from '#lib/merge_refs';

const UNLABELLED_INPUT_CLASSES =
	'absolute -inset-0.5 m-0 h-6 w-11 appearance-none opacity-0';

/** Input classes: visually hidden next to a label, otherwise transparent and stretched over the track (44x24 target). */
function getInputClassName(hasLabel: boolean, isDisabled: boolean): string {
	if (hasLabel) return 'sr-only';

	return clsx(
		UNLABELLED_INPUT_CLASSES,
		isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
	);
}

/** A `label` when the control has one, a plain `div` otherwise so the input gets no empty extra label. */
function ControlRow({
	htmlFor,
	className,
	children,
}: Readonly<{
	htmlFor: string | undefined;
	className: string;
	children: ReactNode;
}>) {
	if (htmlFor === undefined) return <div className={className}>{children}</div>;

	return (
		<label htmlFor={htmlFor} className={className}>
			{children}
		</label>
	);
}

export interface SwitchProps extends Omit<
	ComponentPropsWithRef<'input'>,
	'type' | 'className'
> {
	label?: string | ReactNode;
	description?: string | ReactNode;
	error?: string;
	unstyled?: boolean;
	fullWidth?: boolean;
	className?: string;
	wrapperClassName?: string;
}

export function Switch({
	label,
	description,
	error,
	unstyled = false,
	fullWidth = false,
	className,
	wrapperClassName,
	checked,
	defaultChecked = false,
	onChange,
	id,
	'aria-describedby': callerDescribedBy,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	ref,
	...props
}: Readonly<SwitchProps>) {
	const { fieldId: switchId, errorId, descriptionId } = useFieldIds(id);
	const [isChecked, setIsChecked] = useControlledState(checked, defaultChecked);
	const inputRef = useRef<HTMLInputElement>(null);
	const hasLabel = Boolean(label);
	const describedBy = joinIds(
		callerDescribedBy,
		Boolean(description) && descriptionId,
		error && errorId
	);

	useWarnUnnamedInput(
		'Switch',
		inputRef,
		Boolean(label) ||
			Boolean(ariaLabel?.trim()) ||
			Boolean(ariaLabelledBy?.trim())
	);

	const mergedInputRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(event.target.checked);
		onChange?.(event);
	};

	return (
		<div className={clsx(fullWidth ? 'w-full' : 'w-fit', wrapperClassName)}>
			<ControlRow
				htmlFor={hasLabel ? switchId : undefined}
				className={clsx(
					'flex items-center gap-3 cursor-pointer',
					props.disabled && 'cursor-not-allowed opacity-50'
				)}
			>
				<span
					className={clsx(
						'relative inline-flex w-11 shrink-0',
						'transition-colors duration-200 ease-in-out',
						CONTROL_FOCUS_RING,
						CONTROL_FOCUS_RING_COLOR,
						!unstyled && [
							'rounded-full border-2 border-transparent',
							isChecked ? SELECTED_FILL : 'bg-gray-200 dark:bg-gray-600',
							error && 'ring-2 ring-red-500 dark:ring-red-400',
						],
						className
					)}
				>
					<input
						type="checkbox"
						role="switch"
						ref={mergedInputRef}
						id={switchId}
						className={getInputClassName(hasLabel, props.disabled === true)}
						checked={isChecked}
						onChange={handleChange}
						aria-invalid={!!error}
						aria-describedby={describedBy}
						aria-label={ariaLabel}
						aria-labelledby={ariaLabelledBy}
						{...props}
					/>
					<span
						className={clsx(
							'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0',
							'ms-switch-thumb-transition',
							isChecked ? 'translate-x-5.25' : 'translate-x-0'
						)}
						aria-hidden
					/>
				</span>
				{label && (
					<>
						{typeof label === 'string' ? (
							<span className={clsx(FIELD_LABEL_TEXT, 'select-none')}>
								{label}
								{props.required && <RequiredMark />}
							</span>
						) : (
							<>
								{label}
								{props.required && <RequiredMark />}
							</>
						)}
					</>
				)}
			</ControlRow>
			<FieldDescription
				id={descriptionId}
				description={description}
				className="mt-1 ml-14"
			/>
			<FieldError id={errorId} error={error} className="mt-1 ml-14" />
		</div>
	);
}
