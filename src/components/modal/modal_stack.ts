/**
 * Tracks which mounted `ModalShell` is on top so a keyboard event (Escape,
 * Tab) only ever affects the topmost one. Modals stack when a `ConfirmModal`
 * (or another `Modal`) opens from inside an already-open `Modal`.
 */
const modalStack: symbol[] = [];

/**
 * Pushes `token` onto the stack. Call this while a modal is open; call the
 * returned function on cleanup (unmount, or the modal starting to close) to
 * pop it back off.
 */
export function registerModal(token: symbol): () => void {
	modalStack.push(token);

	return () => {
		const index = modalStack.indexOf(token);
		if (index !== -1) modalStack.splice(index, 1);
	};
}

/** Whether `token` belongs to the modal currently on top of the stack. */
export function isTopmostModal(token: symbol): boolean {
	return modalStack[modalStack.length - 1] === token;
}
