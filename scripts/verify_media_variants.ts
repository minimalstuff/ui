import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const MEDIA_VARIANT_PATTERN =
	/(?<![\w-])(?:(?:sm|md|lg|xl|2xl|motion-reduce|motion-safe|print|forced-colors)|(?:max|min|lt|at|contrast)-[\w[\]./%-]+):[^\s'"`]+/g;
const SOURCE_DIRECTORY = 'src';
const SOURCE_FILE_PATTERN = /\.(?:ts|tsx)$/;
const EXCLUDED_FILE_PATTERN = /\.(?:test|stories)\./;

interface MediaVariantHit {
	filePath: string;
	lineNumber: number;
	token: string;
}

export function findMediaVariantTokens(source: string): string[] {
	return Array.from(source.matchAll(MEDIA_VARIANT_PATTERN), ([token]) => token);
}

function listSourceFiles(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = join(directory, entry.name);
		if (entry.isDirectory()) return listSourceFiles(entryPath);
		if (!SOURCE_FILE_PATTERN.test(entry.name)) return [];
		if (EXCLUDED_FILE_PATTERN.test(entry.name)) return [];
		return [entryPath];
	});
}

function findHitsInFile(filePath: string): MediaVariantHit[] {
	const lines = readFileSync(filePath, 'utf-8').split('\n');

	return lines.flatMap((line, lineIndex) =>
		findMediaVariantTokens(line).map((token) => ({
			filePath,
			lineNumber: lineIndex + 1,
			token,
		}))
	);
}

function reportHit(hit: MediaVariantHit): void {
	console.error(`${hit.filePath}:${hit.lineNumber}: ${hit.token}`);
}

function main(): void {
	const hits = listSourceFiles(SOURCE_DIRECTORY).flatMap(findHitsInFile);

	if (hits.length === 0) return;

	hits.forEach(reportHit);
	console.error(
		'\nMedia-query variants must not be used directly in components. ' +
			'A consumer app loads its own utilities after style.css, and at equal ' +
			"specificity its base rule (e.g. '.w-full') beats the library's media rule. " +
			'Move the base + variant combination into an ms-* shortcut in uno.config.ts.'
	);
	process.exit(1);
}

if (import.meta.main) {
	main();
}
