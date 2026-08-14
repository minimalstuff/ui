import { describe, expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useFieldIds } from './use_field_ids';

describe('useFieldIds', () => {
	test('uses the caller-supplied id verbatim', () => {
		const { result } = renderHook(() => useFieldIds('email'));
		expect(result.current.fieldId).toBe('email');
		expect(result.current.errorId).toBe('email-error');
		expect(result.current.descriptionId).toBe('email-description');
	});

	test('generates a unique id when none is given', () => {
		const first = renderHook(() => useFieldIds(undefined));
		const second = renderHook(() => useFieldIds(undefined));
		expect(first.result.current.fieldId).not.toBe(
			second.result.current.fieldId
		);
	});
});
