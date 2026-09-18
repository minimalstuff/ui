import { readFileSync } from 'node:fs';

const DECLARATION_PATTERN =
	/^declare (?:type|interface|function|class|const|enum|namespace)\s+([A-Za-z_$][A-Za-z0-9_$]*)_(\d+)\b/gm;
const EXPORT_BLOCK_PATTERN = /export\s+(?:type\s+)?\{([^}]*)\}/g;
const EXPORT_ALIAS_PATTERN =
	/([A-Za-z_$][A-Za-z0-9_$]*_\d+)\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
const BUNDLED_TYPES_PATH = 'dist/index.d.ts';

function extractDuplicateDeclarations(
	declarations: string
): ReadonlyMap<string, string> {
	const duplicateDeclarations = new Map<string, string>();

	for (const match of declarations.matchAll(DECLARATION_PATTERN)) {
		const originalName = match[1];
		const numericSuffix = match[2];
		duplicateDeclarations.set(`${originalName}_${numericSuffix}`, originalName);
	}

	return duplicateDeclarations;
}

function extractExportedAliases(
	declarations: string
): ReadonlyMap<string, string> {
	const exportedAliases = new Map<string, string>();

	for (const exportBlock of declarations.matchAll(EXPORT_BLOCK_PATTERN)) {
		const exportBlockContent = exportBlock[1];

		for (const aliasMatch of exportBlockContent.matchAll(
			EXPORT_ALIAS_PATTERN
		)) {
			exportedAliases.set(aliasMatch[1], aliasMatch[2]);
		}
	}

	return exportedAliases;
}

export function findUnexportedDuplicates(
	declarations: string
): readonly string[] {
	const duplicateDeclarations = extractDuplicateDeclarations(declarations);
	const exportedAliases = extractExportedAliases(declarations);

	return Array.from(duplicateDeclarations.entries())
		.filter(
			([duplicateName, originalName]) =>
				exportedAliases.get(duplicateName) !== originalName
		)
		.map(([duplicateName]) => duplicateName);
}

function reportUnexportedDuplicate(duplicateName: string): void {
	console.error(
		`${duplicateName}: bundled as a duplicate declaration that is never exported. ` +
			'This usually happens when the barrel re-exports it via a relative import path ' +
			"while another module imports it via the '#...' alias path, so vite-plugin-dts " +
			'treats them as two separate modules. Re-export it from the barrel using the ' +
			'alias path instead.'
	);
}

function main(): void {
	const bundledDeclarations = readFileSync(BUNDLED_TYPES_PATH, 'utf-8');
	const unexportedDuplicates = findUnexportedDuplicates(bundledDeclarations);

	if (unexportedDuplicates.length === 0) return;

	unexportedDuplicates.forEach(reportUnexportedDuplicate);
	process.exit(1);
}

if (import.meta.main) {
	main();
}
