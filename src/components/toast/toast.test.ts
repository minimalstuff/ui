import { describe, expect, it } from 'vitest';

import { toast } from '#components/toast/toast';
import { useToastStore } from '#stores/toast_store/toast_store';

function getEntries() {
	return useToastStore.getState().entries;
}

describe('toast', () => {
	it('should return a generated id when none is given', () => {
		expect(toast('Hello')).toMatch(/^ms-toast-\d+$/);
	});

	it('should return the given id when one is provided', () => {
		expect(toast('Hello', { id: 'custom' })).toBe('custom');
	});

	it('should show an info toast when called directly', () => {
		toast('Hello');

		expect(getEntries()[0]).toMatchObject({ message: 'Hello', tone: 'info' });
	});

	it.each([
		['info', 'info'],
		['success', 'success'],
		['warning', 'warning'],
		['error', 'danger'],
	] as const)('should map toast.%s to the %s tone', (method, tone) => {
		toast[method]('Hello');

		expect(getEntries()[0]?.tone).toBe(tone);
	});

	it.each([
		['info', 5000],
		['success', 5000],
		['warning', Infinity],
		['error', Infinity],
	] as const)(
		'should default toast.%s to a duration of %s',
		(method, duration) => {
			toast[method]('Hello');

			expect(getEntries()[0]?.duration).toBe(duration);
		}
	);

	it('should keep the toast until dismissed when it has an action', () => {
		toast('Hello', { action: { label: 'Undo', onClick: () => {} } });

		expect(getEntries()[0]?.duration).toBe(Infinity);
	});

	it('should use the explicit duration when one is given', () => {
		toast.error('Hello', { duration: 0 });
		toast('World', {
			duration: 1200,
			action: { label: 'Undo', onClick: () => {} },
		});

		expect(getEntries().map((entry) => entry.duration)).toEqual([0, 1200]);
	});

	it('should store the description and action when given', () => {
		const action = { label: 'Undo', onClick: () => {} };
		toast('Hello', { description: 'Details', action });

		expect(getEntries()[0]).toMatchObject({ description: 'Details', action });
	});

	it('should keep one entry at revision 1 when the same id is shown twice', () => {
		toast('First', { id: 'same' });
		toast('Second', { id: 'same' });

		expect(getEntries()).toHaveLength(1);
		expect(getEntries()[0]).toMatchObject({ message: 'Second', revision: 1 });
	});

	it('should close only the given toast when dismissing an id', () => {
		toast('One', { id: 'one' });
		toast('Two', { id: 'two' });
		toast.dismiss('one');

		expect(getEntries().map((entry) => entry.isClosing)).toEqual([true, false]);
	});

	it('should close every toast when dismissing without id', () => {
		toast('One');
		toast('Two');
		toast.dismiss();

		expect(getEntries().every((entry) => entry.isClosing)).toBe(true);
	});
});
