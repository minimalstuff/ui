import clsx from 'clsx';

import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	type HighlightSegment,
	splitIntoHighlightSegments,
} from '#lib/split_into_highlight_segments';

export interface HighlightProps {
	text: string;
	ranges: readonly number[];
	/**
	 * Corner radius of each `<mark>`. The default (`sm`) renders the same
	 * `border-radius` as the previous hard-coded `rounded`. Ignored when
	 * `unstyled` is set.
	 */
	radius?: Radius;
	/**
	 * Removes the library's classes from each `<mark>` (radius, background and
	 * text colours). `radius` then has no effect. Matches then rely on
	 * `markClassName` (or the browser's default `<mark>` style) to stay visible,
	 * so a consumer who resets `mark` styles must style `markClassName`.
	 */
	unstyled?: boolean;
	/** Applied to every `<mark>`, whether or not `unstyled` is set. */
	markClassName?: string;
}

const MARK_CLASSES =
	'bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100';

type PositionedHighlightSegment = HighlightSegment & { start: number };

/**
 * Pairs each segment with its start offset within the original text.
 * Segments are non-overlapping and cover `text` end to end, so the running
 * start offset is a stable, unique key without relying on array position.
 */
function positionHighlightSegments(
	segments: readonly HighlightSegment[]
): PositionedHighlightSegment[] {
	let cursor = 0;

	return segments.map((segment) => {
		const start = cursor;
		cursor += segment.text.length;

		return { ...segment, start };
	});
}

export function Highlight({
	text,
	ranges,
	radius = 'sm',
	unstyled = false,
	markClassName,
}: Readonly<HighlightProps>) {
	const segments = splitIntoHighlightSegments(text, ranges);
	const positionedSegments = positionHighlightSegments(segments);

	return (
		<>
			{positionedSegments.map((segment) =>
				segment.isMatch ? (
					<mark
						key={segment.start}
						className={clsx(
							!unstyled && [RADIUS_CLASSES[radius], MARK_CLASSES],
							markClassName
						)}
					>
						{segment.text}
					</mark>
				) : (
					<span key={segment.start}>{segment.text}</span>
				)
			)}
		</>
	);
}
