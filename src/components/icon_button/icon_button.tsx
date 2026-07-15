import clsx from 'clsx';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import type { ButtonColor, ButtonVariant } from '#components/button/button';

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
			'bg-blue-600 text-white enabled:hover:bg-blue-700 enabled:active:bg-blue-800 dark:bg-blue-500 dark:enabled:hover:bg-blue-600 dark:enabled:active:bg-blue-700',
		outline:
			'border border-blue-300 text-blue-700 enabled:hover:bg-blue-50 enabled:active:bg-blue-100 dark:border-blue-800 dark:text-blue-400 dark:enabled:hover:bg-blue-950/40 dark:enabled:active:bg-blue-950/60',
		ghost:
			'text-blue-700 enabled:hover:bg-blue-50 enabled:active:bg-blue-100 dark:text-blue-400 dark:enabled:hover:bg-blue-950/40 dark:enabled:active:bg-blue-950/60',
		subtle:
			'bg-blue-50 text-blue-700 enabled:hover:bg-blue-100 enabled:active:bg-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:enabled:hover:bg-blue-500/20 dark:enabled:active:bg-blue-500/30',
		focusOutline: 'focus-visible:outline-blue-500',
	},
	neutral: {
		solid:
			'bg-gray-200 text-gray-900 enabled:hover:bg-gray-300 enabled:active:bg-gray-400 dark:bg-gray-600 dark:text-gray-100 dark:enabled:hover:bg-gray-500 dark:enabled:active:bg-gray-400',
		outline:
			'border border-gray-300 text-gray-600 enabled:hover:bg-gray-50 enabled:active:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:enabled:hover:bg-gray-800/50 dark:enabled:active:bg-gray-800/80',
		ghost:
			'text-gray-600 enabled:hover:bg-gray-100 enabled:active:bg-gray-200 dark:text-gray-400 dark:enabled:hover:bg-gray-800 dark:enabled:active:bg-gray-700',
		subtle:
			'text-gray-500 enabled:hover:text-gray-700 enabled:hover:bg-gray-100 enabled:active:bg-gray-200 dark:text-gray-500 dark:enabled:hover:text-gray-300 dark:enabled:hover:bg-gray-800/50',
		focusOutline: 'focus-visible:outline-gray-400',
	},
	danger: {
		solid:
			'bg-red-600 text-white enabled:hover:bg-red-700 enabled:active:bg-red-800 dark:bg-red-500 dark:enabled:hover:bg-red-600 dark:enabled:active:bg-red-700',
		outline:
			'border border-red-300 text-red-700 enabled:hover:bg-red-50 enabled:active:bg-red-100 dark:border-red-800 dark:text-red-400 dark:enabled:hover:bg-red-950/40 dark:enabled:active:bg-red-950/60',
		ghost:
			'text-red-600 enabled:hover:bg-red-50 enabled:active:bg-red-100 dark:text-red-400 dark:enabled:hover:bg-red-900/20 dark:enabled:active:bg-red-900/30',
		subtle:
			'bg-red-50 text-red-700 enabled:hover:bg-red-100 enabled:active:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:enabled:hover:bg-red-500/20 dark:enabled:active:bg-red-500/30',
		focusOutline: 'focus-visible:outline-red-500',
	},
	success: {
		solid:
			'bg-green-600 text-white enabled:hover:bg-green-700 enabled:active:bg-green-800 dark:bg-green-500 dark:enabled:hover:bg-green-600 dark:enabled:active:bg-green-700',
		outline:
			'border border-green-300 text-green-700 enabled:hover:bg-green-50 enabled:active:bg-green-100 dark:border-green-800 dark:text-green-400 dark:enabled:hover:bg-green-950/40 dark:enabled:active:bg-green-950/60',
		ghost:
			'text-green-700 enabled:hover:bg-green-50 enabled:active:bg-green-100 dark:text-green-400 dark:enabled:hover:bg-green-950/40 dark:enabled:active:bg-green-950/60',
		subtle:
			'bg-green-50 text-green-700 enabled:hover:bg-green-100 enabled:active:bg-green-200 dark:bg-green-500/10 dark:text-green-400 dark:enabled:hover:bg-green-500/20 dark:enabled:active:bg-green-500/30',
		focusOutline: 'focus-visible:outline-green-500',
	},
};

const SIZE_CLASSES = {
	sm: 'p-1',
	md: 'p-2',
	lg: 'p-3',
};

const ICON_SIZE_CLASSES = {
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
	lg: 'w-6 h-6',
};

interface IconButtonProps extends ComponentPropsWithRef<'button'> {
	icon: string;
	'aria-label': string;
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: 'sm' | 'md' | 'lg';
	radius?: Radius;
	children?: ReactNode;
}

export const IconButton = ({
	icon,
	'aria-label': ariaLabel,
	variant = 'outline',
	color = 'neutral',
	size = 'md',
	radius = 'md',
	className,
	children,
	ref,
	...props
}: IconButtonProps) => {
	const tokens = COLOR_TOKENS[color];

	return (
		<button
			ref={ref}
			type="button"
			aria-label={ariaLabel}
			className={clsx(
				'cursor-pointer inline-flex items-center justify-center transition-[color,background-color,border-color,transform] duration-200 enabled:active:duration-75 enabled:active:scale-[0.95]',
				'outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2',
				'disabled:opacity-50 disabled:cursor-not-allowed',
				variant !== 'unstyled' && [
					RADIUS_CLASSES[radius],
					tokens[variant],
					tokens.focusOutline,
				],
				SIZE_CLASSES[size],
				className
			)}
			{...props}
		>
			<div
				className={clsx(icon, ICON_SIZE_CLASSES[size], children && 'mr-1')}
			/>
			{children}
		</button>
	);
};
