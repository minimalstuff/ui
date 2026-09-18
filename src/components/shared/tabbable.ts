const TABBABLE_SELECTOR = [
	'a[href]',
	'button',
	'input',
	'select',
	'textarea',
	'summary',
	'audio[controls]',
	'video[controls]',
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]',
].join(', ');

function isDisabled(element: HTMLElement): boolean {
	return element.matches(':disabled');
}

function hasNegativeTabIndex(element: HTMLElement): boolean {
	return element.getAttribute('tabindex') === '-1';
}

function isHiddenInput(element: HTMLElement): boolean {
	return element.matches('input[type="hidden"]');
}

function isInsideInert(element: HTMLElement): boolean {
	return element.closest('[inert]') !== null;
}

/** `checkVisibility` isn't implemented in happy-dom, so an element is treated as visible when the method is missing. */
function isVisible(element: HTMLElement): boolean {
	if (typeof element.checkVisibility !== 'function') return true;
	return element.checkVisibility();
}

function isTabbableCandidate(element: HTMLElement): boolean {
	return (
		!isDisabled(element) &&
		!hasNegativeTabIndex(element) &&
		!isHiddenInput(element) &&
		!isInsideInert(element) &&
		isVisible(element)
	);
}

/** A radio input only takes part in roving-tabindex grouping once it has a `name` — an unnamed radio isn't grouped with any other. */
function isGroupedRadio(element: HTMLElement): element is HTMLInputElement {
	return (
		element instanceof HTMLInputElement &&
		element.type === 'radio' &&
		element.name !== ''
	);
}

function groupRadiosByOwner(
	radios: readonly HTMLInputElement[]
): HTMLInputElement[][] {
	const groupsByForm = new Map<
		HTMLFormElement | null,
		Map<string, HTMLInputElement[]>
	>();

	for (const radio of radios) {
		const groupsByName =
			groupsByForm.get(radio.form) ?? new Map<string, HTMLInputElement[]>();
		groupsByForm.set(radio.form, groupsByName);

		const group = groupsByName.get(radio.name) ?? [];
		group.push(radio);
		groupsByName.set(radio.name, group);
	}

	return Array.from(groupsByForm.values()).flatMap((groupsByName) =>
		Array.from(groupsByName.values())
	);
}

function pickTabbableRadio(
	group: readonly HTMLInputElement[]
): HTMLInputElement {
	return group.find((radio) => radio.checked) ?? group[0];
}

/**
 * Returns the elements inside `container` that are reachable with Tab, in
 * document order. A radio group (same `name`, same form owner) contributes
 * only its checked radio, or its first radio when none is checked — matching
 * the browser's native roving tabindex for radio groups.
 */
export function getTabbableElements(container: HTMLElement): HTMLElement[] {
	const candidates = Array.from(
		container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)
	).filter(isTabbableCandidate);

	const groupedRadios = candidates.filter(isGroupedRadio);
	const tabbableRadios = new Set(
		groupRadiosByOwner(groupedRadios).map(pickTabbableRadio)
	);

	return candidates.filter(
		(element) => !isGroupedRadio(element) || tabbableRadios.has(element)
	);
}
