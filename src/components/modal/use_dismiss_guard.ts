import { useContext, useEffect, useLayoutEffect, useRef } from 'react';

import { type DismissGuard } from '#components/modal/dismiss_guard';
import { DismissGuardContext } from '#components/modal/dismiss_guard_context';

export type { DismissGuard } from '#components/modal/dismiss_guard';

/**
 * Runs `guard` before every user dismissal of the enclosing `Modal` or
 * `Drawer`: Escape, backdrop click, the header close button and the `close`
 * passed to a `Modal` render-prop child. `true` lets the dismissal proceed,
 * `false` keeps the dialog open. Programmatic ends (`Modal.end`, a `Drawer`
 * whose `isOpen` turns `false`) bypass it. While an async guard is pending,
 * further dismissals are ignored; if it throws or rejects, the dialog stays
 * open and the error is surfaced to the global handler.
 *
 * Works from any depth inside the dialog, including a `ModalFooter`. One
 * guard per dialog is enough; if several register, the most recent wins, and
 * the previous one takes over when it unregisters.
 *
 * `isEnabled` defaults to `true`; pass `false` (e.g. while a form is clean)
 * to unregister the guard. Throws when used outside a `Modal` or `Drawer`.
 */
export function useDismissGuard(guard: DismissGuard, isEnabled = true): void {
	const registry = useContext(DismissGuardContext);
	const guardRef = useRef(guard);

	useLayoutEffect(() => {
		guardRef.current = guard;
	});

	useEffect(() => {
		if (!registry || !isEnabled) return;
		return registry.register(guardRef);
	}, [registry, isEnabled]);

	if (!registry) {
		throw new Error('useDismissGuard must be used inside a Modal or a Drawer');
	}
}
