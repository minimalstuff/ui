/**
 * Tracks which mounted `ModalShell` is on top so a keyboard event (Escape,
 * Tab) only ever affects the topmost one. Modals stack when a `ConfirmModal`
 * (or another `Modal`) opens from inside an already-open `Modal`.
 */
interface ModalStackEntry {
	token: symbol;
	requestDismiss: () => void;
}

const modalStack: ModalStackEntry[] = [];

/**
 * Pushes `token` onto the stack along with `requestDismiss`, the call that
 * asks this modal to close the way an Escape press would (it may do nothing
 * when the modal is not dismissible). Call this while a modal is open; call
 * the returned function on cleanup (unmount, or the modal starting to close)
 * to pop it back off.
 */
export function registerModal(
	token: symbol,
	requestDismiss: () => void
): () => void {
	modalStack.push({ token, requestDismiss });

	return () => {
		const index = modalStack.findIndex((entry) => entry.token === token);
		if (index !== -1) modalStack.splice(index, 1);
	};
}

/** Whether `token` belongs to the modal currently on top of the stack. */
export function isTopmostModal(token: symbol): boolean {
	return modalStack.at(-1)?.token === token;
}

/**
 * Asks the topmost open dialog (`Modal`, `ConfirmModal`, `Drawer`) to close,
 * exactly as an Escape press would: dismiss guards are honoured, and a
 * dialog with `dismissible={false}` stays open. Only the topmost dialog is
 * affected, and a dialog already closing does not count.
 *
 * Call it first from a hardware back button handler (for example Capacitor's
 * `backButton` listener on Android) and navigate back only when it returns
 * `false`.
 *
 * @returns `true` when a dialog was open and the press was consumed (even if
 * it stayed open because it is not dismissible or a guard refused), `false`
 * when no dialog is open.
 */
export function dismissTopmostModal(): boolean {
	const topmost = modalStack.at(-1);
	if (!topmost) return false;

	topmost.requestDismiss();
	return true;
}
