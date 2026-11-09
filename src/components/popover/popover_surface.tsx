import clsx from 'clsx';
import {
	useEffect,
	type CSSProperties,
	type KeyboardEvent,
	type ReactNode,
	type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { OVERLAY_BG, OVERLAY_BORDER } from '#components/shared/surface_tokens';
import { getTabbableElements } from '#components/shared/tabbable';

interface PopoverSurfaceProps {
	panelRef: RefObject<HTMLDivElement | null>;
	setFloating: (node: HTMLElement | null) => void;
	floatingStyles: CSSProperties;
	isVisible: boolean;
	isPositioned: boolean;
	radius: Radius;
	unstyled: boolean;
	panelClassName?: string;
	id: string;
	ariaLabel?: string;
	ariaLabelledBy?: string;
	initialFocusRef?: RefObject<HTMLElement | null>;
	/** Called after Tab leaves the panel's last element (or Shift+Tab its first). */
	onTabOut: () => void;
	portalTarget: HTMLElement;
	children: ReactNode;
}

/**
 * Portal and animated non-modal panel behind `Popover`. Once visible and
 * positioned it moves focus to `initialFocusRef`, else to the first tabbable
 * element, else to the panel itself.
 */
export function PopoverSurface({
	panelRef,
	setFloating,
	floatingStyles,
	isVisible,
	isPositioned,
	radius,
	unstyled,
	panelClassName,
	id,
	ariaLabel,
	ariaLabelledBy,
	initialFocusRef,
	onTabOut,
	portalTarget,
	children,
}: Readonly<PopoverSurfaceProps>) {
	useEffect(() => {
		if (!isVisible || !isPositioned) return;
		const panel = panelRef.current;
		if (!panel) return;
		const target =
			initialFocusRef?.current ?? getTabbableElements(panel)[0] ?? panel;
		target.focus();
	}, [isVisible, isPositioned, panelRef, initialFocusRef]);

	const handleKeyDown = (event: KeyboardEvent) => {
		const panel = panelRef.current;
		if (event.key !== 'Tab' || !panel) return;
		const tabbables = getTabbableElements(panel);
		const edge = event.shiftKey ? tabbables[0] : tabbables.at(-1);
		const isLeaving = document.activeElement === (edge ?? panel);
		if (!isLeaving) return;
		event.preventDefault();
		onTabOut();
	};

	return createPortal(
		<div ref={setFloating} style={floatingStyles} className="z-50">
			<div
				ref={panelRef}
				id={id}
				role="dialog"
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				tabIndex={-1}
				data-state={isVisible ? 'open' : 'closed'}
				onKeyDown={handleKeyDown}
				className={clsx(
					'w-max ms-floating-panel-scroll',
					!unstyled && [
						'max-w-sm origin-top border p-3 shadow-lg backdrop-blur-sm',
						'transition-[opacity,transform] duration-150 ease-out',
						isVisible ? 'scale-100 opacity-100' : 'ms-menu-surface-closed',
						OVERLAY_BG,
						OVERLAY_BORDER,
						RADIUS_CLASSES[radius],
					],
					panelClassName
				)}
			>
				{children}
			</div>
		</div>,
		portalTarget
	);
}
