// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { toast } from '#components/toast/toast';
import { useToastStore } from '#stores/toast_store/toast_store';

describe('toast on the server', () => {
	it('should return an id and leave the store empty when there is no window', () => {
		const id = toast('Hello');
		toast.dismiss();

		expect(id).toMatch(/^ms-toast-\d+$/);
		expect(useToastStore.getState().entries).toEqual([]);
	});
});
