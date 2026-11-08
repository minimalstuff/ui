import '@testing-library/jest-dom/vitest';

import { beforeEach, expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

import { useToastStore } from '#stores/toast_store/toast_store';

expect.extend(axeMatchers);

beforeEach(() => {
	useToastStore.getState().resetToasts();
});

/**
 * Accessibility assertions: in a component test, import `axe` from
 * 'vitest-axe' and assert `expect(await axe(container)).toHaveNoViolations()`.
 * The matcher is registered globally here and runs under happy-dom.
 */
