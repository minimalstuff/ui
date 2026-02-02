import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'ghost'
	| 'outline'
	| 'subtle'
	| 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
	primary:
		'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border-transparent',
	secondary:
		'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 border-transparent',
	ghost:
		'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 border-transparent',
	outline:
		'bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/50',
	subtle:
		'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-600/50 border-transparent',
	danger:
		'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 border-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
	xs: 'px-2 py-1 text-xs',
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-sm',
	lg: 'px-4 py-3 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	children: ReactNode;
	className?: string;
	fullWidth?: boolean;
	loading?: boolean;
}

export const Button = ({
	variant = 'primary',
	size = 'md',
	children,
	className,
	fullWidth = false,
	loading = false,
	disabled,
	...props
}: ButtonProps) => (
	<button
		type="button"
		className={clsx(
			'cursor-pointer inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed',
			VARIANT_CLASSES[variant],
			SIZE_CLASSES[size],
			fullWidth && 'w-full',
			className
		)}
		disabled={disabled ?? loading}
		{...props}
	>
		{loading && (
			<span className="i-svg-spinners-3-dots-fade w-4 h-4" aria-hidden="true" />
		)}
		{children}
	</button>
);
