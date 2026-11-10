import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
	type Placement,
} from '@floating-ui/react-dom';
import clsx from 'clsx';
import {
	cloneElement,
	isValidElement,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
	type KeyboardEvent,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
	type Ref,
	type RefObject,
	type FocusEvent,
} from 'react';

import {
	type PopoverOpenChangeDetails,
	type PopoverOpenChangeReason,
} from '#components/popover/popover_open_change';
import {
	type PopoverAlign,
	type PopoverSide,
} from '#components/popover/popover_placement';
import { PopoverSurface } from '#components/popover/popover_surface';
import { useOutsidePointerDown } from '#components/popover/use_outside_pointer_down';
import { usePopoverState } from '#components/popover/use_popover_state';
import { findDialogPortalTarget } from '#components/shared/dialog_portal_target';
import { FLOATING_VIEWPORT_PADDING } from '#components/shared/floating';
import { limitToAvailableHeight } from '#components/shared/limit_to_available_height';
import { type Radius } from '#components/shared/radius';
import {
	useEnterOnPositioned,
	useOverlayState,
} from '#components/shared/use_overlay_state';
import { useStableCallback } from '#components/shared/use_stable_callback';
import { useWarnUnnamed } from '#components/shared/use_warn_unnamed';
import { mergeRefs } from '#lib/merge_refs';

const OFFSET_FROM_TRIGGER = 4;

export type {
	PopoverAlign,
	PopoverSide,
} from '#components/popover/popover_placement';
export type {
	PopoverOpenChangeDetails,
	PopoverOpenChangeReason,
} from '#components/popover/popover_open_change';

function toPlacement(side: PopoverSide, align: PopoverAlign): Placement {
	return align === 'center' ? side : `${side}-${align}`;
}

interface TriggerProps {
	onClick?: (event: MouseEvent) => void;
	'aria-haspopup'?: 'dialog';
	'aria-expanded'?: boolean;
	'aria-controls'?: string;
}

type PopoverNameProps =
	| { 'aria-label': string; 'aria-labelledby'?: string }
	| { 'aria-labelledby': string; 'aria-label'?: string };

interface PopoverBaseProps {
	/** Cloned with a toggling `onClick`, `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`. */
	trigger: ReactElement;
	/** Free content: the panel stays open while the user interacts with it. */
	children: ReactNode;
	/** Controlled open state. While provided, the owner drives every change through `onOpenChange`. */
	isOpen?: boolean;
	defaultOpen?: boolean;
	/**
	 * Fires once per open or close, whatever the cause. `details.reason` says
	 * why: `'trigger'` (click on the trigger, opening or closing), `'escape'`,
	 * `'outside-pointer'` (pointer down outside), `'focus-out'` (focus left to
	 * an outside element, or Tab out of the panel) or `'disabled'` (the
	 * `disabled` prop closed it). When several closes happen in one event, the
	 * first reason wins.
	 */
	onOpenChange?: (isOpen: boolean, details: PopoverOpenChangeDetails) => void;
	side?: PopoverSide;
	align?: PopoverAlign;
	/** Focused on open instead of the first tabbable element of the panel. */
	initialFocusRef?: RefObject<HTMLElement | null>;
	radius?: Radius;
	className?: string;
	/**
	 * Strips the panel's visual styling (border, background, shadow, blur,
	 * padding, radius, width bounds and the open/close animation). Positioning
	 * and the keyboard and focus handling stay. `radius` is ignored.
	 */
	unstyled?: boolean;
	/**
	 * Styles the floating panel (`role="dialog"`), with or without `unstyled`.
	 * Its position comes from inline floating styles: don't set
	 * `position`, `top` or `left` on it.
	 */
	panelClassName?: string;
	/**
	 * Keeps the popover closed (and closes it if open). The trigger itself is
	 * left alone: mark it `aria-disabled` or `disabled` yourself.
	 */
	disabled?: boolean;
	/** Attaches to the wrapper `<span>` around `trigger`, alongside the popover's own internal ref. */
	ref?: Ref<HTMLSpanElement>;
}

/** The panel is a `role="dialog"`: it needs `aria-label` or `aria-labelledby`. */
export type PopoverProps = PopoverBaseProps & PopoverNameProps;

/**
 * A non-modal panel anchored to `trigger` that holds free content (radio
 * groups, a segmented control, a disclosure...). Unlike `Menu`, clicking
 * inside never closes it: it closes on a second trigger click, Escape, a
 * pointer down outside, or focus leaving the panel and the trigger.
 *
 * Focus moves into the panel on open and returns to the trigger after
 * Escape or a close caused from inside; after an outside pointer down it
 * stays on what the user clicked. Escape calls `event.preventDefault()`, so
 * inside a `Modal` only the popover closes.
 */
export function Popover({
	trigger,
	children,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	isOpen: controlledIsOpen,
	defaultOpen = false,
	onOpenChange,
	side = 'bottom',
	align = 'start',
	initialFocusRef,
	radius = 'md',
	unstyled = false,
	className,
	panelClassName,
	disabled = false,
	ref,
}: Readonly<PopoverProps>) {
	useWarnUnnamed('Popover', Boolean(ariaLabel ?? ariaLabelledBy));

	const wrapperRef = useRef<HTMLSpanElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const [wrapperElement, setWrapperElement] = useState<HTMLSpanElement | null>(
		null
	);
	const { isOpen, setOpen } = usePopoverState({
		isOpen: controlledIsOpen,
		defaultOpen,
		onOpenChange,
	});
	const { isMounted, isVisible, setIsVisible, open, close } = useOverlayState();

	const { refs, floatingStyles, isPositioned } = useFloating({
		placement: toPlacement(side, align),
		strategy: 'fixed',
		open: isMounted,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(OFFSET_FROM_TRIGGER),
			flip(),
			shift({ padding: FLOATING_VIEWPORT_PADDING }),
			limitToAvailableHeight(),
		],
	});

	useEnterOnPositioned(isMounted, isPositioned, setIsVisible);

	const syncOverlay = useStableCallback((shouldBeOpen: boolean) => {
		if (shouldBeOpen) open(isPositioned);
		else close();
	});

	useEffect(() => {
		syncOverlay(isOpen);
	}, [isOpen, syncOverlay]);

	const generatedId = useId();
	const panelId = `${generatedId}-popover`;
	const insideRefs = useMemo(() => [wrapperRef, panelRef], []);

	const setWrapperRef = useCallback(
		(node: HTMLSpanElement | null) =>
			mergeRefs<HTMLSpanElement>(
				refs.setReference,
				wrapperRef,
				setWrapperElement,
				ref
			)(node),
		[refs, ref]
	);

	const focusTrigger = useCallback(() => {
		const triggerElement = wrapperRef.current?.firstElementChild;
		if (triggerElement instanceof HTMLElement) {
			triggerElement.focus({ preventScroll: true });
		}
	}, []);

	const restoreFocusIfLost = useCallback(() => {
		const active = document.activeElement;
		if (!active || active === document.body) return focusTrigger();
		if (panelRef.current?.contains(active)) focusTrigger();
	}, [focusTrigger]);

	const closeAndFocusTrigger = useCallback(
		(reason: PopoverOpenChangeReason) => {
			setOpen(false, { reason });
			focusTrigger();
		},
		[setOpen, focusTrigger]
	);

	const handleTabOut = useCallback(
		() => closeAndFocusTrigger('focus-out'),
		[closeAndFocusTrigger]
	);

	const handleOutsidePointerDown = () => {
		setOpen(false, { reason: 'outside-pointer' });
		window.setTimeout(restoreFocusIfLost, 0);
	};

	useOutsidePointerDown(isOpen, insideRefs, handleOutsidePointerDown);

	useEffect(() => {
		if (disabled && isOpen) setOpen(false, { reason: 'disabled' });
	}, [disabled, isOpen, setOpen]);

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Escape' || !isOpen) return;
		event.preventDefault();
		event.stopPropagation();
		closeAndFocusTrigger('escape');
	};

	const handleBlur = (event: FocusEvent) => {
		const next = event.relatedTarget;
		if (!isOpen || !(next instanceof Node)) return;
		if (wrapperRef.current?.contains(next)) return;
		if (panelRef.current?.contains(next)) return;
		setOpen(false, { reason: 'focus-out' });
	};

	const handleTriggerClick = useStableCallback((event: MouseEvent) => {
		if (!disabled) {
			if (isOpen) closeAndFocusTrigger('trigger');
			else setOpen(true, { reason: 'trigger' });
		}
		if (isValidElement<TriggerProps>(trigger)) {
			trigger.props.onClick?.(event);
		}
	});

	const triggerProps: TriggerProps = {
		onClick: handleTriggerClick,
		'aria-haspopup': 'dialog',
		'aria-expanded': isOpen,
		'aria-controls': isMounted ? panelId : undefined,
	};

	const clonedTrigger = isValidElement<TriggerProps>(trigger)
		? cloneElement(trigger, triggerProps)
		: trigger;

	return (
		<span
			ref={setWrapperRef}
			className={clsx('inline-flex', className)}
			onKeyDown={handleKeyDown}
			onBlur={handleBlur}
		>
			{clonedTrigger}
			{isMounted && (
				<PopoverSurface
					panelRef={panelRef}
					setFloating={refs.setFloating}
					floatingStyles={floatingStyles}
					isVisible={isVisible}
					isPositioned={isPositioned}
					radius={radius}
					unstyled={unstyled}
					panelClassName={panelClassName}
					id={panelId}
					ariaLabel={ariaLabel}
					ariaLabelledBy={ariaLabelledBy}
					initialFocusRef={initialFocusRef}
					onTabOut={handleTabOut}
					portalTarget={findDialogPortalTarget(wrapperElement)}
				>
					{children}
				</PopoverSurface>
			)}
		</span>
	);
}
