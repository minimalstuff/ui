import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useIsClient } from './use_is_client';

describe('useIsClient', () => {
	test('returns false on first render then true after mount', async () => {
		const { result } = renderHook(() => useIsClient());
		expect(result.current).toBe(false);
		await waitFor(() => {
			expect(result.current).toBe(true);
		});
	});
});
