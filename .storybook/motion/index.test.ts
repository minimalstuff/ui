import { describe, expect, it } from 'vitest';

import { substituteReducedMotionQuery } from './index';

describe('substituteReducedMotionQuery', () => {
	it('should leave the query untouched in system mode', () => {
		const query = '(prefers-reduced-motion: reduce)';

		expect(substituteReducedMotionQuery(query, 'system')).toBe(query);
	});

	it('should turn reduce into an always true condition in reduced mode', () => {
		expect(
			substituteReducedMotionQuery(
				'(prefers-reduced-motion: reduce)',
				'reduced'
			)
		).toBe('(min-width: 0px)');
	});

	it('should turn reduce into an always false condition in full mode', () => {
		expect(
			substituteReducedMotionQuery('(prefers-reduced-motion:reduce)', 'full')
		).toBe('((min-width: 1px) and (max-width: 0px))');
	});

	it('should turn no-preference into the opposite of reduce', () => {
		const query = '(prefers-reduced-motion: no-preference)';

		expect(substituteReducedMotionQuery(query, 'full')).toBe(
			'(min-width: 0px)'
		);
		expect(substituteReducedMotionQuery(query, 'reduced')).toBe(
			'((min-width: 1px) and (max-width: 0px))'
		);
	});

	it('should keep the other conditions of a compound query', () => {
		expect(
			substituteReducedMotionQuery(
				'screen and (prefers-reduced-motion) and (min-width: 40rem)',
				'reduced'
			)
		).toBe('screen and (min-width: 0px) and (min-width: 40rem)');
	});
});
