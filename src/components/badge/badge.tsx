import clsx from 'clsx';
import type { ReactNode } from 'react';

import { type ControlSize } from '#components/shared/sizes';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	BUTTON_COLOR_TOKENS,
	type ButtonColor,
} from '#components/shared/button_styles';

export type { ButtonColor as BadgeColor } from '#components/shared/button_styles';

export type BadgeVariant = 'solid' | 'outline' | 'subtle';
export type BadgeSize = ControlSize;

const SIZE_CLASSES: Record<BadgeSize, string> = {
	xs: 'px-1.5 py-0.5 text-xs',
	sm: 'px-2.5 py-1 text-sm',
	md: 'px-3 py-1 text-base',
	lg: 'px-3.5 py-1.5 text-lg',
};

interface BadgeProps {
	children: ReactNode;
	color?: ButtonColor;
	variant?: BadgeVariant;
	size?: BadgeSize;
	radius?: Radius;
}

export const Badge = ({
	children,
	color = 'primary',
	variant = 'subtle',
	size = 'sm',
	radius = 'md',
}: Readonly<BadgeProps>) => (
	<span
		className={clsx(
			'inline-flex items-center gap-1 border',
			RADIUS_CLASSES[radius],
			SIZE_CLASSES[size],
			BUTTON_COLOR_TOKENS[color][variant]
		)}
	>
		{children}
	</span>
);
