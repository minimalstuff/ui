import { type ReactNode, type RefObject } from 'react';
import { createCallable } from 'react-call';

import { DismissGuardContext } from '#components/modal/dismiss_guard_context';
import {
	ModalShell,
	type ModalRole,
	type ModalSize,
	type ModalPhoneLayout,
	type ModalHeight,
} from '#components/modal/modal_shell';
import { useGuardedDismiss } from '#components/modal/use_guarded_dismiss';
import { MODAL_EXIT_DURATION_MS } from '#components/shared/animation';
import { type Radius } from '#components/shared/radius';
import { useDisableHotkeysWhileMounted } from '#hooks/use_disable_hotkeys_while_mounted/use_disable_hotkeys_while_mounted';

export type {
	ModalRole,
	ModalSize,
	ModalHeight,
	ModalPhoneLayout,
} from '#components/modal/modal_shell';

type ModalRenderProp = ReactNode | ((close: () => void) => ReactNode);

type ModalAccessibleName =
	| { title: NonNullable<ReactNode>; 'aria-label'?: undefined }
	| {
			title?: undefined;
			/** Names the dialog when there is no `title`; ignored when `title` is set since the title labels it. */
			'aria-label': string;
	  };

export type ModalProps = {
	children: ModalRenderProp;
	size?: ModalSize;
	/** `fixed` gives the dialog a stable height so it does not jump when content changes; the content area stops scrolling and a child with `flex-1 min-h-0 overflow-y-auto` scrolls on its own. */
	height?: ModalHeight;
	/** `sheet` turns the dialog into a bottom sheet below the `sm` breakpoint (full width, flush with the bottom edge, only the top corners rounded, at most 85svh tall, bottom padding clearing the safe area, sliding up on open and down on close; plain fade under reduced motion). From `sm` up it renders as `center`. With `height="fixed"` the sheet is 85svh tall on phones. `unstyled` keeps the sheet position and size but drops radius and the slide. */
	phoneLayout?: ModalPhoneLayout;
	radius?: Radius;
	className?: string;
	/** Applied to the `role=dialog` element. A `transform`, `filter` or `backdrop-filter` on the open panel makes it the containing block of `position: fixed` descendants, so Menus opened inside it get clipped. Keep these off the open state. Carries `data-state="open"` or `"closed"`, so `data-[state=closed]:` variants can animate it. Put your own transitions behind `motion-reduce:` variants, since `unstyled` drops the library's reduced-motion handling along with its animations. */
	panelClassName?: string;
	/** Applied to the backdrop element, which carries the click-to-dismiss. */
	backdropClassName?: string;
	/** Strips the library's visual styling (background, shadow, radius, transitions, backdrop tint, header and content typography and padding), keeping layout, sizing, scrolling and behaviour. `radius` is ignored. The close button keeps a 24px minimum target size. */
	unstyled?: boolean;
	dismissible?: boolean;
	closeLabel?: string;
	/** `alertdialog` for urgent messages that need a response (describes the dialog by its content); pair with `dismissible={false}` when it must not be dismissed. */
	role?: ModalRole;
	/** Wins over the first-tabbable rule for where focus lands on open; may point at an element in the content or in a `ModalFooter`. */
	initialFocusRef?: RefObject<HTMLElement | null>;
} & ModalAccessibleName;

function resolveRenderProp(
	prop: ModalRenderProp,
	close: () => void
): ReactNode {
	return typeof prop === 'function' ? prop(close) : prop;
}

export const Modal = createCallable<ModalProps, void>(
	({
		call,
		title,
		children,
		size,
		height,
		phoneLayout,
		radius,
		className,
		panelClassName,
		backdropClassName,
		unstyled,
		dismissible,
		closeLabel,
		role,
		initialFocusRef,
		'aria-label': ariaLabel,
	}) => {
		useDisableHotkeysWhileMounted();

		const { dismiss, registry } = useGuardedDismiss({
			onDismiss: () => call.end(),
			isEnded: call.ended,
		});

		return (
			<DismissGuardContext.Provider value={registry}>
				<ModalShell
					isEnded={call.ended}
					onDismiss={dismiss}
					title={title}
					size={size}
					height={height}
					phoneLayout={phoneLayout}
					radius={radius}
					className={className}
					panelClassName={panelClassName}
					backdropClassName={backdropClassName}
					unstyled={unstyled}
					dismissible={dismissible}
					closeLabel={closeLabel}
					role={role}
					initialFocusRef={initialFocusRef}
					aria-label={ariaLabel}
				>
					{resolveRenderProp(children, dismiss)}
				</ModalShell>
			</DismissGuardContext.Provider>
		);
	},
	MODAL_EXIT_DURATION_MS
);
