import { OverviewCard } from './overview_card.js';
import type { OverviewGroup } from './overview_entry.js';

export function OverviewSection({ group }: Readonly<{ group: OverviewGroup }>) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
				{group.label}
			</h2>
			<ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4 p-0">
				{group.entries.map((entry) => (
					<OverviewCard key={entry.name} entry={entry} />
				))}
			</ul>
		</section>
	);
}
