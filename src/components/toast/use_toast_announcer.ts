import { useEffect, useRef, type RefObject } from 'react';

import {
	clearAnnouncers,
	getPoliteness,
	readToastText,
	writeAnnouncement,
	type AnnouncerPoliteness,
} from '#components/toast/toast_announcement';
import { type ToastStoreEntry } from '#stores/toast_store/toast_store_entries';

export const TOAST_ANNOUNCE_DELAY_MS = 50;

interface UseToastAnnouncerOptions {
	entries: readonly ToastStoreEntry[];
	listRef: RefObject<HTMLElement | null>;
	politeRef: RefObject<HTMLElement | null>;
	assertiveRef: RefObject<HTMLElement | null>;
}

function findToastElement(
	list: HTMLElement | null,
	id: string
): HTMLElement | undefined {
	if (!list) return undefined;
	return Array.from(
		list.querySelectorAll<HTMLElement>('[data-ms-toast-id]')
	).find((element) => element.dataset.msToastId === id);
}

function collectTexts(
	list: HTMLElement | null,
	ids: readonly string[]
): Record<AnnouncerPoliteness, string[]> {
	const texts: Record<AnnouncerPoliteness, string[]> = {
		polite: [],
		assertive: [],
	};
	for (const id of ids) {
		const element = findToastElement(list, id);
		if (!element) continue;
		const text = readToastText(element);
		if (text) texts[getPoliteness(element.dataset.tone ?? '')].push(text);
	}
	return texts;
}

/**
 * Announces each toast when it mounts and each time it is shown again (new
 * `revision`). The announcers are emptied right away and filled after
 * `TOAST_ANNOUNCE_DELAY_MS`, so a repeated message is read again and several
 * toasts of the same window are joined.
 */
export function useToastAnnouncer({
	entries,
	listRef,
	politeRef,
	assertiveRef,
}: Readonly<UseToastAnnouncerOptions>): void {
	const announcedRevisionsRef = useRef(new Map<string, number>());
	const pendingIdsRef = useRef<string[]>([]);
	const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const announcedRevisions = announcedRevisionsRef.current;
		const pendingIds = pendingIdsRef.current;
		const ownAnnouncers = {
			polite: politeRef.current,
			assertive: assertiveRef.current,
		};
		const changedEntries = entries.filter(
			(entry) =>
				!entry.isClosing && announcedRevisions.get(entry.id) !== entry.revision
		);
		announcedRevisions.clear();
		for (const entry of entries)
			announcedRevisions.set(entry.id, entry.revision);
		if (changedEntries.length === 0) return;

		for (const entry of changedEntries) {
			clearAnnouncers(getPoliteness(entry.tone), ownAnnouncers);
			pendingIds.push(entry.id);
		}
		if (timeoutIdRef.current !== null) return;
		timeoutIdRef.current = setTimeout(() => {
			timeoutIdRef.current = null;
			const texts = collectTexts(listRef.current, pendingIds.splice(0));
			if (texts.polite.length > 0)
				writeAnnouncement('polite', texts.polite.join(' '), ownAnnouncers);
			if (texts.assertive.length > 0)
				writeAnnouncement(
					'assertive',
					texts.assertive.join(' '),
					ownAnnouncers
				);
		}, TOAST_ANNOUNCE_DELAY_MS);
	}, [entries, listRef, politeRef, assertiveRef]);

	useEffect(() => {
		const announcedRevisions = announcedRevisionsRef.current;
		const pendingIds = pendingIdsRef.current;
		return () => {
			if (timeoutIdRef.current !== null) clearTimeout(timeoutIdRef.current);
			timeoutIdRef.current = null;
			pendingIds.length = 0;
			announcedRevisions.clear();
		};
	}, []);
}
