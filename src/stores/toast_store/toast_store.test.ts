import { describe, expect, it } from 'vitest';

import {
	TOAST_LIMIT,
	type ToastStoreInput,
	useToastStore,
} from '#stores/toast_store/toast_store';

function buildInput(overrides: Partial<ToastStoreInput> = {}): ToastStoreInput {
	return {
		id: 'toast-1',
		message: 'Hello',
		tone: 'info',
		duration: 5000,
		...overrides,
	};
}

function getEntries() {
	return useToastStore.getState().entries;
}

function getEntry(id: string) {
	return getEntries().find((entry) => entry.id === id);
}

function fillToasts(count: number, overrides: Partial<ToastStoreInput> = {}) {
	for (let index = 0; index < count; index += 1) {
		useToastStore
			.getState()
			.showToast(buildInput({ id: `fill-${index}`, ...overrides }));
	}
}

describe('toast store', () => {
	it('should append an entry with revision 0 when the id is new', () => {
		useToastStore.getState().showToast(buildInput({ id: 'a' }));
		useToastStore.getState().showToast(buildInput({ id: 'b' }));

		expect(getEntries().map((entry) => entry.id)).toEqual(['a', 'b']);
		expect(getEntry('a')).toMatchObject({
			revision: 0,
			isClosing: false,
			isPinned: false,
		});
	});

	it('should replace the entry in place and bump its revision when the id exists', () => {
		const { showToast } = useToastStore.getState();
		showToast(buildInput({ id: 'a', message: 'first' }));
		showToast(buildInput({ id: 'b' }));
		useToastStore.getState().setToastPinned('a', true);
		showToast(buildInput({ id: 'a', message: 'second' }));

		expect(getEntries().map((entry) => entry.id)).toEqual(['a', 'b']);
		expect(getEntry('a')).toMatchObject({
			message: 'second',
			revision: 1,
			isPinned: true,
		});
	});

	it('should revive a closing entry when its id is shown again', () => {
		const { showToast, dismissToast } = useToastStore.getState();
		showToast(buildInput({ id: 'a' }));
		dismissToast('a');
		showToast(buildInput({ id: 'a' }));

		expect(getEntry('a')).toMatchObject({ isClosing: false, revision: 1 });
	});

	it('should mark only the targeted entry closing when dismissing an id', () => {
		const { showToast, dismissToast } = useToastStore.getState();
		showToast(buildInput({ id: 'a' }));
		showToast(buildInput({ id: 'b' }));
		dismissToast('a');

		expect(getEntry('a')?.isClosing).toBe(true);
		expect(getEntry('b')?.isClosing).toBe(false);
	});

	it('should keep the same state reference when dismissing an unknown id', () => {
		useToastStore.getState().showToast(buildInput());
		const before = useToastStore.getState();
		useToastStore.getState().dismissToast('unknown');

		expect(useToastStore.getState()).toBe(before);
	});

	it('should mark every entry closing when dismissing without id', () => {
		const { showToast, dismissToast } = useToastStore.getState();
		showToast(buildInput({ id: 'a' }));
		showToast(buildInput({ id: 'b' }));
		dismissToast();

		expect(getEntries().every((entry) => entry.isClosing)).toBe(true);
	});

	it('should delete the entry when removing it', () => {
		const { showToast, removeToast } = useToastStore.getState();
		showToast(buildInput({ id: 'a' }));
		showToast(buildInput({ id: 'b' }));
		removeToast('a');

		expect(getEntries().map((entry) => entry.id)).toEqual(['b']);
	});

	it('should set the pinned flag and keep the state when the value is unchanged', () => {
		useToastStore.getState().showToast(buildInput({ id: 'a' }));
		useToastStore.getState().setToastPinned('a', true);
		const before = useToastStore.getState();
		useToastStore.getState().setToastPinned('a', true);

		expect(getEntry('a')?.isPinned).toBe(true);
		expect(useToastStore.getState()).toBe(before);
	});

	it('should close the oldest non-persistent entry when the limit is exceeded', () => {
		const { showToast } = useToastStore.getState();
		showToast(buildInput({ id: 'persistent', duration: Infinity }));
		fillToasts(TOAST_LIMIT);

		expect(getEntry('persistent')?.isClosing).toBe(false);
		expect(getEntry('fill-0')?.isClosing).toBe(true);
	});

	it('should skip pinned entries when evicting', () => {
		useToastStore.getState().showToast(buildInput({ id: 'pinned' }));
		useToastStore.getState().setToastPinned('pinned', true);
		fillToasts(TOAST_LIMIT);

		expect(getEntry('pinned')?.isClosing).toBe(false);
		expect(getEntry('fill-0')?.isClosing).toBe(true);
	});

	it('should close the oldest persistent entry when every candidate is persistent', () => {
		fillToasts(TOAST_LIMIT + 1, { duration: Infinity });

		expect(getEntry('fill-0')?.isClosing).toBe(true);
		expect(getEntry('fill-1')?.isClosing).toBe(false);
	});

	it('should evict only the new entry when every other entry is pinned', () => {
		fillToasts(TOAST_LIMIT);
		getEntries().forEach((entry) =>
			useToastStore.getState().setToastPinned(entry.id, true)
		);
		useToastStore.getState().showToast(buildInput({ id: 'extra' }));

		expect(getEntry('extra')?.isClosing).toBe(true);
		expect(getEntries().filter((entry) => entry.isClosing)).toHaveLength(1);
	});

	it('should empty the entries when resetting', () => {
		useToastStore.getState().showToast(buildInput());
		useToastStore.getState().resetToasts();

		expect(getEntries()).toEqual([]);
	});

	it('should drop the oldest closing entries when more than the closing limit pile up', () => {
		fillToasts(TOAST_LIMIT + 2);
		useToastStore.getState().dismissToast();
		useToastStore.getState().showToast(buildInput({ id: 'fresh' }));

		const closingIds = getEntries()
			.filter((entry) => entry.isClosing)
			.map((entry) => entry.id);
		expect(closingIds).toHaveLength(TOAST_LIMIT);
		expect(closingIds).not.toContain('fill-0');
		expect(getEntry('fresh')?.isClosing).toBe(false);
	});

	it('should keep the same state reference when resetting empty entries', () => {
		const before = useToastStore.getState();
		useToastStore.getState().resetToasts();

		expect(useToastStore.getState()).toBe(before);
	});
});
