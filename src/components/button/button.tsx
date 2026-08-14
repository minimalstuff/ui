import clsx from 'clsx';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { type ControlSize } from '#components/shared/sizes';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	BUTTON_COLOR_TOKENS,
	BUTTON_INTERACTIVE_CLASSES,
	BUTTON_LAYOUT_CLASSES,
	type ButtonColor,
	type ButtonVariant,
} from '#components/shared/button_styles';

export type {
	ButtonColor,
	ButtonVariant,
} from '#components/shared/button_styles';

const SIZE_CLASSES: Record<ControlSize, string> = {
	xs: 'px-2 py-1 text-xs',
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-sm',
	lg: 'px-4 py-3 text-base',
};

const ICON_SIZE_CLASSES: Record<ControlSize, string> = {
	xs: 'w-3.5 h-3.5',
	sm: 'w-4 h-4',
	md: 'w-4 h-4',
	lg: 'w-5 h-5',
};

interface ButtonProps extends Omit<
	ComponentPropsWithRef<'button'>,
	'children'
> {
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ControlSize;
	radius?: Radius;
	children: ReactNode;
	className?: string;
	fullWidth?: boolean;
	loading?: boolean;
	startIcon?: string;
	endIcon?: string;
}

export const Button = ({
	variant = 'solid',
	color = 'primary',
	size = 'md',
	radius = 'md',
	children,
	className,
	fullWidth = false,
	loading = false,
	startIcon,
	endIcon,
	disabled,
	...props
}: ButtonProps) => {
	const tokens = BUTTON_COLOR_TOKENS[color];
	const iconSizeClass = ICON_SIZE_CLASSES[size];

	return (
		<button
			type="button"
			className={clsx(
				BUTTON_LAYOUT_CLASSES,
				variant !== 'unstyled' && [
					BUTTON_INTERACTIVE_CLASSES,
					'gap-2 font-medium border',
					RADIUS_CLASSES[radius],
					SIZE_CLASSES[size],
					tokens[variant],
					tokens.focusOutline,
				],
				fullWidth && 'w-full',
				className
			)}
			disabled={disabled ?? loading}
			aria-busy={loading || undefined}
			{...props}
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
			{!loading && endIcon && (
				<span className={clsx(endIcon, iconSizeClass)} aria-hidden="true" />
			)}
		</button>
	);
};
