import clsx from 'clsx';

import { CONTROL_BG, SURFACE_BORDER } from '#components/shared/surface_tokens';
import type { OverviewEntry } from './overview_entry.js';

const DOCS_STORY_SUFFIX = 'docs';

function getDocsPath(storyId: string): string {
	const [componentId] = storyId.split('--');
	return `/docs/${componentId}--${DOCS_STORY_SUFFIX}`;
}

export function OverviewCard({ entry }: Readonly<{ entry: OverviewEntry }>) {
	const { name, Story, isWide } = entry;

	return (
		<li
			className={clsx(
				'flex min-w-0 flex-col overflow-hidden rounded-xl border',
				isWide && 'ms-overview-card-wide',
				SURFACE_BORDER,
				CONTROL_BG
			)}
		>
			<div className="flex min-h-32 flex-1 items-center justify-center overflow-hidden p-4">
				<Story />
			</div>
			<div
				className={clsx(
					'flex items-center justify-between gap-2 border-t px-4 py-3',
					SURFACE_BORDER
				)}
			>
				<h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
					{name}
				</h3>
				<a
					href={`./?path=${getDocsPath(Story.id)}`}
					target="_top"
					aria-label={`Docs for ${name}`}
					className="text-sm text-blue-700 underline-offset-2 hover:underline dark:text-blue-400"
				>
					Docs
				</a>
			</div>
		</li>
	);
}
