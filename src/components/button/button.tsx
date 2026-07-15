import clsx from 'clsx';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'subtle';
export type ButtonColor = 'primary' | 'neutral' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ColorTokens {
	solid: string;
	outline: string;
	ghost: string;
	subtle: string;
	focusOutline: string;
}

const COLOR_TOKENS: Record<ButtonColor, ColorTokens> = {
	primary: {
		solid:
			'border-transparent bg-blue-600 text-white enabled:hover:bg-blue-700 enabled:active:bg-blue-800 dark:bg-blue-500 dark:enabled:hover:bg-blue-600 dark:enabled:active:bg-blue-700',
		outline:
			'border-blue-300 bg-transparent text-blue-700 enabled:hover:bg-blue-50 enabled:active:bg-blue-100 dark:border-blue-800 dark:text-blue-400 dark:enabled:hover:bg-blue-950/40 dark:enabled:active:bg-blue-950/60',
		ghost:
			'border-transparent bg-transparent text-blue-700 enabled:hover:bg-blue-50 enabled:active:bg-blue-100 dark:text-blue-400 dark:enabled:hover:bg-blue-950/40 dark:enabled:active:bg-blue-950/60',
		subtle:
			'border-transparent bg-blue-50 text-blue-700 enabled:hover:bg-blue-100 enabled:active:bg-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:enabled:hover:bg-blue-500/20 dark:enabled:active:bg-blue-500/30',
		focusOutline: 'focus-visible:outline-blue-500',
	},
	neutral: {
		solid:
			'border-transparent bg-gray-200 text-gray-900 enabled:hover:bg-gray-300 enabled:active:bg-gray-400 dark:bg-gray-600 dark:text-gray-100 dark:enabled:hover:bg-gray-500 dark:enabled:active:bg-gray-400',
		outline:
			'border-gray-300 bg-transparent text-gray-700 enabled:hover:bg-gray-50 enabled:active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:enabled:hover:bg-gray-800/50 dark:enabled:active:bg-gray-800/80',
		ghost:
			'border-transparent bg-transparent text-gray-700 enabled:hover:bg-gray-100 enabled:active:bg-gray-200 dark:text-gray-300 dark:enabled:hover:bg-gray-700/50 dark:enabled:active:bg-gray-700/80',
		subtle:
			'border-transparent bg-gray-100 text-gray-700 enabled:hover:bg-gray-200 enabled:active:bg-gray-300 dark:bg-gray-700/50 dark:text-gray-300 dark:enabled:hover:bg-gray-600/50 dark:enabled:active:bg-gray-600/80',
		focusOutline: 'focus-visible:outline-gray-400',
	},
	danger: {
		solid:
			'border-transparent bg-red-600 text-white enabled:hover:bg-red-700 enabled:active:bg-red-800 dark:bg-red-500 dark:enabled:hover:bg-red-600 dark:enabled:active:bg-red-700',
		outline:
			'border-red-300 bg-transparent text-red-700 enabled:hover:bg-red-50 enabled:active:bg-red-100 dark:border-red-800 dark:text-red-400 dark:enabled:hover:bg-red-950/40 dark:enabled:active:bg-red-950/60',
		ghost:
			'border-transparent bg-transparent text-red-700 enabled:hover:bg-red-50 enabled:active:bg-red-100 dark:text-red-400 dark:enabled:hover:bg-red-950/40 dark:enabled:active:bg-red-950/60',
		subtle:
			'border-transparent bg-red-50 text-red-700 enabled:hover:bg-red-100 enabled:active:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:enabled:hover:bg-red-500/20 dark:enabled:active:bg-red-500/30',
		focusOutline: 'focus-visible:outline-red-500',
	},
	success: {
		solid:
			'border-transparent bg-green-600 text-white enabled:hover:bg-green-700 enabled:active:bg-green-800 dark:bg-green-500 dark:enabled:hover:bg-green-600 dark:enabled:active:bg-green-700',
		outline:
			'border-green-300 bg-transparent text-green-700 enabled:hover:bg-green-50 enabled:active:bg-green-100 dark:border-green-800 dark:text-green-400 dark:enabled:hover:bg-green-950/40 dark:enabled:active:bg-green-950/60',
		ghost:
			'border-transparent bg-transparent text-green-700 enabled:hover:bg-green-50 enabled:active:bg-green-100 dark:text-green-400 dark:enabled:hover:bg-green-950/40 dark:enabled:active:bg-green-950/60',
		subtle:
			'border-transparent bg-green-50 text-green-700 enabled:hover:bg-green-100 enabled:active:bg-green-200 dark:bg-green-500/10 dark:text-green-400 dark:enabled:hover:bg-green-500/20 dark:enabled:active:bg-green-500/30',
		focusOutline: 'focus-visible:outline-green-500',
	},
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
	xs: 'px-2 py-1 text-xs',
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-sm',
	lg: 'px-4 py-3 text-base',
};

const ICON_SIZE_CLASSES: Record<ButtonSize, string> = {
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
	size?: ButtonSize;
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
	children,
	className,
	fullWidth = false,
	loading = false,
	startIcon,
	endIcon,
	disabled,
	...props
}: ButtonProps) => {
	const tokens = COLOR_TOKENS[color];
	const iconSizeClass = ICON_SIZE_CLASSES[size];

	return (
		<button
			type="button"
			className={clsx(
				'cursor-pointer inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 enabled:active:duration-75 border enabled:active:scale-[0.95]',
				'outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2',
				'disabled:opacity-50 disabled:cursor-not-allowed',
				tokens[variant],
				tokens.focusOutline,
				SIZE_CLASSES[size],
				fullWidth && 'w-full',
				className
			)}
			disabled={disabled ?? loading}
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
