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
	useEffect,
	useId,
	useRef,
	useState,
	type MouseEvent,
	type ReactNode,
} from 'react';

import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

const EXIT_ANIMATION_DURATION_MS = 150;
const VIEWPORT_PADDING = 8;
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

interface TooltipProps {
	content: ReactNode;
	children: ReactNode;
	position?: TooltipPosition;
	showOnClick?: boolean;
	temporaryContent?: ReactNode;
	temporaryDuration?: number;
	disabled?: boolean;
	radius?: Radius;
	onTemporaryShow?: () => void;
}

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
}: Readonly<TooltipProps>) {
	const [isMounted, setIsMounted] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [showTemporary, setShowTemporary] = useState(false);
	const tooltipId = useId();
	const arrowRef = useRef<HTMLDivElement>(null);
	const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const temporaryTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	const { refs, floatingStyles, placement, middlewareData, isPositioned } =
		useFloating({
			placement: position,
			open: isMounted,
			whileElementsMounted: autoUpdate,
			middleware: [
				offset(OFFSET_FROM_TRIGGER),
				flip(),
				shift({ padding: VIEWPORT_PADDING }),
				arrow({ element: arrowRef }),
			],
		});

	const resolvedSide = placement.split('-')[0] as TooltipPosition;

	// Only start the enter transition once floating-ui has computed a real
	// position: animating opacity/translate before that would either use a
	// stale (0, 0) position or skip the transition's "closed" frame entirely.
	useEffect(() => {
		if (!isMounted || !isPositioned) return;
		const frameId = requestAnimationFrame(() => setIsVisible(true));
		return () => cancelAnimationFrame(frameId);
	}, [isMounted, isPositioned]);

	const openTooltip = () => {
		clearTimeout(hideTimeoutRef.current);
		setIsMounted(true);
		// A fast leave-then-re-enter can cancel the unmount before it fires,
		// leaving `isMounted`/`isPositioned` already true. The effect above
		// only reacts to those *changing*, so it won't fire again on its own.
		if (isPositioned) setIsVisible(true);
	};

	const closeTooltip = () => {
		clearTimeout(hideTimeoutRef.current);
		setIsVisible(false);
		setShowTemporary(false);
		hideTimeoutRef.current = setTimeout(
			() => setIsMounted(false),
			EXIT_ANIMATION_DURATION_MS
		);
	};

	const showTemporaryContent = () => {
		if (disabled || !temporaryContent) return;
		setShowTemporary(true);
		openTooltip();
		clearTimeout(temporaryTimeoutRef.current);
		temporaryTimeoutRef.current = setTimeout(closeTooltip, temporaryDuration);
		onTemporaryShow?.();
	};

	const handleShow = () => {
		if (disabled) return;
		openTooltip();
	};

	const handleHide = () => {
		clearTimeout(temporaryTimeoutRef.current);
		closeTooltip();
	};

	useEffect(
		() => () => {
			clearTimeout(hideTimeoutRef.current);
			clearTimeout(temporaryTimeoutRef.current);
		},
		[]
	);

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

	const triggerProps: TriggerProps = {
		onClick: handleTriggerClick,
		'aria-describedby': isTooltipShown ? tooltipId : undefined,
	};

	const trigger = isValidElement<TriggerProps>(children)
		? cloneElement(children, triggerProps)
		: children;

	const arrowX = middlewareData.arrow?.x;
	const arrowY = middlewareData.arrow?.y;
	const arrowStaticSide = ARROW_STATIC_SIDE[resolvedSide];

	return (
		<>
			<span
				ref={refs.setReference}
				className="inline-block"
				onMouseEnter={handleShow}
				onMouseLeave={handleHide}
				onFocus={handleShow}
				onBlur={handleHide}
			>
				{trigger}
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
									left: arrowX !== undefined ? `${arrowX}px` : undefined,
									top: arrowY !== undefined ? `${arrowY}px` : undefined,
									[arrowStaticSide]: `-${ARROW_SIZE_PX / 2}px`,
								}}
								className="h-2 w-2 rotate-45 bg-gray-900 dark:bg-gray-100"
							/>
						</div>
					</div>,
					document.body
				)}
		</>
	);
}
