import { useId } from 'react';

interface FieldIds {
	fieldId: string;
	errorId: string;
	descriptionId: string;
	labelId: string;
}

/**
 * Resolves the ids a field needs for its ARIA wiring. A caller-supplied `id` is
 * used verbatim so external `<label for>` and `getElementById` keep working;
 * only the fallback is generated.
 */
export function useFieldIds(id: string | undefined): FieldIds {
	const generatedId = useId();
	const fieldId = id ?? generatedId;

	return {
		fieldId,
		errorId: `${fieldId}-error`,
		descriptionId: `${fieldId}-description`,
		labelId: `${fieldId}-label`,
	};
}
