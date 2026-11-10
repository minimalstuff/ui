import { useCallback, useLayoutEffect, useRef } from 'react';

import { type PopoverOpenChangeDetails } from '#components/popover/popover_open_change';
import { useControlledState } from '#components/shared/use_controlled_state';
import { useStableCallback } from '#components/shared/use_stable_callback';

interface UsePopoverStateOptions {
	isOpen?: boolean;
	defaultOpen: boolean;
	onOpenChange?: (isOpen: boolean, details: PopoverOpenChangeDetails) => void;
}

interface UsePopoverStateReturn {
	isOpen: boolean;
	setOpen: (next: boolean, details: PopoverOpenChangeDetails) => void;
}

/**
 * Open state of a `Popover`, controlled or not. `setOpen` notifies
 * `onOpenChange` once per real change: asking for the state already rendered,
 * or asking twice for the same state within one event (Escape then blur, say),
 * is ignored, so the first reason reported wins.
 */
export function usePopoverState({
	isOpen: controlledIsOpen,
	defaultOpen,
	onOpenChange,
}: Readonly<UsePopoverStateOptions>): UsePopoverStateReturn {
	const [isOpen, setIsOpen] = useControlledState(controlledIsOpen, defaultOpen);
	const renderedIsOpenRef = useRef(isOpen);
	const pendingIsOpenRef = useRef<boolean | undefined>(undefined);
	const notifyOpenChange = useStableCallback(
		(next: boolean, details: PopoverOpenChangeDetails) =>
			onOpenChange?.(next, details)
	);

	useLayoutEffect(() => {
		renderedIsOpenRef.current = isOpen;
	});

	const setOpen = useCallback(
		(next: boolean, details: PopoverOpenChangeDetails) => {
			if (renderedIsOpenRef.current === next) return;
			if (pendingIsOpenRef.current === next) return;
			pendingIsOpenRef.current = next;
			queueMicrotask(() => {
				pendingIsOpenRef.current = undefined;
			});
			setIsOpen(next);
			notifyOpenChange(next, details);
		},
		[setIsOpen, notifyOpenChange]
	);

	return { isOpen, setOpen };
}
