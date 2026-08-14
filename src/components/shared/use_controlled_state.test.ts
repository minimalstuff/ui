import { act } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useControlledState } from './use_controlled_state';

describe('useControlledState', () => {
	test('starts at the default value when uncontrolled', () => {
		const { result } = renderHook(() => useControlledState(undefined, 'a'));
		expect(result.current[0]).toBe('a');
	});

	test('updates internal state when uncontrolled', () => {
		const { result } = renderHook(() => useControlledState(undefined, 'a'));

		act(() => {
			result.current[1]('b');
		});

		expect(result.current[0]).toBe('b');
	});

	test('ignores updates and stays on the caller value when controlled', () => {
		const { result } = renderHook(() => useControlledState('fixed', 'a'));

		act(() => {
			result.current[1]('b');
		});

		expect(result.current[0]).toBe('fixed');
	});
});
