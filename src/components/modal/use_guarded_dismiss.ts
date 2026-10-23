import {
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
	type RefObject,
} from 'react';

import { type DismissGuard } from '#components/modal/dismiss_guard';
import { type DismissGuardRegistry } from '#components/modal/dismiss_guard_context';
import { surfaceError } from '#lib/surface_error';

interface UseGuardedDismissOptions {
	onDismiss: () => void;
	isEnded: boolean;
}

interface GuardedDismiss {
	dismiss: () => void;
	registry: DismissGuardRegistry;
}

type GuardRefs = readonly RefObject<DismissGuard>[];

function runGuard(guard: DismissGuard): boolean | Promise<boolean> | null {
	try {
		return guard();
	} catch (error) {
		surfaceError(error);
		return null;
	}
}

/**
 * @internal the user-dismissal path shared by `Modal` and `Drawer`: runs the
 * most recently registered guard (see `useDismissGuard`) before `onDismiss`.
 * `dismiss` and `registry` are referentially stable — not part of the public API.
 */
export function useGuardedDismiss({
	onDismiss,
	isEnded,
}: Readonly<UseGuardedDismissOptions>): GuardedDismiss {
	const onDismissRef = useRef(onDismiss);
	const isEndedRef = useRef(isEnded);
	const guardRefsRef = useRef<GuardRefs>([]);
	const isPendingRef = useRef(false);

	useLayoutEffect(() => {
		onDismissRef.current = onDismiss;
		isEndedRef.current = isEnded;
	});

	const [registry] = useState<DismissGuardRegistry>(() => ({
		register: (guardRef) => {
			guardRefsRef.current = [...guardRefsRef.current, guardRef];
			return () => {
				guardRefsRef.current = guardRefsRef.current.filter(
					(registeredRef) => registeredRef !== guardRef
				);
			};
		},
	}));

	const settleAsyncVerdict = useCallback((verdict: Promise<boolean>) => {
		isPendingRef.current = true;
		verdict.then(
			(isAllowed) => {
				isPendingRef.current = false;
				if (isAllowed && !isEndedRef.current) onDismissRef.current();
			},
			(error: unknown) => {
				isPendingRef.current = false;
				surfaceError(error);
			}
		);
	}, []);

	const dismiss = useCallback(() => {
		if (isPendingRef.current) return;

		const guardRef = guardRefsRef.current.at(-1);
		if (!guardRef) {
			onDismissRef.current();
			return;
		}

		const verdict = runGuard(guardRef.current);
		if (verdict === null) return;
		if (typeof verdict === 'boolean') {
			if (verdict) onDismissRef.current();
			return;
		}
		settleAsyncVerdict(verdict);
	}, [settleAsyncVerdict]);

	return { dismiss, registry };
}
