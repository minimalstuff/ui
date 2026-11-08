function findNextToastButton(toastElement: HTMLElement): HTMLElement | null {
	for (
		let sibling = toastElement.nextElementSibling;
		sibling;
		sibling = sibling.nextElementSibling
	) {
		if (sibling.hasAttribute('inert')) continue;
		const button = sibling.querySelector<HTMLElement>('button');
		if (button) return button;
	}
	return null;
}

interface MoveFocusOptions {
	toastElement: HTMLElement;
	previousFocus: HTMLElement | null;
}

/**
 * Called when a toast starts closing. Does nothing unless focus is inside it;
 * then focus goes to the next toast's first button, else back to where it was
 * before entering the toaster, else to the toaster region.
 */
export function moveFocusOutOfToast({
	toastElement,
	previousFocus,
}: Readonly<MoveFocusOptions>): void {
	if (!toastElement.contains(document.activeElement)) return;
	const nextButton = findNextToastButton(toastElement);
	if (nextButton) return nextButton.focus();
	if (previousFocus?.isConnected && !toastElement.contains(previousFocus))
		return previousFocus.focus();
	toastElement.closest<HTMLElement>('[data-ms-toaster-region]')?.focus();
}
