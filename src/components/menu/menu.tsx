import clsx from 'clsx';
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
	useId,
	useRef,
	useState,
	type KeyboardEvent,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
	type Ref,
} from 'react';

import { mergeRefs } from '#lib/merge_refs';
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
	id?: string;
	onClick?: (event: MouseEvent) => void;
	onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
	'aria-haspopup'?: 'menu';
	'aria-expanded'?: boolean;
	'aria-controls'?: string;
}

export interface MenuProps {
	trigger: ReactElement;
	children: ReactNode;
	side?: MenuSide;
	align?: MenuAlign;
	radius?: Radius;
	className?: string;
	/** Attaches to the wrapper `<span>` around `trigger`, alongside `Menu`'s own internal ref. */
	ref?: Ref<HTMLSpanElement>;
}

/**
 * A dropdown anchored to `trigger` (e.g. a kebab `IconButton`): click to
 * open, click again/click outside/Escape to close, or ArrowDown/ArrowUp on
 * the closed trigger to open focused on the first/last item respectively.
 * `children` is made of `MenuItem`s, optionally wrapped in `MenuGroup`s and
 * split by `MenuSeparator`s.
 *
 * For "right-click anywhere on this area" instead of a specific trigger
 * button, use `ContextMenu`.
 *
 * Safe to nest inside a `Modal`: Escape on the open menu calls
 * `event.preventDefault()` before closing it (see `MenuSurface`), so the
 * modal's own Escape handler — which ignores an already-`defaultPrevented`
 * event — leaves the dialog open and only the menu closes.
 *
 * Opening a `Modal` from a `MenuItem`'s `onClick` is also safe: the menu
 * returns focus to `trigger` synchronously during the click, then the modal
 * mounts a render later and takes focus from there. That ordering is what
 * makes the modal record `trigger` as its restore target, so focus lands
 * back on the trigger when the modal closes. The menu panel outlives the
 * click by one exit animation, but the modal sits above it and owns Escape
 * (a document listener), so the fading panel is inert. See
 * `menu_with_modal.test.tsx`.
 */
export function Menu({
	trigger,
	children,
	side = 'bottom',
	align = 'start',
	radius = 'md',
	className,
	ref,
}: Readonly<MenuProps>) {
	const wrapperRef = useRef<HTMLSpanElement>(null);
	const [initialFocus, setInitialFocus] = useState<'first' | 'last'>('first');
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

	const generatedTriggerId = useId();
	const triggerId =
		(isValidElement<TriggerProps>(trigger) ? trigger.props.id : undefined) ??
		generatedTriggerId;
	const menuId = `${triggerId}-menu`;

	const closeAndReturnFocus = useCallback(() => {
		close();
		wrapperRef.current
			?.querySelector<HTMLElement>('button, [href], [tabindex]')
			?.focus();
	}, [close]);

	// Memoized so React doesn't call it with `null` then the node again on
	// every re-render, which would needlessly reset floating-ui's reference.
	const setWrapperRef = useCallback(
		(node: HTMLSpanElement | null) =>
			mergeRefs<HTMLSpanElement>(refs.setReference, wrapperRef, ref)(node),
		[refs, ref]
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
			setInitialFocus('first');
			open(isPositioned);
		}
		if (isValidElement<TriggerProps>(trigger)) {
			trigger.props.onClick?.(event);
		}
	};

	const handleTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (!isVisible && event.key === 'ArrowDown') {
			event.preventDefault();
			setInitialFocus('first');
			open(isPositioned);
		} else if (!isVisible && event.key === 'ArrowUp') {
			event.preventDefault();
			setInitialFocus('last');
			open(isPositioned);
		}
		if (isValidElement<TriggerProps>(trigger)) {
			trigger.props.onKeyDown?.(event);
		}
	};

	const triggerProps: TriggerProps = {
		id: triggerId,
		onClick: handleTriggerClick,
		onKeyDown: handleTriggerKeyDown,
		'aria-haspopup': 'menu',
		'aria-expanded': isMounted,
		'aria-controls': isMounted ? menuId : undefined,
	};

	const clonedTrigger = isValidElement<TriggerProps>(trigger)
		? cloneElement(trigger, triggerProps)
		: trigger;

	return (
		<span ref={setWrapperRef} className={clsx('inline-block', className)}>
			{clonedTrigger}
			{isMounted && (
				<MenuSurface
					id={menuId}
					labelledBy={triggerId}
					setFloating={refs.setFloating}
					floatingStyles={floatingStyles}
					isVisible={isVisible}
					isPositioned={isPositioned}
					radius={radius}
					onClose={closeAndReturnFocus}
					initialFocus={initialFocus}
				>
					{children}
				</MenuSurface>
			)}
		</span>
	);
}
