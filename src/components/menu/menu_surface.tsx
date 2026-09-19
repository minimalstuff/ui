import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

import { MenuCloseContext } from '#components/menu/menu_context';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { findTypeaheadIndex } from '#components/menu/find_typeahead_index';
import { OVERLAY_BG, OVERLAY_BORDER } from '#components/shared/surface_tokens';

const ENABLED = ':not(:disabled):not([aria-disabled="true"])';
const MENU_ITEM_SELECTOR = `[role="menuitem"]${ENABLED}, [role="menuitemradio"]${ENABLED}`;

type MenuSurfaceInitialFocus = 'first' | 'last';

interface MenuSurfaceProps {
	setFloating: (node: HTMLElement | null) => void;
	floatingStyles: CSSProperties;
	isVisible: boolean;
	isPositioned: boolean;
	radius: Radius;
	onClose: () => void;
	children: ReactNode;
	/** Sets the `id` on the `role="menu"` element, e.g. for a trigger's `aria-controls`. */
	id?: string;
	/** Names the menu via `aria-labelledby`, typically the trigger's id. */
	labelledBy?: string;
	/** Names the menu directly, for menus with no single labelling element (e.g. `ContextMenu`). */
	'aria-label'?: string;
	/** Which item to focus once positioned: the first (default) or the last, e.g. when opened via ArrowUp. */
	initialFocus?: MenuSurfaceInitialFocus;
}

function getMenuItems(container: HTMLElement): HTMLElement[] {
	return Array.from(
		container.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)
	);
}

function focusMenuItemAt(container: HTMLElement, index: number) {
	const items = getMenuItems(container);
	if (items.length === 0) return;
	const clampedIndex = ((index % items.length) + items.length) % items.length;
	items[clampedIndex]?.focus({ preventScroll: true });
}

/** Arrow/Home/End navigation. Returns whether it handled `event`. */
function handleNavigationKey(
	event: React.KeyboardEvent,
	container: HTMLElement,
	items: HTMLElement[],
	currentIndex: number
): boolean {
	if (event.key === 'ArrowDown') {
		focusMenuItemAt(container, currentIndex + 1);
	} else if (event.key === 'ArrowUp') {
		focusMenuItemAt(container, currentIndex - 1);
	} else if (event.key === 'Home') {
		focusMenuItemAt(container, 0);
	} else if (event.key === 'End') {
		focusMenuItemAt(container, items.length - 1);
	} else {
		return false;
	}
	event.preventDefault();
	return true;
}

/**
 * A single printable character with no modifier triggers typeahead. Space is
 * excluded so it keeps activating the focused item natively instead.
 */
function isTypeaheadCharacter(event: React.KeyboardEvent): boolean {
	return (
		event.key.length === 1 &&
		event.key !== ' ' &&
		!event.ctrlKey &&
		!event.metaKey &&
		!event.altKey
	);
}

function focusTypeaheadMatch(
	container: HTMLElement,
	items: HTMLElement[],
	currentIndex: number,
	character: string
) {
	const labels = items.map((item) => item.textContent?.trim() ?? '');
	const matchIndex = findTypeaheadIndex(labels, currentIndex, character);
	if (matchIndex !== -1) focusMenuItemAt(container, matchIndex);
}

/**
 * Shared portal + backdrop + animated panel shell behind `Menu` (trigger
 * dropdown) and `ContextMenu` (right-click): the only difference between
 * the two is how they anchor to floating-ui (a real trigger element vs. a
 * virtual point at the cursor). Owns the WAI-ARIA menu keyboard pattern
 * (arrow keys, Home/End, Escape/Tab-to-close, single-character typeahead) by
 * querying `[role="menuitem"]` descendants rather than tracking item refs,
 * since `children` is an opaque `ReactNode` (the same technique
 * `ModalShell`'s focus trap already uses in this repo). Close-on-select is
 * provided to `MenuItem` via context instead, since `MenuItem` itself stops
 * click propagation.
 *
 * Escape calls `event.preventDefault()` before `onClose()`, so a parent
 * `Modal` (which ignores Escape once `defaultPrevented`) stays open while the
 * menu itself closes; Tab closes without preventing the default so native
 * focus movement still happens.
 */
export function MenuSurface({
	setFloating,
	floatingStyles,
	isVisible,
	isPositioned,
	radius,
	onClose,
	children,
	id,
	labelledBy,
	'aria-label': ariaLabel,
	initialFocus = 'first',
}: Readonly<MenuSurfaceProps>) {
	const panelRef = useRef<HTMLDivElement>(null);

	// Wait for a real position before focusing: focusing an element still
	// sitting at floating-ui's un-positioned (0, 0) default scrolls the page
	// there, since `.focus()` scrolls its target into view by default.
	useEffect(() => {
		if (!isPositioned) return;
		const container = panelRef.current;
		if (!container) return;
		const items = getMenuItems(container);
		const targetItem =
			initialFocus === 'last' ? items[items.length - 1] : items[0];
		targetItem?.focus({ preventScroll: true });
	}, [isPositioned, initialFocus]);

	const handleKeyDown = (event: React.KeyboardEvent) => {
		const container = panelRef.current;
		if (!container) return;

		const items = getMenuItems(container);
		const currentIndex = items.indexOf(document.activeElement as HTMLElement);

		if (handleNavigationKey(event, container, items, currentIndex)) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			onClose();
		} else if (event.key === 'Tab') {
			onClose();
		} else if (isTypeaheadCharacter(event)) {
			focusTypeaheadMatch(container, items, currentIndex, event.key);
		}
	};

	return createPortal(
		<>
			<div
				className="fixed inset-0 z-40"
				onClick={onClose}
				aria-hidden="true"
			/>
			<div ref={setFloating} style={floatingStyles} className="z-50">
				<div
					ref={panelRef}
					id={id}
					role="menu"
					aria-label={ariaLabel}
					aria-labelledby={labelledBy}
					tabIndex={-1}
					data-state={isVisible ? 'open' : 'closed'}
					onKeyDown={handleKeyDown}
					className={clsx(
						'w-max min-w-40 max-w-xs origin-top border py-1 shadow-lg backdrop-blur-sm',
						'transition-[opacity,transform] duration-150 ease-out',
						isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
						OVERLAY_BG,
						OVERLAY_BORDER,
						RADIUS_CLASSES[radius]
					)}
					onClick={(event) => event.stopPropagation()}
				>
					<MenuCloseContext.Provider value={onClose}>
						{children}
					</MenuCloseContext.Provider>
				</div>
			</div>
		</>,
		document.body
	);
}
