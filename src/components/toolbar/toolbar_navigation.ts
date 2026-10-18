export type ToolbarOrientation = 'horizontal' | 'vertical';

type KeyStep = (currentPosition: number, itemCount: number) => number;

const NEXT_STEP: KeyStep = (currentPosition, itemCount) =>
	(currentPosition + 1) % itemCount;

const PREVIOUS_STEP: KeyStep = (currentPosition, itemCount) =>
	(currentPosition - 1 + itemCount) % itemCount;

const FIRST_STEP: KeyStep = () => 0;

const LAST_STEP: KeyStep = (_currentPosition, itemCount) => itemCount - 1;

const STEP_BY_KEY: Record<ToolbarOrientation, Record<string, KeyStep>> = {
	horizontal: {
		ArrowRight: NEXT_STEP,
		ArrowLeft: PREVIOUS_STEP,
		Home: FIRST_STEP,
		End: LAST_STEP,
	},
	vertical: {
		ArrowDown: NEXT_STEP,
		ArrowUp: PREVIOUS_STEP,
		Home: FIRST_STEP,
		End: LAST_STEP,
	},
};

/**
 * Resolves which item a key press should focus, wrapping around at both
 * ends. Returns `undefined` for keys the toolbar does not handle or when
 * there is no item to move to.
 */
export function getTargetPosition(params: {
	key: string;
	orientation: ToolbarOrientation;
	currentPosition: number;
	itemCount: number;
}): number | undefined {
	const { key, orientation, currentPosition, itemCount } = params;
	const step = STEP_BY_KEY[orientation][key];
	if (!step || itemCount === 0) return undefined;

	return step(currentPosition, itemCount);
}
