import { createContext, type RefObject } from 'react';

import { type DismissGuard } from '#components/modal/dismiss_guard';

/** @internal the dialog's guard stack, registered into by `useDismissGuard` — not part of the public API. */
export interface DismissGuardRegistry {
	/** Returns the function that unregisters the guard. */
	register: (guardRef: RefObject<DismissGuard>) => () => void;
}

/** @internal provided by `Modal` and `Drawer`, consumed by `useDismissGuard` — not part of the public API. */
export const DismissGuardContext = createContext<DismissGuardRegistry | null>(
	null
);
