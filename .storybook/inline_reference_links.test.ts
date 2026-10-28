import { describe, expect, it } from 'vitest';

import { inlineReferenceLinks } from './inline_reference_links';

describe('inlineReferenceLinks', () => {
	it('should turn reference links into inline links and drop their definitions', () => {
		const markdown =
			'## [1.0.0] - 2026-01-01\n\nSee [docs](https://example.com/docs).\n\n[1.0.0]: https://example.com/1.0.0\n';

		expect(inlineReferenceLinks(markdown)).toBe(
			'## [1.0.0](https://example.com/1.0.0) - 2026-01-01\n\nSee [docs](https://example.com/docs).\n'
		);
	});

	it('should leave brackets without a definition untouched', () => {
		const markdown = 'A [note] without definition.\n';

		expect(inlineReferenceLinks(markdown)).toBe(markdown);
	});
});
