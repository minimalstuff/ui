const EMPTY_UNRELEASED_SECTION =
	/^## \[Unreleased\]\r?\n(?:[ \t]*\r?\n)*(?=## \[)/m;

export function removeEmptyUnreleasedSection(markdown: string): string {
	return markdown.replace(EMPTY_UNRELEASED_SECTION, '');
}
