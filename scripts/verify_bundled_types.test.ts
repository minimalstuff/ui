import { expect, test } from 'vitest';

import { findUnexportedDuplicates } from './verify_bundled_types.ts';

test('should report a duplicate declaration that is not re-exported', () => {
	const declarations = `
declare type TabsVariant_2 = 'line' | 'segmented';
export declare interface TabsProps {
	variant: TabsVariant_2;
}
`;

	expect(findUnexportedDuplicates(declarations)).toEqual(['TabsVariant_2']);
});

test('should accept a duplicate re-exported under its original name', () => {
	const declarations = `
declare function Highlight_2({ text }: Readonly<HighlightProps>): JSX.Element;
export { Highlight_2 as Highlight }
`;

	expect(findUnexportedDuplicates(declarations)).toEqual([]);
});

test('should ignore import aliases', () => {
	const declarations = `
import type { MouseEvent as MouseEvent_2 } from 'react';
export declare type MenuItemButtonProps = {
	onClick: (event: MouseEvent_2<HTMLButtonElement>) => void;
};
`;

	expect(findUnexportedDuplicates(declarations)).toEqual([]);
});

test('should return nothing for a clean bundle', () => {
	const declarations = `
export declare type Theme = 'light' | 'dark' | 'system';
export declare interface ThemeToggleProps {
	theme: Theme;
}
`;

	expect(findUnexportedDuplicates(declarations)).toEqual([]);
});
