import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
	type Placement,
} from '@floating-ui/react-dom';
import {
	cloneElement,
	isValidElement,
	useCallback,
	useRef,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
} from 'react';

import { type Radius } from '#components/shared/radius';
import { MenuSurface } from '#components/menu/menu_surface';
import { FLOATING_VIEWPORT_PADDING } from '#components/shared/floating';
import {
	useEnterOnPositioned,
	useOverlayState,
} from '#components/shared/use_overlay_state';

const OFFSET_FROM_TRIGGER = 4;

export type MenuSide = 'top' | 'bottom' | 'left' | 'right';
export type MenuAlign = 'start' | 'center' | 'end';

function toPlacement(side: MenuSide, align: MenuAlign): Placement {
	return align === 'center' ? side : `${side}-${align}`;
}

interface TriggerProps {
	onClick?: (event: MouseEvent) => void;
	'aria-haspopup'?: 'menu';
	'aria-expanded'?: boolean;
}

export interface MenuProps {
	trigger: ReactElement;
	children: ReactNode;
	side?: MenuSide;
	align?: MenuAlign;
	radius?: Radius;
}

/**
 * A dropdown anchored to `trigger` (e.g. a kebab `IconButton`): click to
 * open, click again/click outside/Escape to close. `children` must be
 * `MenuItem` elements as direct children (see `MenuItem`'s own doc comment)
 * for keyboard nav and close-on-select to work.
 *
 * For "right-click anywhere on this area" instead of a specific trigger
 * button, use `ContextMenu`.
 */
export function Menu({
	trigger,
	children,
	side = 'bottom',
	align = 'start',
	radius = 'md',
}: Readonly<MenuProps>) {
	const wrapperRef = useRef<HTMLSpanElement>(null);
	const { isMounted, isVisible, setIsVisible, open, close } = useOverlayState();

	const { refs, floatingStyles, isPositioned } = useFloating({
		placement: toPlacement(side, align),
		open: isMounted,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(OFFSET_FROM_TRIGGER),
			flip(),
			shift({ padding: FLOATING_VIEWPORT_PADDING }),
		],
	});

	useEnterOnPositioned(isMounted, isPositioned, setIsVisible);

	const closeAndReturnFocus = useCallback(() => {
		close();
		wrapperRef.current
			?.querySelector<HTMLElement>('button, [href], [tabindex]')
			?.focus();
	}, [close]);

	// Memoized so React doesn't call it with `null` then the node again on
	// every re-render, which would needlessly reset floating-ui's reference.
	const setWrapperRef = useCallback(
		(node: HTMLSpanElement | null) => {
			refs.setReference(node);
			wrapperRef.current = node;
		},
		[refs]
	);

	const handleTriggerClick = (event: MouseEvent) => {
		event.stopPropagation();
		// Toggle on `isVisible`, not `isMounted`: `isMounted` stays true for
		// the whole 150ms exit fade, so a click during that window would
		// otherwise just re-trigger close() instead of cancelling it and
		// reopening.
		if (isVisible) {
			close();
		} else {
			open(isPositioned);
		}
		if (isValidElement<TriggerProps>(trigger)) {
			trigger.props.onClick?.(event);
		}
	};

	const triggerProps: TriggerProps = {
		onClick: handleTriggerClick,
		'aria-haspopup': 'menu',
		'aria-expanded': isMounted,
	};

	const clonedTrigger = isValidElement<TriggerProps>(trigger)
		? cloneElement(trigger, triggerProps)
		: trigger;

	return (
		<span ref={setWrapperRef} className="inline-block">
			{clonedTrigger}
			{isMounted && (
				<MenuSurface
					setFloating={refs.setFloating}
					floatingStyles={floatingStyles}
					isVisible={isVisible}
					isPositioned={isPositioned}
					radius={radius}
					onClose={closeAndReturnFocus}
				>
					{children}
				</MenuSurface>
			)}
		</span>
	);
}
