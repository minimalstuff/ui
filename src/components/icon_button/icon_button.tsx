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

const SIZE_CLASSES: Record<ControlSize, string> = {
	xs: 'p-1',
	sm: 'p-2',
	md: 'p-2',
	lg: 'p-3',
};

const ICON_SIZE_CLASSES: Record<ControlSize, string> = {
	xs: 'w-4 h-4',
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
	lg: 'w-6 h-6',
};

type IconButtonStyle =
	| { unstyled: true }
	| {
			unstyled?: false;
			variant?: ButtonVariant;
			color?: ButtonColor;
			radius?: Radius;
	  };

export type IconButtonProps = ComponentPropsWithRef<'button'> & {
	icon: string;
	'aria-label': string;
	size?: ControlSize;
	children?: ReactNode;
} & IconButtonStyle;

// See Button's `FlatButtonStyle` for why this cast is here: it only widens
// the destructuring inside this implementation, not the public prop type.
type FlatIconButtonStyle = {
	unstyled?: boolean;
	variant?: ButtonVariant;
	color?: ButtonColor;
	radius?: Radius;
};

export function IconButton(iconButtonProps: Readonly<IconButtonProps>) {
	const {
		icon,
		'aria-label': ariaLabel,
		unstyled = false,
		variant = 'outline',
		color = 'neutral',
		size = 'md',
		radius = 'md',
		className,
		children,
		ref,
		...props
	} = iconButtonProps as IconButtonProps & FlatIconButtonStyle;
	const tokens = BUTTON_COLOR_TOKENS[color];

	return (
		<button
			ref={ref}
			type="button"
			aria-label={ariaLabel}
			className={clsx(
				BUTTON_LAYOUT_CLASSES,
				!unstyled && [
					BUTTON_INTERACTIVE_CLASSES,
					'border',
					RADIUS_CLASSES[radius],
					SIZE_CLASSES[size],
					tokens[variant],
					tokens.focusOutline,
				],
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
}
