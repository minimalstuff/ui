import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

import { MenuCloseContext } from '#components/menu/menu_context';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { OVERLAY_BG, OVERLAY_BORDER } from '#components/shared/surface_tokens';

const ENABLED = ':not(:disabled):not([aria-disabled="true"])';
const MENU_ITEM_SELECTOR = `[role="menuitem"]${ENABLED}, [role="menuitemradio"]${ENABLED}`;

interface MenuSurfaceProps {
	setFloating: (node: HTMLElement | null) => void;
	floatingStyles: CSSProperties;
	isVisible: boolean;
	isPositioned: boolean;
	radius: Radius;
	onClose: () => void;
	children: ReactNode;
}

function focusMenuItemAt(container: HTMLElement, index: number) {
	const items = Array.from(
		container.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)
	);
	if (items.length === 0) return;
	const clampedIndex = ((index % items.length) + items.length) % items.length;
	items[clampedIndex]?.focus({ preventScroll: true });
}

/**
 * Shared portal + backdrop + animated panel shell behind `Menu` (trigger
 * dropdown) and `ContextMenu` (right-click): the only difference between
 * the two is how they anchor to floating-ui (a real trigger element vs. a
 * virtual point at the cursor). Owns the WAI-ARIA menu keyboard pattern
 * (arrow keys, Home/End, Escape/Tab-to-close) by querying `[role="menuitem"]`
 * descendants rather than tracking item refs, since `children` is an opaque
 * `ReactNode` (the same technique `ModalShell`'s focus trap already uses in
 * this repo). Close-on-select is provided to `MenuItem` via context instead,
 * since `MenuItem` itself stops click propagation.
 */
export function MenuSurface({
	setFloating,
	floatingStyles,
	isVisible,
	isPositioned,
	radius,
	onClose,
	children,
}: Readonly<MenuSurfaceProps>) {
	const panelRef = useRef<HTMLDivElement>(null);

	// Wait for a real position before focusing: focusing an element still
	// sitting at floating-ui's un-positioned (0, 0) default scrolls the page
	// there, since `.focus()` scrolls its target into view by default.
	useEffect(() => {
		if (!isPositioned) return;
		const container = panelRef.current;
		if (!container) return;
		const firstItem = container.querySelector<HTMLElement>(MENU_ITEM_SELECTOR);
		firstItem?.focus({ preventScroll: true });
	}, [isPositioned]);

	const handleKeyDown = (event: React.KeyboardEvent) => {
		const container = panelRef.current;
		if (!container) return;

		const items = Array.from(
			container.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)
		);
		const currentIndex = items.indexOf(document.activeElement as HTMLElement);

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			focusMenuItemAt(container, currentIndex + 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			focusMenuItemAt(container, currentIndex - 1);
		} else if (event.key === 'Home') {
			event.preventDefault();
			focusMenuItemAt(container, 0);
		} else if (event.key === 'End') {
			event.preventDefault();
			focusMenuItemAt(container, items.length - 1);
		} else if (event.key === 'Escape' || event.key === 'Tab') {
			onClose();
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
					role="menu"
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
