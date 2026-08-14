/**
 * Exit durations, in milliseconds. Each one must stay in step with the
 * `duration-*` class on the element it unmounts, or the node is torn down
 * mid-fade.
 */

/** Matches `duration-200` on the modal backdrop and dialog. */
export const MODAL_EXIT_DURATION_MS = 200;

/** Matches `duration-150` on the menu and tooltip panels. */
export const OVERLAY_EXIT_DURATION_MS = 150;
