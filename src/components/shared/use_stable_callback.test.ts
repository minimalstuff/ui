import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { useStableCallback } from '#components/shared/use_stable_callback';

describe('useStableCallback', () => {
	test('should keep the same identity across renders', () => {
		const { result, rerender } = renderHook(
			({ callback }) => useStableCallback(callback),
			{ initialProps: { callback: () => {} } }
		);
		const firstIdentity = result.current;

		rerender({ callback: () => {} });

		expect(result.current).toBe(firstIdentity);
	});

	test('should call the latest callback after a rerender', () => {
		const first = vi.fn<(value: string) => void>();
		const latest = vi.fn<(value: string) => void>();
		const { result, rerender } = renderHook(
			({ callback }) => useStableCallback(callback),
			{ initialProps: { callback: first } }
		);

		rerender({ callback: latest });
		result.current('clicked');

		expect(first).not.toHaveBeenCalled();
		expect(latest).toHaveBeenCalledWith('clicked');
	});
});
