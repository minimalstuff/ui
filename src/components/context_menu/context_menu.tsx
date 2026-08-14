import { type MouseEvent, type ReactNode, useCallback, useRef } from 'react';
import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
	type VirtualElement,
} from '@floating-ui/react-dom';

import { type Radius } from '#components/shared/radius';
import { MenuSurface } from '#components/menu/menu_surface';
import {
	useEnterOnPositioned,
	useMenuState,
} from '#components/menu/use_menu_state';

const CURSOR_OFFSET = 2;
const VIEWPORT_PADDING = 8;

interface ContextMenuProps {
	/** The area that opens the menu on right-click. */
	children: ReactNode;
	/** `MenuItem` elements shown in the menu. */
	items: ReactNode;
	radius?: Radius;
}

function virtualElementAt(x: number, y: number): VirtualElement {
	return {
		getBoundingClientRect: () => ({
			width: 0,
			height: 0,
			x,
			y,
			top: y,
			left: x,
			right: x,
			bottom: y,
		}),
	};
}

/**
 * Keyboard-invoked context menus (Shift+F10, the Menu key) fire `contextmenu`
 * with no cursor, reported as (0, 0). Anchoring there would pin the menu to
 * the viewport corner, so fall back to the focused element's own corner.
 */
function resolveAnchorPoint(event: MouseEvent): { x: number; y: number } {
	if (event.clientX !== 0 || event.clientY !== 0) {
		return { x: event.clientX, y: event.clientY };
	}

	const rect = (event.target as HTMLElement | null)?.getBoundingClientRect();
	return rect ? { x: rect.left, y: rect.bottom } : { x: 0, y: 0 };
}

/**
 * Wraps `children` (the right-click target area) and opens `items`, a list
 * of `MenuItem` elements as direct children (see `MenuItem`'s own doc
 * comment), at the cursor position. Right-click again elsewhere on the
 * wrapped area to reposition it.
 *
 * For a menu anchored to a specific button (e.g. a kebab icon) instead of a
 * right-click, use `Menu`.
 */
export function ContextMenu({
	children,
	items,
	radius = 'md',
}: Readonly<ContextMenuProps>) {
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);
	const { isMounted, isVisible, setIsVisible, open, close } = useMenuState();

	const { refs, floatingStyles, isPositioned } = useFloating({
		placement: 'bottom-start',
		open: isMounted,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(CURSOR_OFFSET),
			flip(),
			shift({ padding: VIEWPORT_PADDING }),
		],
	});

	useEnterOnPositioned(isMounted, isPositioned, setIsVisible);

	const closeAndReturnFocus = useCallback(() => {
		close();
		previouslyFocusedRef.current?.focus();
	}, [close]);

	const handleContextMenu = (event: MouseEvent) => {
		event.preventDefault();
		previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
		const { x, y } = resolveAnchorPoint(event);
		refs.setReference(virtualElementAt(x, y));
		// Always a fresh position for a new click point: defer to the
		// enter-transition effect rather than trying to reuse `isPositioned`
		// from wherever the previous click happened.
		open(false);
	};

	return (
		<div onContextMenu={handleContextMenu}>
			{children}
			{isMounted && (
				<MenuSurface
					setFloating={refs.setFloating}
					floatingStyles={floatingStyles}
					isVisible={isVisible}
					isPositioned={isPositioned}
					radius={radius}
					onClose={closeAndReturnFocus}
				>
					{items}
				</MenuSurface>
			)}
		</div>
	);
}
