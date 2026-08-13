import clsx from 'clsx';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	BUTTON_COLOR_TOKENS,
	BUTTON_INTERACTIVE_CLASSES,
	type ButtonColor,
	type ButtonVariant,
} from '#components/shared/button_styles';

const SIZE_CLASSES = {
	xs: 'p-1',
	sm: 'p-2',
	md: 'p-2',
	lg: 'p-3',
};

const ICON_SIZE_CLASSES = {
	xs: 'w-4 h-4',
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
	lg: 'w-6 h-6',
};

interface IconButtonProps extends ComponentPropsWithRef<'button'> {
	icon: string;
	'aria-label': string;
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: 'xs' | 'sm' | 'md' | 'lg';
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
	const tokens = BUTTON_COLOR_TOKENS[color];

	return (
		<button
			ref={ref}
			type="button"
			aria-label={ariaLabel}
			className={clsx(
				BUTTON_INTERACTIVE_CLASSES,
				variant !== 'unstyled' && [
					'border',
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
