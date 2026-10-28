import type { ComponentType } from 'react';

type OverviewStory = ComponentType & { readonly id: string };

export type OverviewEntry = {
	readonly name: string;
	readonly Story: OverviewStory;
	readonly isWide?: boolean;
};

export type OverviewGroup = {
	readonly label: string;
	readonly entries: readonly OverviewEntry[];
};
