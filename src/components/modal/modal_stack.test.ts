import { describe, expect, test } from 'vitest';

import { isTopmostModal, registerModal } from './modal_stack';

describe('modal stack', () => {
	test('a single registered modal is topmost', () => {
		const token = Symbol('modal');
		const unregister = registerModal(token);

		expect(isTopmostModal(token)).toBe(true);

		unregister();
	});

	test('the most recently registered modal is topmost', () => {
		const firstToken = Symbol('modal');
		const secondToken = Symbol('modal');
		const unregisterFirst = registerModal(firstToken);
		const unregisterSecond = registerModal(secondToken);

		expect(isTopmostModal(firstToken)).toBe(false);
		expect(isTopmostModal(secondToken)).toBe(true);

		unregisterSecond();
		unregisterFirst();
	});

	test('unregistering the topmost modal restores the one beneath it', () => {
		const firstToken = Symbol('modal');
		const secondToken = Symbol('modal');
		const unregisterFirst = registerModal(firstToken);
		const unregisterSecond = registerModal(secondToken);

		unregisterSecond();

		expect(isTopmostModal(firstToken)).toBe(true);

		unregisterFirst();
	});

	test('a token that was never registered is never topmost', () => {
		const token = Symbol('modal');

		expect(isTopmostModal(token)).toBe(false);
	});

	test('unregistering twice is a no-op the second time', () => {
		const firstToken = Symbol('modal');
		const secondToken = Symbol('modal');
		const unregisterFirst = registerModal(firstToken);
		const unregisterSecond = registerModal(secondToken);

		unregisterFirst();
		unregisterFirst();

		expect(isTopmostModal(secondToken)).toBe(true);

		unregisterSecond();
	});
});
