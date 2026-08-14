import clsx from 'clsx';
import { useId, type ReactNode } from 'react';

import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { CONTROL_BG, SURFACE_BORDER } from '#components/shared/surface_tokens';
import {
	CardHeader,
	type CardHeadingLevel,
} from '#components/card/card_header';

export type { CardHeadingLevel } from '#components/card/card_header';

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
	headingLevel?: CardHeadingLevel;
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
 * A titled card is also a labelled `region`, so screen reader users can jump
 * between sections by name — worth it on a settings page stacking seven of
 * them. Untitled cards stay plain `div`s rather than adding nameless
 * landmarks. Set `headingLevel` when the card sits under an existing heading:
 * the default `h2` is right at the top level of a page and wrong nested.
 *
 * `unstyled` strips the surface, border, radius and padding; the header
 * markup stays, since that is structure rather than skin.
 */
export function Card({
	children,
	title,
	description,
	actions,
	headingLevel = 2,
	padding = 'md',
	radius = 'lg',
	unstyled = false,
	className,
}: Readonly<CardProps>) {
	const titleId = useId();
	const hasTitle = Boolean(title);

	return (
		<div
			role={hasTitle ? 'region' : undefined}
			aria-labelledby={hasTitle ? titleId : undefined}
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
			{hasTitle && (
				<CardHeader
					title={title}
					titleId={titleId}
					level={headingLevel}
					description={description}
					actions={actions}
				/>
			)}
			{children}
		</div>
	);
}
