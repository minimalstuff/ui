const DIALOG_SELECTOR = 'dialog, [role=dialog], [role=alertdialog]';

/**
 * Closest dialog ancestor of `element`, or `document.body` when there is
 * none. Portalling floating content there keeps it reachable by screen
 * readers that honour `aria-modal`, without inheriting a landmark's styling.
 */
export function findDialogPortalTarget(element: Element | null): HTMLElement {
	const dialog = element?.closest<HTMLElement>(DIALOG_SELECTOR);
	return dialog ?? (element?.ownerDocument ?? document).body;
}
