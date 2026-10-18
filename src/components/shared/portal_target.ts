const LANDMARK_OR_DIALOG_SELECTOR = [
	'main',
	'nav',
	'aside',
	'header',
	'footer',
	'form[aria-label]',
	'form[aria-labelledby]',
	'section[aria-label]',
	'section[aria-labelledby]',
	'[role=main]',
	'[role=navigation]',
	'[role=complementary]',
	'[role=banner]',
	'[role=contentinfo]',
	'[role=region]',
	'[role=search]',
	'[role=form]',
	'dialog',
	'[role=dialog]',
	'[role=alertdialog]',
].join(', ');

/**
 * Closest landmark or dialog ancestor of `element`, or `document.body` when
 * there is none. Portalling there keeps floating content inside a landmark
 * (axe `region`) and inside an open modal dialog.
 */
export function findLandmarkPortalTarget(element: Element | null): HTMLElement {
	const landmark = element?.closest<HTMLElement>(LANDMARK_OR_DIALOG_SELECTOR);
	return landmark ?? (element?.ownerDocument ?? document).body;
}
