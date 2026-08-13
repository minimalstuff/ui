import clsx from 'clsx';
import type { ReactNode } from 'react';

import { RADIUS_CLASSES } from '#components/shared/radius';

export type KbdSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<KbdSize, string> = {
	xs: 'px-1.5 py-0.5 text-xs',
	sm: 'px-2 py-0.5 text-xs',
	md: 'px-2.5 py-1 text-sm',
	lg: 'px-3 py-1 text-base',
};

interface KbdProps {
	children: ReactNode;
	size?: KbdSize;
	className?: string;
}

export const Kbd = ({
	children,
	size = 'sm',
	className,
}: Readonly<KbdProps>) => (
	<kbd
		className={clsx(
			'inline-flex items-center border font-semibold uppercase',
			'text-gray-500 dark:text-gray-400',
			'bg-gray-100 dark:bg-gray-700',
			'border-gray-200 dark:border-gray-600',
			RADIUS_CLASSES.sm,
			SIZE_CLASSES[size],
			className
		)}
	>
		{children}
	</kbd>
);
