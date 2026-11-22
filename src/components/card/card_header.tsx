import clsx from 'clsx';
import type { ReactNode } from 'react';

export type CardHeadingLevel = 2 | 3 | 4;

export type CardTitleSize = 'sm' | 'md';

const TITLE_SIZE_CLASSES: Record<CardTitleSize, string> = {
	sm: 'text-base',
	md: 'text-lg',
};

const HEADER_MARGIN_CLASSES: Record<CardTitleSize, string> = {
	sm: 'mb-3',
	md: 'mb-4',
};

const HEADING_TAGS = {
	2: 'h2',
	3: 'h3',
	4: 'h4',
} as const;

export interface CardHeaderProps {
	title: ReactNode;
	titleId: string;
	level: CardHeadingLevel;
	size: CardTitleSize;
	description?: ReactNode;
	actions?: ReactNode;
}

/**
 * Title block of a `Card`. Split out because its three slots each have their
 * own layout rule: `actions` sits opposite the title on the same row, while
 * `description` stacks under both.
 */
export function CardHeader({
	title,
	titleId,
	level,
	size,
	description,
	actions,
}: Readonly<CardHeaderProps>) {
	const Heading = HEADING_TAGS[level];

	return (
		<div className={HEADER_MARGIN_CLASSES[size]}>
			<div className="flex items-center justify-between gap-4">
				<Heading
					id={titleId}
					className={clsx(
						TITLE_SIZE_CLASSES[size],
						'font-medium text-gray-900 dark:text-gray-100'
					)}
				>
					{title}
				</Heading>
				{actions}
			</div>
			{description && (
				<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
					{description}
				</p>
			)}
		</div>
	);
}
