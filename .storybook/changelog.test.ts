import { describe, expect, it } from 'vitest';

import { removeEmptyUnreleasedSection } from './changelog';

describe('removeEmptyUnreleasedSection', () => {
	it('should remove the Unreleased heading when it has no entries', () => {
		const markdown =
			'# Changelog\n\n## [Unreleased]\n\n## [1.0.0] - 2026-01-01\n\n- Done.\n';

		expect(removeEmptyUnreleasedSection(markdown)).toBe(
			'# Changelog\n\n## [1.0.0] - 2026-01-01\n\n- Done.\n'
		);
	});

	it('should keep the Unreleased section untouched when it has entries', () => {
		const markdown =
			'# Changelog\n\n## [Unreleased]\n\n### Added\n\n- Something.\n\n## [1.0.0] - 2026-01-01\n';

		expect(removeEmptyUnreleasedSection(markdown)).toBe(markdown);
	});
});
