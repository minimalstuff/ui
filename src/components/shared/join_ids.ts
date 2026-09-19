/** Joins the truthy ids with a space, in order, or `undefined` when none are truthy. */
export function joinIds(
	...ids: ReadonlyArray<string | false | null | undefined>
): string | undefined {
	return ids.filter(Boolean).join(' ') || undefined;
}
