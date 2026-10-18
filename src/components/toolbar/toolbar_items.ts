const ITEM_SELECTOR = [
	'a[href]',
	'button',
	'input:not([type="hidden"])',
	'select',
	'textarea',
	'summary',
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]',
].join(', ');

const NON_TEXT_INPUT_TYPES = [
	'button',
	'checkbox',
	'color',
	'file',
	'image',
	'radio',
	'range',
	'reset',
	'submit',
];

const TEXT_ENTRY_SELECTOR = [
	'textarea',
	'[contenteditable]:not([contenteditable="false"])',
	`input:not(${NON_TEXT_INPUT_TYPES.map((type) => `[type="${type}"]`).join(', ')})`,
].join(', ');

function isDisabledItem(element: HTMLElement): boolean {
	return element.matches(':disabled, [aria-disabled="true"]');
}

export function getAllItems(toolbar: HTMLElement): HTMLElement[] {
	return Array.from(toolbar.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
}

export function getEnabledItems(toolbar: HTMLElement): HTMLElement[] {
	return getAllItems(toolbar).filter((element) => !isDisabledItem(element));
}

export function isTextEntry(element: EventTarget | null): boolean {
	return element instanceof HTMLElement && element.matches(TEXT_ENTRY_SELECTOR);
}
