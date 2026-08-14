import { describe, expect, test } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useControlledLength } from './use_controlled_length';

describe('useControlledLength', () => {
	test('starts at the default value length when uncontrolled', () => {
		const { result } = renderHook(() =>
			useControlledLength(undefined, 'hello')
		);
		expect(result.current.length).toBe(5);
	});

	test('tracks length as the caller reports changes when uncontrolled', () => {
		const { result } = renderHook(() => useControlledLength(undefined, ''));

		act(() => {
			result.current.trackLength('hello world');
		});

		expect(result.current.length).toBe(11);
	});

	test('measures the caller value directly when controlled', () => {
		const { result } = renderHook(() => useControlledLength('fixed', ''));
		expect(result.current.length).toBe(5);
	});

	test('ignores trackLength when controlled', () => {
		const { result } = renderHook(() => useControlledLength('fixed', ''));

		act(() => {
			result.current.trackLength('something longer');
		});

		expect(result.current.length).toBe(5);
	});
});
