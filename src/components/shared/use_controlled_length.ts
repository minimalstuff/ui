import { useState } from 'react';

type FieldValue = string | number | readonly string[] | undefined;

function lengthOf(value: FieldValue): number {
	return typeof value === 'string' ? value.length : 0;
}

interface ControlledLength {
	length: number;
	trackLength: (next: string) => void;
}

/**
 * Tracks the character count of a field that may be controlled or not. A
 * controlled value is measured directly; otherwise the length is kept in state
 * and the caller feeds it from its own change handler.
 */
export function useControlledLength(
	value: FieldValue,
	defaultValue: FieldValue
): ControlledLength {
	const [uncontrolledLength, setUncontrolledLength] = useState(
		lengthOf(defaultValue)
	);
	const isControlled = value !== undefined;

	return {
		length: isControlled ? lengthOf(value) : uncontrolledLength,
		trackLength: (next: string) => {
			if (!isControlled) setUncontrolledLength(next.length);
		},
	};
}
