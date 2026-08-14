import clsx from 'clsx';
import type { ReactNode } from 'react';

import { CardHeader } from '#components/card/card_header';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { CONTROL_BG, SURFACE_BORDER } from '#components/shared/surface_tokens';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const PADDING_CLASSES: Record<CardPadding, string> = {
	none: '',
	sm: 'p-4',
	md: 'p-6',
	lg: 'p-8',
};

export interface CardProps {
	children: ReactNode;
	title?: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
	padding?: CardPadding;
	radius?: Radius;
	unstyled?: boolean;
	className?: string;
}

/**
 * A section container: surface, border, radius, padding. Pass `title` (plus
 * optionally `description` and `actions`, which sit opposite the title) to
 * get the standard header, or omit all three and lay the section out inside
 * `children` yourself.
 *
 * `unstyled` strips the surface, border, radius and padding; the header
 * markup stays, since that is structure rather than skin.
 */
export const Card = ({
	children,
	title,
	description,
	actions,
	padding = 'md',
	radius = 'lg',
	unstyled = false,
	className,
}: Readonly<CardProps>) => (
	<div
		className={clsx(
			!unstyled && [
				'border',
				CONTROL_BG,
				SURFACE_BORDER,
				RADIUS_CLASSES[radius],
				PADDING_CLASSES[padding],
			],
			className
		)}
	>
		{title && (
			<CardHeader title={title} description={description} actions={actions} />
		)}
		{children}
	</div>
);
