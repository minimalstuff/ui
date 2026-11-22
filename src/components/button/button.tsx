import clsx from 'clsx';
import {
	type ComponentPropsWithRef,
	type MouseEvent,
	type ReactNode,
	useId,
} from 'react';

import { buttonClassName } from '#components/button/button_class_name';
import {
	type ButtonColor,
	type ButtonVariant,
} from '#components/shared/button_styles';
import { FieldDescription } from '#components/shared/field_description';
import { joinIds } from '#components/shared/join_ids';
import { type Radius } from '#components/shared/radius';
import { type ControlSize } from '#components/shared/sizes';
import { useLabels } from '#components/ui_provider/use_labels';

export type {
	ButtonColor,
	ButtonVariant,
} from '#components/shared/button_styles';

const ICON_SIZE_CLASSES: Record<ControlSize, string> = {
	xs: 'w-3.5 h-3.5',
	sm: 'w-4 h-4',
	md: 'w-4 h-4',
	lg: 'w-5 h-5',
};

type ButtonStyle =
	| { unstyled: true }
	| {
			unstyled?: false | undefined;
			variant?: ButtonVariant | undefined;
			color?: ButtonColor | undefined;
			radius?: Radius | undefined;
	  };

export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
	children: ReactNode;
	size?: ControlSize | undefined;
	className?: string | undefined;
	fullWidth?: boolean | undefined;
	/**
	 * Shows a spinner, marks the button busy and blocks activation (click, Enter,
	 * Space, form submit). Unlike `disabled`, the button keeps focus and stays in
	 * the tab order, exposed as `aria-disabled`.
	 */
	loading?: boolean | undefined;
	/**
	 * Keeps the button focusable but inert while the user cannot act yet, and
	 * says why: the reason is shown below the button and is its accessible
	 * description. Activation (click, Enter, Space, form submit) is blocked and
	 * the button is exposed as `aria-disabled`. Use it instead of `disabled`
	 * when the user needs to know why. An empty string means not blocked, and
	 * `disabled` takes precedence (native disabled, no hint). Wraps the button
	 * and the hint in an extra element only while a reason is set.
	 */
	disabledReason?: string | undefined;
	/**
	 * Turns the button into a toggle: sets `aria-pressed` and a pressed look (dark fill and inset ring).
	 * Leave it `undefined` for a regular button (no attribute).
	 */
	pressed?: boolean | undefined;
	startIcon?: string | undefined;
	endIcon?: string | undefined;
} & ButtonStyle;

// Widens `ButtonStyle`'s two branches to all-optional for destructuring below:
// the public `ButtonProps` union still rejects `unstyled` combined with the
// other style props at every call site, this is purely an internal ergonomics
// bridge past that same union once we're inside the implementation.
type FlatButtonStyle = {
	unstyled?: boolean | undefined;
	variant?: ButtonVariant | undefined;
	color?: ButtonColor | undefined;
	radius?: Radius | undefined;
};

export function Button(buttonProps: Readonly<ButtonProps>) {
	const {
		unstyled = false,
		variant = 'solid',
		color = 'primary',
		size = 'md',
		radius = 'md',
		children,
		className,
		fullWidth = false,
		loading = false,
		pressed,
		startIcon,
		endIcon,
		disabled,
		disabledReason,
		onClick,
		'aria-describedby': ariaDescribedby,
		'aria-label': ariaLabel,
		...props
	} = buttonProps as ButtonProps & FlatButtonStyle;
	const labels = useLabels();
	const hasAriaLabel = ariaLabel !== undefined;
	const accessibleLabel =
		loading && hasAriaLabel ? `${ariaLabel} ${labels.loading}` : ariaLabel;
	const iconSizeClass = ICON_SIZE_CLASSES[size];
	const reasonId = useId();
	const hasReason = !disabled && Boolean(disabledReason);
	const isBlocked = loading || hasReason;

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		if (isBlocked) {
			event.preventDefault();
			return;
		}
		onClick?.(event);
	};

	const button = (
		<button
			type="button"
			className={buttonClassName({
				variant,
				color,
				size,
				radius,
				fullWidth,
				pressed,
				unstyled,
				className,
			})}
			disabled={disabled}
			aria-disabled={(isBlocked && !disabled) || undefined}
			aria-busy={loading || undefined}
			aria-pressed={pressed}
			aria-label={accessibleLabel}
			aria-describedby={joinIds(ariaDescribedby, hasReason && reasonId)}
			{...props}
			onClick={handleClick}
		>
			{loading && (
				<>
					<span
						className={clsx(
							'i-svg-spinners-3-dots-fade ms-spinner-animated',
							iconSizeClass
						)}
						aria-hidden="true"
					/>
					<span
						className={clsx('i-mdi-loading ms-spinner-static', iconSizeClass)}
						aria-hidden="true"
					/>
				</>
			)}
			{!loading && startIcon && (
				<span className={clsx(startIcon, iconSizeClass)} aria-hidden="true" />
			)}
			{children}
			{loading && !hasAriaLabel && (
				<span className="sr-only">{labels.loading}</span>
			)}
			{!loading && endIcon && (
				<span className={clsx(endIcon, iconSizeClass)} aria-hidden="true" />
			)}
		</button>
	);

	if (!hasReason) return button;

	return (
		<div
			className={clsx(
				'gap-1',
				fullWidth ? 'flex w-full flex-col' : 'inline-flex flex-col items-start'
			)}
		>
			{button}
			<FieldDescription id={reasonId} description={disabledReason} />
		</div>
	);
}
