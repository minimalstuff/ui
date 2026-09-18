import clsx from 'clsx';
import type { ReactNode } from 'react';

import { type ControlSize } from '#components/shared/sizes';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';

export type KbdSize = ControlSize;

const SIZE_CLASSES: Record<KbdSize, string> = {
	xs: 'px-1.5 py-0.5 text-xs',
	sm: 'px-2 py-0.5 text-xs',
	md: 'px-2.5 py-1 text-sm',
	lg: 'px-3 py-1 text-base',
};

export interface KbdProps {
	children: ReactNode;
	size?: KbdSize;
	radius?: Radius;
	unstyled?: boolean;
	className?: string;
}

export const Kbd = ({
	children,
	size = 'sm',
	radius = 'sm',
	unstyled = false,
	className,
}: Readonly<KbdProps>) => (
	<kbd
		className={clsx(
			'inline-flex items-center',
			SIZE_CLASSES[size],
			!unstyled && [
				'border font-semibold uppercase',
				'text-gray-600 dark:text-gray-300',
				'bg-gray-100 dark:bg-gray-700',
				'border-gray-200 dark:border-gray-600',
				RADIUS_CLASSES[radius],
			],
			className
		)}
	>
		{children}
	</kbd>
);
