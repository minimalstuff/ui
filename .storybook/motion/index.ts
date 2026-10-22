export type MotionMode = 'system' | 'full' | 'reduced';

export const DEFAULT_MOTION_MODE: MotionMode = 'system';

const ALWAYS_TRUE_CONDITION = '(min-width: 0px)';
const ALWAYS_FALSE_CONDITION = '((min-width: 1px) and (max-width: 0px))';

const REDUCED_MOTION_FEATURE_PATTERN =
	/\(\s*prefers-reduced-motion\s*(?::\s*(reduce|no-preference))?\s*\)/gi;

/**
 * Whether the forced mode makes `(prefers-reduced-motion: reduce)` match.
 * A bare `(prefers-reduced-motion)` is true for any value but `no-preference`,
 * so it behaves like `reduce`.
 */
function doesForcedModePreferReducedMotion(mode: MotionMode): boolean {
	return mode === 'reduced';
}

/**
 * Replaces every `prefers-reduced-motion` feature of a media query with a
 * constant condition, so the query evaluates as if the browser preference
 * matched the forced mode. The `system` mode leaves the query untouched.
 */
export function substituteReducedMotionQuery(
	mediaQuery: string,
	mode: MotionMode
): string {
	if (mode === 'system') return mediaQuery;
	const prefersReducedMotion = doesForcedModePreferReducedMotion(mode);
	return mediaQuery.replace(
		REDUCED_MOTION_FEATURE_PATTERN,
		(_match, requestedValue: string | undefined) => {
			const isAskingForNoPreference =
				requestedValue?.toLowerCase() === 'no-preference';
			const isConditionTrue = isAskingForNoPreference
				? !prefersReducedMotion
				: prefersReducedMotion;
			return isConditionTrue ? ALWAYS_TRUE_CONDITION : ALWAYS_FALSE_CONDITION;
		}
	);
}

export function isMotionMode(value: unknown): value is MotionMode {
	return value === 'system' || value === 'full' || value === 'reduced';
}
