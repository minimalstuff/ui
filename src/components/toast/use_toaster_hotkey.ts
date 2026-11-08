import { useEffect, type RefObject } from 'react';

import { useGlobalHotkeysStore } from '#stores/global_hotkeys_store/global_hotkeys_store';
import { useToastStore } from '#stores/toast_store/toast_store';

export const TOASTER_JUMP_KEY = 'F8';

interface UseToasterHotkeyOptions {
	regionRef: RefObject<HTMLElement | null>;
	previousFocusRef: RefObject<HTMLElement | null>;
}

function hasModifier(event: KeyboardEvent): boolean {
	return event.ctrlKey || event.altKey || event.metaKey || event.shiftKey;
}

function hasOpenToast(): boolean {
	return useToastStore.getState().entries.some((entry) => !entry.isClosing);
}

function getFocusedElement(): HTMLElement | null {
	const { activeElement } = document;
	if (!(activeElement instanceof HTMLElement)) return null;
	return activeElement === document.body ? null : activeElement;
}

/**
 * F8 moves focus to the toasts region, and back to the element focused before
 * when pressed again. Inert while a Modal or Drawer is open (they disable the
 * global hotkeys) and when no toast is open.
 */
export function useToasterHotkey({
	regionRef,
	previousFocusRef,
}: Readonly<UseToasterHotkeyOptions>): void {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== TOASTER_JUMP_KEY || hasModifier(event)) return;
			if (event.defaultPrevented) return;
			if (!useGlobalHotkeysStore.getState().globalHotkeysEnabled) return;
			const region = regionRef.current;
			if (!region || !hasOpenToast()) return;

			if (region.contains(document.activeElement)) {
				const previousFocus = previousFocusRef.current;
				if (!previousFocus?.isConnected) return;
				previousFocus.focus();
			} else {
				const focusedElement = getFocusedElement();
				region.focus();
				previousFocusRef.current = focusedElement;
			}
			event.preventDefault();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [regionRef, previousFocusRef]);
}
