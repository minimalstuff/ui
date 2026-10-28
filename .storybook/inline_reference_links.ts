const REFERENCE_DEFINITION = /^\[([^\]]+)\]:[ \t]+(\S+)[ \t]*$/gm;
const REFERENCE_USAGE = /\[([^\]]+)\](?![(:[])/g;

function collectReferenceUrls(markdown: string): ReadonlyMap<string, string> {
	const urlsByLabel = new Map<string, string>();
	for (const [, label, url] of markdown.matchAll(REFERENCE_DEFINITION)) {
		urlsByLabel.set(label, url);
	}
	return urlsByLabel;
}

export function inlineReferenceLinks(markdown: string): string {
	const urlsByLabel = collectReferenceUrls(markdown);
	return markdown
		.replace(REFERENCE_DEFINITION, '')
		.replace(REFERENCE_USAGE, (match, label: string) => {
			const url = urlsByLabel.get(label);
			return url ? `[${label}](${url})` : match;
		})
		.trimEnd()
		.concat('\n');
}
