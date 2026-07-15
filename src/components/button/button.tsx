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
	ring: string;
}

const COLOR_TOKENS: Record<ButtonColor, ColorTokens> = {
	primary: {
		solid:
			'border-transparent bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
		outline:
			'border-blue-300 bg-transparent text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/40',
		ghost:
			'border-transparent bg-transparent text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40',
		subtle:
			'border-transparent bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20',
		ring: 'focus:ring-blue-500',
	},
	neutral: {
		solid:
			'border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500',
		outline:
			'border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/50',
		ghost:
			'border-transparent bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50',
		subtle:
			'border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-600/50',
		ring: 'focus:ring-gray-400',
	},
	danger: {
		solid:
			'border-transparent bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
		outline:
			'border-red-300 bg-transparent text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40',
		ghost:
			'border-transparent bg-transparent text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40',
		subtle:
			'border-transparent bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20',
		ring: 'focus:ring-red-500',
	},
	success: {
		solid:
			'border-transparent bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
		outline:
			'border-green-300 bg-transparent text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/40',
		ghost:
			'border-transparent bg-transparent text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/40',
		subtle:
			'border-transparent bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20',
		ring: 'focus:ring-green-500',
	},
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
	xs: 'px-2 py-1 text-xs',
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-sm',
	lg: 'px-4 py-3 text-base',
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
}

export const Button = ({
	variant = 'solid',
	color = 'primary',
	size = 'md',
	children,
	className,
	fullWidth = false,
	loading = false,
	disabled,
	...props
}: ButtonProps) => {
	const tokens = COLOR_TOKENS[color];

	return (
		<button
			type="button"
			className={clsx(
				'cursor-pointer inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed',
				tokens[variant],
				tokens.ring,
				SIZE_CLASSES[size],
				fullWidth && 'w-full',
				className
			)}
			disabled={disabled ?? loading}
			{...props}
		>
			{loading && (
				<span
					className="i-svg-spinners-3-dots-fade w-4 h-4"
					aria-hidden="true"
				/>
			)}
			{children}
		</button>
	);
};
