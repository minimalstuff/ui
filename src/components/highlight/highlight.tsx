import {
	type HighlightSegment,
	splitIntoHighlightSegments,
} from '#lib/split_into_highlight_segments';

export interface HighlightProps {
	text: string;
	ranges: readonly number[];
}

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

export function Highlight({ text, ranges }: Readonly<HighlightProps>) {
	const segments = splitIntoHighlightSegments(text, ranges);
	const positionedSegments = positionHighlightSegments(segments);

	return (
		<>
			{positionedSegments.map((segment) =>
				segment.isMatch ? (
					<mark
						key={segment.start}
						className="rounded bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100"
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
