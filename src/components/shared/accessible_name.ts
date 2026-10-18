/** Trims the text and collapses every whitespace run into a single space. */
export function normalizeText(text: string | null | undefined): string {
	return (text ?? '').replace(/\s+/g, ' ').trim();
}

function getLabelledByName(element: Element, labelledBy: string): string {
	return labelledBy
		.split(/\s+/)
		.map((id) => element.ownerDocument.getElementById(id)?.textContent)
		.join(' ');
}

/**
 * Pragmatic accessible name: `aria-label`, else the text of the
 * `aria-labelledby` targets, else the element's own text. Not a full
 * accname implementation (ignores `<label>`, `title`, `alt`).
 */
export function getAccessibleName(element: Element): string {
	const ariaLabel = normalizeText(element.getAttribute('aria-label'));
	if (ariaLabel) return ariaLabel;

	const labelledBy = element.getAttribute('aria-labelledby');
	const labelledByName = labelledBy
		? normalizeText(getLabelledByName(element, labelledBy))
		: '';
	if (labelledByName) return labelledByName;

	return normalizeText(element.textContent);
}
