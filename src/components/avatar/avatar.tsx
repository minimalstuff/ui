import clsx from 'clsx';
import { useState } from 'react';

import { type ControlSize } from '#components/shared/sizes';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	BUTTON_COLOR_TOKENS,
	type ButtonColor,
} from '#components/shared/button_styles';

export type { ButtonColor as AvatarColor } from '#components/shared/button_styles';

export type AvatarSize = ControlSize;

// Each step keeps the initial at roughly 40-45% of the circle: a fixed text
// size makes the letter shrink into an empty disc as the avatar grows.
const SIZE_CLASSES: Record<AvatarSize, string> = {
	xs: 'h-6 w-6 text-xs',
	sm: 'h-8 w-8 text-sm',
	md: 'h-10 w-10 text-base',
	lg: 'h-12 w-12 text-xl',
};

export interface AvatarProps {
	name: string;
	src?: string;
	size?: AvatarSize;
	color?: ButtonColor;
	radius?: Radius;
	unstyled?: boolean;
	className?: string;
}

// Segment by grapheme rather than slicing code units: `charAt(0)` cuts a
// surrogate pair in half, and even iterating code points splits clusters
// that read as one character (a flag, an emoji carrying a skin tone).
const GRAPHEME_SEGMENTER = new Intl.Segmenter(undefined, {
	granularity: 'grapheme',
});

function deriveInitial(name: string): string {
	const trimmedName = name.trim();
	if (trimmedName.length === 0) return '';

	const [firstGrapheme] = GRAPHEME_SEGMENTER.segment(trimmedName);
	return firstGrapheme.segment.toUpperCase();
}

/**
 * The picture of a person, or the initial of `name` when there is none.
 * Labelled with the full `name` so screen readers announce the person rather
 * than a stray letter; the `<img>` itself stays out of the accessibility
 * tree to avoid announcing it twice.
 *
 * A `src` that fails to load falls back to the initial — remote avatars go
 * missing (deleted accounts, rate limits), and a broken-image glyph in a
 * circle looks like a bug. Pointing `src` at a different URL retries.
 *
 * A missing name is the caller's call to make: this renders whatever `name`
 * starts with, and an empty circle for a blank string, rather than inventing
 * a placeholder identity.
 */
export function Avatar({
	name,
	src,
	size = 'sm',
	color = 'primary',
	radius = 'full',
	unstyled = false,
	className,
}: Readonly<AvatarProps>) {
	const [failedSource, setFailedSource] = useState<string | null>(null);
	const isShowingImage = src !== undefined && src !== failedSource;
	// An `img` role with no accessible name is an error, not a nameless
	// picture: a blank name means there is nobody to announce, so the whole
	// circle becomes decoration instead.
	const hasName = name.trim().length > 0;

	const handleImageError = () => setFailedSource(src ?? null);

	const content = isShowingImage ? (
		<img
			src={src}
			alt=""
			onError={handleImageError}
			className="h-full w-full object-cover"
		/>
	) : (
		<span aria-hidden="true">{deriveInitial(name)}</span>
	);

	return (
		<span
			role={hasName ? 'img' : undefined}
			aria-label={hasName ? name : undefined}
			aria-hidden={hasName ? undefined : true}
			className={clsx(
				'inline-flex flex-shrink-0 items-center justify-center overflow-hidden',
				SIZE_CLASSES[size],
				!unstyled && RADIUS_CLASSES[radius],
				// The filled circle is the backdrop for the initial. A picture
				// covers it, and its `border-transparent` would only let the fill
				// bleed out as a ring around the image.
				!unstyled &&
					!isShowingImage && [
						'border font-semibold',
						BUTTON_COLOR_TOKENS[color].solid,
					],
				className
			)}
		>
			{content}
		</span>
	);
}
