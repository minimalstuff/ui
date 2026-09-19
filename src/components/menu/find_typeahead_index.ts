const NO_MATCH = -1;

/**
 * Finds the next enabled menu item whose label starts with `character`,
 * starting just after `currentIndex` and wrapping around to the start of
 * `labels`. Matching is case-insensitive and returns `NO_MATCH` (-1) when
 * nothing matches, including when `labels` is empty.
 */
export function findTypeaheadIndex(
	labels: readonly string[],
	currentIndex: number,
	character: string
): number {
	const normalizedCharacter = character.toLowerCase();
	const itemCount = labels.length;

	for (let offset = 1; offset <= itemCount; offset += 1) {
		const candidateIndex = (currentIndex + offset + itemCount) % itemCount;
		if (labels[candidateIndex]?.toLowerCase().startsWith(normalizedCharacter)) {
			return candidateIndex;
		}
	}

	return NO_MATCH;
}
