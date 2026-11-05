import {
	type MouseEvent,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type RefObject,
} from 'react';

import { useBodyScrollLock } from '#components/modal/body_scroll_lock';
import { KEYBOARD_SCROLL_REGION_ATTRIBUTE } from '#components/modal/keyboard_scroll_region_attribute';
import {
	dismissTopmostModal,
	isTopmostModal,
	registerModal,
} from '#components/modal/modal_stack';
import { getTabbableElements } from '#components/shared/tabbable';

/** Where initial focus looks for a tabbable element once the content has none: anywhere in the `dialog` (header and footer included), or nowhere (`content`), which leaves focus on the dialog itself. */
type InitialFocusFallbackScope = 'dialog' | 'content';

export interface UseModalDialogOptions {
	isEnded: boolean;
	onDismiss: () => void;
	dismissible: boolean;
	/** Wins over the first-tabbable rule for where focus lands on open, once it holds an element. */
	initialFocusRef?: RefObject<HTMLElement | null>;
	/** Defaults to `dialog`. */
	initialFocusFallbackScope?: InitialFocusFallbackScope;
	/** Where focus goes on close when the previously focused element is no longer in the document. Must be referentially stable. */
	getFocusFallback?: () => HTMLElement | null;
}

export interface ModalDialog {
	dialogRef: RefObject<HTMLDivElement | null>;
	contentRef: RefObject<HTMLDivElement | null>;
	footerSlot: HTMLDivElement | null;
	setFooterSlot: (element: HTMLDivElement | null) => void;
	isVisible: boolean;
	handleBackdropClick: () => void;
	/** Keeps a press on the backdrop from moving focus to `<body>`, so a dialog stacked by a dismiss guard captures focus inside this one. */
	handleBackdropMouseDown: (event: MouseEvent<HTMLElement>) => void;
}

interface FocusEntryPointParams {
	dialog: HTMLElement | null;
	content: HTMLElement | null;
	initialFocusRef: RefObject<HTMLElement | null> | undefined;
	fallbackScope: InitialFocusFallbackScope;
}

function getInitialFocusCandidates(container: HTMLElement): HTMLElement[] {
	return getTabbableElements(container).filter(
		(element) => !element.hasAttribute(KEYBOARD_SCROLL_REGION_ATTRIBUTE)
	);
}

function findFirstTabbable({
	dialog,
	content,
	fallbackScope,
}: Readonly<FocusEntryPointParams>): HTMLElement | undefined {
	const firstInContent = content
		? getInitialFocusCandidates(content)[0]
		: undefined;
	if (firstInContent || fallbackScope === 'content') return firstInContent;
	return dialog ? getInitialFocusCandidates(dialog)[0] : undefined;
}

function focusEntryPoint(params: Readonly<FocusEntryPointParams>): void {
	const firstFocusable = findFirstTabbable(params);
	(params.initialFocusRef?.current ?? firstFocusable ?? params.dialog)?.focus();
}

/** Keeps Tab inside `dialog`: wraps at both ends and pulls stray focus back in. */
function trapTabKey(event: KeyboardEvent, dialog: HTMLElement): void {
	const tabbable = getTabbableElements(dialog);
	if (tabbable.length === 0) {
		event.preventDefault();
		dialog.focus();
		return;
	}

	const first = tabbable[0];
	const last = tabbable[tabbable.length - 1];
	const activeElement = document.activeElement;
	const activeIndex =
		activeElement instanceof HTMLElement ? tabbable.indexOf(activeElement) : -1;

	if (activeIndex === -1) {
		event.preventDefault();
		(event.shiftKey ? last : first).focus();
		return;
	}

	if (event.shiftKey && activeElement === first) {
		event.preventDefault();
		last.focus();
	} else if (!event.shiftKey && activeElement === last) {
		event.preventDefault();
		first.focus();
	}
}

/** Read during the first render, before any child `autoFocus` is applied at commit. */
function captureActiveElement(): HTMLElement | null {
	if (typeof document === 'undefined') return null;
	return document.activeElement instanceof HTMLElement
		? document.activeElement
		: null;
}

function useOpeningFlag(): boolean {
	const [isOpening, setIsOpening] = useState(false);

	useEffect(() => {
		const frameId = requestAnimationFrame(() => {
			requestAnimationFrame(() => setIsOpening(true));
		});
		return () => cancelAnimationFrame(frameId);
	}, []);

	return isOpening;
}

function useDialogKeyboard(
	dialogRef: RefObject<HTMLDivElement | null>,
	{
		isEnded,
		modalToken,
	}: Pick<UseModalDialogOptions, 'isEnded'> & {
		modalToken: symbol;
	}
): void {
	useEffect(() => {
		if (isEnded) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isTopmostModal(modalToken)) return;

			if (event.key === 'Escape') {
				if (event.defaultPrevented) return;
				event.preventDefault();
				dismissTopmostModal();
				return;
			}
			if (event.key !== 'Tab' || !dialogRef.current) return;

			trapTabKey(event, dialogRef.current);
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isEnded, modalToken, dialogRef]);
}

/**
 * The behaviour every modal dialog shares: stack registration, body scroll
 * lock, focus capture / initial focus / restore, Escape and the Tab trap.
 * The element to restore focus to is captured once, during the first render,
 * before any child `autoFocus` runs. `isEnded` going from `true` back to
 * `false` (a reopen mid-exit) re-runs the open-phase effects, so initial focus
 * is placed again.
 */
export function useModalDialog({
	isEnded,
	onDismiss,
	dismissible,
	initialFocusRef,
	initialFocusFallbackScope = 'dialog',
	getFocusFallback,
}: Readonly<UseModalDialogOptions>): ModalDialog {
	const [modalToken] = useState(() => Symbol('modal'));
	const [footerSlot, setFooterSlot] = useState<HTMLDivElement | null>(null);
	const dialogRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [previouslyFocused] = useState(captureActiveElement);

	const requestDismissRef = useRef(() => {});
	useLayoutEffect(() => {
		requestDismissRef.current = () => {
			if (dismissible) onDismiss();
		};
	});

	useEffect(() => {
		if (isEnded) return;
		return registerModal(modalToken, () => requestDismissRef.current());
	}, [isEnded, modalToken]);

	useBodyScrollLock();
	const isOpening = useOpeningFlag();

	useEffect(() => {
		if (!footerSlot || isEnded) return;
		focusEntryPoint({
			dialog: dialogRef.current,
			content: contentRef.current,
			initialFocusRef,
			fallbackScope: initialFocusFallbackScope,
		});
		// oxlint-disable-next-line react-hooks/exhaustive-deps -- initial focus is only computed when the footer slot mounts (so portaled footer content exists) or the dialog reopens; a later change to initialFocusRef shouldn't re-run it
	}, [footerSlot, isEnded]);

	useEffect(() => {
		if (!isEnded) return;
		const target = previouslyFocused?.isConnected
			? previouslyFocused
			: getFocusFallback?.();
		target?.focus({ preventScroll: true });
	}, [isEnded, previouslyFocused, getFocusFallback]);

	useDialogKeyboard(dialogRef, { isEnded, modalToken });

	const handleBackdropClick = () => {
		if (!isEnded && dismissible) onDismiss();
	};

	const handleBackdropMouseDown = (event: MouseEvent<HTMLElement>) => {
		const target = event.target as Node;
		const isOnBackdrop =
			event.currentTarget.contains(target) &&
			!dialogRef.current?.contains(target);
		if (isOnBackdrop) event.preventDefault();
	};

	return {
		dialogRef,
		contentRef,
		footerSlot,
		setFooterSlot,
		isVisible: isOpening && !isEnded,
		handleBackdropClick,
		handleBackdropMouseDown,
	};
}
