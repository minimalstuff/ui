import { type AlertTone } from '#components/alert/alert_tone';

export type AnnouncerPoliteness = 'polite' | 'assertive';

const ASSERTIVE_TONES: readonly AlertTone[] = ['warning', 'danger'];

export function getPoliteness(tone: string): AnnouncerPoliteness {
	return ASSERTIVE_TONES.some((assertiveTone) => assertiveTone === tone)
		? 'assertive'
		: 'polite';
}

function findSlots(politeness: AnnouncerPoliteness): HTMLElement[] {
	return Array.from(
		document.querySelectorAll<HTMLElement>(
			`[data-ms-toast-announcer="${politeness}"]`
		)
	);
}

function isInOpenDialog(slot: HTMLElement): boolean {
	const dialog = slot.closest('[aria-modal="true"]');
	return dialog?.getAttribute('data-state') === 'open';
}

/** Text of a rendered toast: message and description, never button labels. */
export function readToastText(toastElement: Element): string {
	const textElement = toastElement.querySelector('[data-ms-toast-text]');
	if (!textElement) return '';
	return Array.from(textElement.children)
		.map((child) => child.textContent ?? '')
		.join(' ')
		.trim();
}

/** Empties the Toaster's own announcer and every dialog slot of this politeness. */
export function clearAnnouncers(
	politeness: AnnouncerPoliteness,
	ownAnnouncers: Readonly<Record<AnnouncerPoliteness, HTMLElement | null>>
): void {
	const own = ownAnnouncers[politeness];
	if (own) own.textContent = '';
	for (const slot of findSlots(politeness)) slot.textContent = '';
}

/** Writes into the topmost open dialog's slot, else into the Toaster's own announcer. */
export function writeAnnouncement(
	politeness: AnnouncerPoliteness,
	text: string,
	ownAnnouncers: Readonly<Record<AnnouncerPoliteness, HTMLElement | null>>
): void {
	const dialogSlot = findSlots(politeness).filter(isInOpenDialog).at(-1);
	const target = dialogSlot ?? ownAnnouncers[politeness];
	if (target) target.textContent = text;
}
