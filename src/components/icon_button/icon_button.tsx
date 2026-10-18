import clsx from 'clsx';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { Tooltip } from '#components/tooltip/tooltip';
import { type ControlSize } from '#components/shared/sizes';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	type IconButtonTooltip,
	type IconButtonTooltipOptions,
} from '#components/icon_button/icon_button_tooltip';
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

export type { IconButtonTooltip } from '#components/icon_button/icon_button_tooltip';

export type IconButtonProps = ComponentPropsWithRef<'button'> & {
	icon: string;
	'aria-label': string;
	size?: ControlSize;
	children?: ReactNode;
	tooltip?: IconButtonTooltip;
} & IconButtonStyle;

// See Button's `FlatButtonStyle` for why this cast is here: it only widens
// the destructuring inside this implementation, not the public prop type.
type FlatIconButtonStyle = {
	unstyled?: boolean;
	variant?: ButtonVariant;
	color?: ButtonColor;
	radius?: Radius;
};

function resolveTooltipOptions(
	tooltip: IconButtonTooltip | undefined
): IconButtonTooltipOptions | undefined {
	if (!tooltip) return undefined;
	if (tooltip === true) return {};
	if (typeof tooltip === 'string') return { position: tooltip };
	return tooltip;
}

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
		tooltip,
		ref,
		...props
	} = iconButtonProps as IconButtonProps & FlatIconButtonStyle;
	const tokens = BUTTON_COLOR_TOKENS[color];
	const tooltipOptions = resolveTooltipOptions(tooltip);

	const button = (
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

	if (!tooltipOptions) return button;

	const hasCustomContent = tooltipOptions.content !== undefined;
	return (
		<Tooltip
			content={hasCustomContent ? tooltipOptions.content : ariaLabel}
			position={tooltipOptions.position}
			describeChild={hasCustomContent ? undefined : false}
		>
			{button}
		</Tooltip>
	);
}
