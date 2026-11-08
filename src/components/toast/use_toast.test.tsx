import { afterEach, describe, expect, test } from 'vitest';

import { useToast } from '#components/toast/use_toast';
import { useToastStore } from '#stores/toast_store/toast_store';

function getEntries() {
	return useToastStore.getState().entries;
}

afterEach(() => {
	useToastStore.getState().resetToasts();
});

describe('useToast', () => {
	test('should map the error tone to danger with a 6000 ms duration', () => {
		useToast().show({ message: 'Failed', tone: 'error' });

		expect(getEntries()[0]).toMatchObject({ tone: 'danger', duration: 6000 });
	});

	test('should default to the info tone with a 4000 ms duration', () => {
		useToast().show({ message: 'Saved' });

		expect(getEntries()[0]).toMatchObject({ tone: 'info', duration: 4000 });
	});

	test('should make a toast with an action persistent', () => {
		useToast().show({
			message: 'Removed',
			action: { label: 'Undo', onClick: () => undefined },
		});

		expect(getEntries()[0]?.duration).toBe(Infinity);
	});

	test('should let an explicit duration win over the action rule', () => {
		useToast().show({
			message: 'Removed',
			duration: 1500,
			action: { label: 'Undo', onClick: () => undefined },
		});

		expect(getEntries()[0]?.duration).toBe(1500);
	});

	test('should keep a React node message', () => {
		const message = <strong>Bold</strong>;
		useToast().show({ message });

		expect(getEntries()[0]?.message).toBe(message);
	});

	test('should dismiss a toast by id', () => {
		const id = useToast().show({ message: 'Saved' });

		useToast().dismiss(id);

		expect(getEntries()[0]?.isClosing).toBe(true);
	});
});
