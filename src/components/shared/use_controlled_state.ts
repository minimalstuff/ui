import { useCallback, useState } from 'react';

/**
 * Backs a control that works both controlled and uncontrolled. While a
 * `controlledValue` is supplied it wins and the internal state is left alone,
 * so `setValue` is a no-op and the owner drives every update. Change callbacks
 * stay with the caller: this hook only tracks the value.
 */
export function useControlledState<TValue>(
	controlledValue: TValue | undefined,
	defaultValue: TValue
): readonly [TValue, (next: TValue) => void] {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const isControlled = controlledValue !== undefined;

	const setValue = useCallback(
		(next: TValue) => {
			if (!isControlled) setInternalValue(next);
		},
		[isControlled]
	);

	return [isControlled ? controlledValue : internalValue, setValue];
}
