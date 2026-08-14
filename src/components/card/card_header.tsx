import type { ReactNode } from 'react';

export interface CardHeaderProps {
	title: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
}

/**
 * Title block of a `Card`. Split out because its three slots each have their
 * own layout rule: `actions` sits opposite the title on the same row, while
 * `description` stacks under both.
 */
export const CardHeader = ({
	title,
	description,
	actions,
}: Readonly<CardHeaderProps>) => (
	<div className="mb-4">
		<div className="flex items-center justify-between gap-4">
			<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
				{title}
			</h2>
			{actions}
		</div>
		{description && (
			<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
				{description}
			</p>
		)}
	</div>
);
