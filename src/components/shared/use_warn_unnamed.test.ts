import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { useWarnUnnamed } from '#components/shared/use_warn_unnamed';

describe('useWarnUnnamed', () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllEnvs();
	});

	test('should warn once with the default message when unnamed', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const { rerender } = renderHook(() => useWarnUnnamed('Switch', false));
		rerender();

		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(
			'Switch: needs an accessible name. Provide a `label`, `aria-label` or `aria-labelledby` prop.'
		);
	});

	test('should not warn when named', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		renderHook(() => useWarnUnnamed('Switch', true));

		expect(warn).not.toHaveBeenCalled();
	});

	test('should not warn when running in production', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.stubEnv('NODE_ENV', 'production');

		renderHook(() => useWarnUnnamed('Switch', false));

		expect(warn).not.toHaveBeenCalled();
	});
});
