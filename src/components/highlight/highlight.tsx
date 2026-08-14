import { splitIntoHighlightSegments } from '#lib/split_into_highlight_segments';

export interface HighlightProps {
	text: string;
	ranges: readonly number[];
}

export function Highlight({ text, ranges }: Readonly<HighlightProps>) {
	const segments = splitIntoHighlightSegments(text, ranges);
	let cursor = 0;

	return (
		<>
			{segments.map((segment) => {
				// Segments are non-overlapping and cover `text` end to end, so the
				// running start offset is a stable, unique key without relying on
				// array position.
				const start = cursor;
				cursor += segment.text.length;

				return segment.isMatch ? (
					<mark
						key={start}
						className="rounded bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100"
					>
						{segment.text}
					</mark>
				) : (
					<span key={start}>{segment.text}</span>
				);
			})}
		</>
	);
}
