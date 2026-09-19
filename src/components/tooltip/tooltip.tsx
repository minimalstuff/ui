import clsx from 'clsx';
import { createPortal } from 'react-dom';
import {
	arrow,
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
} from '@floating-ui/react-dom';
import {
	cloneElement,
	isValidElement,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
	type MouseEvent,
	type ReactNode,
	type Ref,
} from 'react';

import { mergeRefs } from '#lib/merge_refs';
import { FLOATING_VIEWPORT_PADDING } from '#components/shared/floating';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	useEnterOnPositioned,
	useOverlayState,
} from '#components/shared/use_overlay_state';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

const OFFSET_FROM_TRIGGER = 8;
const ARROW_SIZE_PX = 8;

const ENTER_TRANSLATE_CLASSES: Record<TooltipPosition, string> = {
	top: 'data-[state=closed]:translate-y-1',
	bottom: 'data-[state=closed]:-translate-y-1',
	left: 'data-[state=closed]:translate-x-1',
	right: 'data-[state=closed]:-translate-x-1',
};

const ARROW_STATIC_SIDE: Record<
	TooltipPosition,
	'top' | 'bottom' | 'left' | 'right'
> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
};

interface TriggerProps {
	onClick?: (event: MouseEvent) => void;
	'aria-describedby'?: string;
}

function describedByWithTooltip(
	childDescribedBy: string | undefined,
	tooltipId: string | undefined
): string | undefined {
	return [childDescribedBy, tooltipId].filter(Boolean).join(' ') || undefined;
}

export interface TooltipProps {
	content: ReactNode;
	children: ReactNode;
	position?: TooltipPosition;
	showOnClick?: boolean;
	temporaryContent?: ReactNode;
	temporaryDuration?: number;
	disabled?: boolean;
	radius?: Radius;
	onTemporaryShow?: () => void;
	className?: string;
	/** Attaches to the wrapper `<span>` around `children`, alongside `Tooltip`'s own internal ref. */
	ref?: Ref<HTMLSpanElement>;
}

/**
 * The trigger (`children`) must be focusable, otherwise the tooltip is
 * unreachable by keyboard. Shows on hover and focus; Escape dismisses it.
 * `temporaryContent` is announced to screen readers through a polite status
 * region.
 */
export function Tooltip({
	content,
	children,
	position = 'top',
	showOnClick = false,
	temporaryContent,
	temporaryDuration = 2000,
	disabled = false,
	radius = 'lg',
	onTemporaryShow,
	className,
	ref,
}: Readonly<TooltipProps>) {
	const { isMounted, isVisible, setIsVisible, open, close } = useOverlayState();
	const [showTemporary, setShowTemporary] = useState(false);
	const tooltipId = useId();
	const arrowRef = useRef<HTMLDivElement>(null);
	const temporaryTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	const { refs, floatingStyles, placement, middlewareData, isPositioned } =
		useFloating({
			placement: position,
			open: isMounted,
			whileElementsMounted: autoUpdate,
			middleware: [
				offset(OFFSET_FROM_TRIGGER),
				flip(),
				shift({ padding: FLOATING_VIEWPORT_PADDING }),
				// oxlint-disable-next-line react/refs -- floating-ui's arrow middleware takes the ref object by design and reads .current at positioning time, not during render
				arrow({ element: arrowRef }),
			],
		});

	const resolvedSide = placement.split('-')[0] as TooltipPosition;

	useEnterOnPositioned(isMounted, isPositioned, setIsVisible);

	// Memoized so React doesn't call it with `null` then the node again on
	// every re-render, which would needlessly reset floating-ui's reference.
	const setTriggerRef = useCallback(
		(node: HTMLSpanElement | null) =>
			mergeRefs<HTMLSpanElement>(refs.setReference, ref)(node),
		[refs, ref]
	);

	const closeTooltip = useCallback(() => {
		setShowTemporary(false);
		close();
	}, [close]);

	const showTemporaryContent = () => {
		if (disabled || !temporaryContent) return;
		setShowTemporary(true);
		open(isPositioned);
		clearTimeout(temporaryTimeoutRef.current);
		temporaryTimeoutRef.current = setTimeout(closeTooltip, temporaryDuration);
		onTemporaryShow?.();
	};

	const handleShow = () => {
		if (disabled) return;
		open(isPositioned);
	};

	const handleHide = useCallback(() => {
		clearTimeout(temporaryTimeoutRef.current);
		closeTooltip();
	}, [closeTooltip]);

	useEffect(() => () => clearTimeout(temporaryTimeoutRef.current), []);

	useEffect(() => {
		if (!isMounted) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') handleHide();
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isMounted, handleHide]);

	const isTooltipShown = isMounted && !disabled;
	const displayContent =
		showTemporary && temporaryContent ? temporaryContent : content;

	const handleTriggerClick = (event: MouseEvent) => {
		if (showOnClick && temporaryContent) {
			showTemporaryContent();
		}
		if (isValidElement<TriggerProps>(children)) {
			children.props.onClick?.(event);
		}
	};

	const childDescribedBy = isValidElement<TriggerProps>(children)
		? children.props['aria-describedby']
		: undefined;

	const triggerProps: TriggerProps = {
		onClick: handleTriggerClick,
		'aria-describedby': describedByWithTooltip(
			childDescribedBy,
			isTooltipShown ? tooltipId : undefined
		),
	};

	const trigger = isValidElement<TriggerProps>(children)
		? // oxlint-disable-next-line react/refs -- triggerProps.onClick reaches temporaryTimeoutRef.current only when the handler fires, never during render
			cloneElement(children, triggerProps)
		: children;

	const arrowX = middlewareData.arrow?.x;
	const arrowY = middlewareData.arrow?.y;
	const arrowStaticSide = ARROW_STATIC_SIDE[resolvedSide];

	return (
		<>
			<span
				ref={setTriggerRef}
				className={clsx('inline-block', className)}
				onMouseEnter={handleShow}
				onMouseLeave={handleHide}
				onFocus={handleShow}
				onBlur={handleHide}
			>
				{trigger}
				{temporaryContent !== undefined && (
					<span role="status" className="sr-only">
						{showTemporary ? temporaryContent : null}
					</span>
				)}
			</span>
			{isTooltipShown &&
				createPortal(
					// Positioning shell: floating-ui owns this node's `transform` (via
					// `floatingStyles`) to place it next to the trigger, so it must
					// never be CSS-transitioned or it visibly slides in from (0, 0)
					// before the first position is computed. The enter/exit animation
					// lives on the inner node instead, which has its own independent
					// transform.
					<div
						ref={refs.setFloating}
						style={floatingStyles}
						className="z-50 inline-block pointer-events-none"
					>
						<div
							id={tooltipId}
							role="tooltip"
							data-state={isVisible ? 'open' : 'closed'}
							className={clsx(
								'px-3 py-1.5 text-sm whitespace-nowrap',
								'text-white dark:text-gray-900 bg-gray-900 dark:bg-gray-100 shadow-lg',
								'transition-[opacity,transform] duration-150 ease-out',
								isVisible ? 'opacity-100' : 'opacity-0',
								ENTER_TRANSLATE_CLASSES[resolvedSide],
								RADIUS_CLASSES[radius]
							)}
						>
							{displayContent}
							<div
								ref={arrowRef}
								style={{
									position: 'absolute',
									width: `${ARROW_SIZE_PX}px`,
									height: `${ARROW_SIZE_PX}px`,
									left: arrowX !== undefined ? `${arrowX}px` : undefined,
									top: arrowY !== undefined ? `${arrowY}px` : undefined,
									[arrowStaticSide]: `-${ARROW_SIZE_PX / 2}px`,
								}}
								className="rotate-45 bg-gray-900 dark:bg-gray-100"
							/>
						</div>
					</div>,
					document.body
				)}
		</>
	);
}
