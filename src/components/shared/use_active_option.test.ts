import { describe, expect, test, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useActiveOption } from './use_active_option';

const OPTION_COUNT = 3;
const getOptionId = (index: number) => `option-${index}`;

describe('useActiveOption', () => {
	test('starts with no active option', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: OPTION_COUNT, getOptionId, isOpen: true })
		);

		expect(result.current.activeIndex).toBe(-1);
	});

	test('reports no active option when the stored index exceeds the option count', () => {
		const { result, rerender } = renderHook(
			({ optionCount }) =>
				useActiveOption({ optionCount, getOptionId, isOpen: true }),
			{ initialProps: { optionCount: OPTION_COUNT } }
		);

		act(() => {
			result.current.last();
		});
		expect(result.current.activeIndex).toBe(OPTION_COUNT - 1);

		rerender({ optionCount: 1 });

		expect(result.current.activeIndex).toBe(-1);
	});

	test('wraps to the first option when moving forward past the end', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: OPTION_COUNT, getOptionId, isOpen: true })
		);

		act(() => {
			result.current.last();
			result.current.move(1);
		});

		expect(result.current.activeIndex).toBe(0);
	});

	test('wraps to the last option when moving backward from -1', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: OPTION_COUNT, getOptionId, isOpen: true })
		);

		act(() => {
			result.current.move(-1);
		});

		expect(result.current.activeIndex).toBe(OPTION_COUNT - 1);
	});

	test('wraps to the last option when moving backward from the first option', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: OPTION_COUNT, getOptionId, isOpen: true })
		);

		act(() => {
			result.current.first();
			result.current.move(-1);
		});

		expect(result.current.activeIndex).toBe(OPTION_COUNT - 1);
	});

	test('does not move when the option list is empty', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: 0, getOptionId, isOpen: true })
		);

		act(() => {
			result.current.move(1);
		});

		expect(result.current.activeIndex).toBe(-1);
	});

	test('activates the first option', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: OPTION_COUNT, getOptionId, isOpen: true })
		);

		act(() => {
			result.current.move(1);
			result.current.first();
		});

		expect(result.current.activeIndex).toBe(0);
	});

	test('activates the last option', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: OPTION_COUNT, getOptionId, isOpen: true })
		);

		act(() => {
			result.current.last();
		});

		expect(result.current.activeIndex).toBe(OPTION_COUNT - 1);
	});

	test('leaves no option active when calling first on an empty list', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: 0, getOptionId, isOpen: true })
		);

		act(() => {
			result.current.first();
		});

		expect(result.current.activeIndex).toBe(-1);
	});

	test('leaves no option active when calling last on an empty list', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: 0, getOptionId, isOpen: true })
		);

		act(() => {
			result.current.last();
		});

		expect(result.current.activeIndex).toBe(-1);
	});

	test('resets the active option back to none', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: OPTION_COUNT, getOptionId, isOpen: true })
		);

		act(() => {
			result.current.last();
			result.current.reset();
		});

		expect(result.current.activeIndex).toBe(-1);
	});

	test('reports no active option id when the list is closed', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: OPTION_COUNT, getOptionId, isOpen: false })
		);

		act(() => {
			result.current.first();
		});

		expect(result.current.activeOptionId).toBeUndefined();
	});

	test('reports the active option id when the list is open', () => {
		const { result } = renderHook(() =>
			useActiveOption({ optionCount: OPTION_COUNT, getOptionId, isOpen: true })
		);

		act(() => {
			result.current.first();
		});

		expect(result.current.activeOptionId).toBe('option-0');
	});

	test('scrolls the active option into view when it changes', () => {
		const scrollIntoView = vi.fn();
		const optionElement = document.createElement('li');
		optionElement.id = 'option-0';
		optionElement.scrollIntoView = scrollIntoView;
		document.body.append(optionElement);

		const { result } = renderHook(() =>
			useActiveOption({ optionCount: OPTION_COUNT, getOptionId, isOpen: true })
		);

		act(() => {
			result.current.first();
		});

		expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });

		optionElement.remove();
	});
});
