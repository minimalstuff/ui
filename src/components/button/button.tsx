import clsx from 'clsx';
import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';

import { buttonClassName } from '#components/button/button_class_name';
import {
	type ButtonColor,
	type ButtonVariant,
} from '#components/shared/button_styles';
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
			unstyled?: false;
			variant?: ButtonVariant;
			color?: ButtonColor;
			radius?: Radius;
	  };

export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
	children: ReactNode;
	size?: ControlSize;
	className?: string;
	fullWidth?: boolean;
	/**
	 * Shows a spinner, marks the button busy and blocks activation (click, Enter,
	 * Space, form submit). Unlike `disabled`, the button keeps focus and stays in
	 * the tab order, exposed as `aria-disabled`.
	 */
	loading?: boolean;
	/**
	 * Turns the button into a toggle: sets `aria-pressed` and a pressed look (dark fill and inset ring).
	 * Leave it `undefined` for a regular button (no attribute).
	 */
	pressed?: boolean;
	startIcon?: string;
	endIcon?: string;
} & ButtonStyle;

// Widens `ButtonStyle`'s two branches to all-optional for destructuring below:
// the public `ButtonProps` union still rejects `unstyled` combined with the
// other style props at every call site, this is purely an internal ergonomics
// bridge past that same union once we're inside the implementation.
type FlatButtonStyle = {
	unstyled?: boolean;
	variant?: ButtonVariant;
	color?: ButtonColor;
	radius?: Radius;
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
		onClick,
		'aria-label': ariaLabel,
		...props
	} = buttonProps as ButtonProps & FlatButtonStyle;
	const labels = useLabels();
	const hasAriaLabel = ariaLabel !== undefined;
	const accessibleLabel =
		loading && hasAriaLabel ? `${ariaLabel} ${labels.loading}` : ariaLabel;
	const iconSizeClass = ICON_SIZE_CLASSES[size];

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		if (loading) {
			event.preventDefault();
			return;
		}
		onClick?.(event);
	};

	return (
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
			aria-disabled={(loading && !disabled) || undefined}
			aria-busy={loading || undefined}
			aria-pressed={pressed}
			aria-label={accessibleLabel}
			{...props}
			onClick={handleClick}
		>
			{loading && (
				<span
					className={clsx('i-svg-spinners-3-dots-fade', iconSizeClass)}
					aria-hidden="true"
				/>
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
}
